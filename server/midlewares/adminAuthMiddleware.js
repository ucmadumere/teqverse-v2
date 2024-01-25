
const jwt = require('jsonwebtoken');
const adminUser = require('../models/adminUserModel'); 




// Middleware to check user authentication and role
const checkAdminkUser = (req, res, next) => {
  const admintoken = req.cookies.admintoken;

  if (admintoken) {
    jwt.verify(admintoken, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        try {
          const user = await adminUser.findById(decodedToken.userId);
          if (user) {
            res.locals.user = user;
          } else {
            res.locals.user = null;
          }
          next();
        } catch (error) {
          console.error(error);
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};



module.exports = {
    checkAdminkUser
}
