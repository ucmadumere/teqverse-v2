const jwt = require("jsonwebtoken");
const adminUser = require("../../models/adminUserModel");
const User = require("../../models/userModel")


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



const checkAdminUser = async (req, res, next) => {
  const adminToken = req.cookies.admintoken;
  const userToken = req.cookies.token;

  if (adminToken || userToken) {
    try {
      const token = adminToken || userToken;
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      if (adminToken) {
        user = await adminUser.findById(decodedToken.userId);
      } else if (userToken) {
        user = await User.findById(decodedToken.userId);
      }

      if (!user || (user.role !== 'admin' && user.role !== 'superuser')) {
        res.redirect('/?failure=Unauthorized Access: You are not authorized to view this page.');
      } else {
        res.locals.user = user;
        next();
      }
    } catch (err) {
      res.status(500).json({ error: 'Server Error' });
    }
  } else {
    res.status(403).json({ error: 'Unauthorized' });
  }
};






module.exports = {
  requireAdminAuth,
  checkAdminUser,
  redirectIfAuthenticated
};
