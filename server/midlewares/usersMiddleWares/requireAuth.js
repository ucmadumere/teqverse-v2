const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

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
    res.redirect("/index");
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
