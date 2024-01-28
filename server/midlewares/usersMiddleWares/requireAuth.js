const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const userLayout = '../views/layouts/userLogin';

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
    res.status(400).render('error400', {
      errorCode: 400,
      errorMessage: 'Page Error',
      errorDescription: 'Sorry, You do not have access to this page. Do login or sign up to Access Available Jobs...',
      layout: userLayout,
    });
  }
};


const redirectIfAuthenticated = (req, res, next) => {
  if (res.locals.user) {
    // If the user is authenticated, redirect them to the dashboard
    res.redirect('/');
  } else {
    // If the user is not authenticated, continue to the route handler
    next();
  }
};



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


module.exports = {
  requireAuth,
  checkUser,
  redirectIfAuthenticated
};
