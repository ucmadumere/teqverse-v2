const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const userLayout = '../views/layouts/userLogin';




/**--------------------------------------------------------------------------------------------------- **/
/**                            Portects Routes from Un-Authenticated users                             **/
/**--------------------------------------------------------------------------------------------------- **/
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.status(400).render('login', {

      layout: userLayout,
    });
  }
};






/**--------------------------------------------------------------------------------------------------- **/
/**                  Check decodes token and send user details to the front end                        **/
/**--------------------------------------------------------------------------------------------------- **/
const checkUser = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals = null;
        next();
      }
      else {
        let user = await User.findById(decodedToken.userId);
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
};



/**--------------------------------------------------------------------------------------------------- **/
/**                             A Middle Ware that redirects a logged in user                          **/
/**                         when they try to access the login page while logged in                     **/
/**--------------------------------------------------------------------------------------------------- **/
const redirectIfAuthenticated = (req, res, next) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  return next();
};





module.exports = {
  requireAuth,
  checkUser,
  redirectIfAuthenticated
};
