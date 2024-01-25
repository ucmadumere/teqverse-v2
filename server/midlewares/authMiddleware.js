const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const adminUser = require('../models/adminUserModel')


const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                res.redirect('/login')
            }
            else{
                next()
            };
        });
    }
    else{
        res.redirect('/login')
    };
};




const checkUser = (req, res, next) => {
  const token = req.cookies.token;
  

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        try {
          let user = await User.findById(decodedToken.userId);
          let adminuser = await adminUser.findById(decodedToken.userId);
          
          if (user && user.role === 'admin') {
            res.locals.user = user;
            res.locals.admin = true;
            next();
          } else if (adminuser && adminuser.role === 'superuser') {
            res.locals.user = adminuser;
            res.locals.superuser = true;
            next();
          } else {
            res.locals.user = user; 
            res.locals.admin = false;
            res.locals.superuser = false;
            next();
          }
        } catch (error) {
          console.error(error);
          res.locals.user = null;
          res.locals.admin = false;
          res.locals.superuser = false;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    res.locals.admin = false;
    res.locals.superuser = false;
    next();
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


  const redirectAdminIfAuthenticated = (req, res, next) => {
    if (res.locals.user) {
      // If the user is authenticated, redirect them to the dashboard
      res.redirect('/dashboard2');
    } else {
      // If the user is not authenticated, continue to the route handler
      next();
    }
  };



  const isAdminOrSuperuser = (req, res, next) => {
  const userRole = req.user.role;

  
  if (userRole === 'admin' || userRole === 'superuser') {
    next();
  } else {
    res.status(403).send('Access denied'); 
  }
};



module.exports = {
    requireAuth,
    checkUser,
    redirectIfAuthenticated,
    redirectAdminIfAuthenticated,
    isAdminOrSuperuser
}