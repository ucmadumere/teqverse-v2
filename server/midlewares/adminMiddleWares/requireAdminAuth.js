const jwt = require("jsonwebtoken");
const adminUser = require("../../models/adminUserModel");

const requireAdminAuth = (req, res, next) => {
  const token = req.cookies.admintoken;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect("/login-superuser");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/dashboard");
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



const checkAdminUser = (req, res, next) => {
  const token = req.cookies.admintoken;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals = null;
        next();
      }
      else {
        let user = await adminUser.findById(decodedToken.userId);
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
  requireAdminAuth,
  checkAdminUser,
  redirectIfAuthenticated
};
