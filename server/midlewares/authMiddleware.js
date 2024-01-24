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
  const token = req.cookies.jwt;

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
            res.locals.user = user; // Assuming user and adminUser schema have similar fields
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
  





//   const checkAdminUser = (req, res, next) => {
//     const token = req.cookies.jwt;
  
//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
//         if (err) {
//           res.locals.user = null;
//           next();
//         } else {
//           try {
//             let adminUser = await AdminUser.findById(decodedToken.userId);
//             if (!adminUser) {
//               throw new Error('User not found');
//             }
//             res.locals.adminUser = adminUser;
//             next();
//           } catch (error) {
//             console.error(error);
//             res.locals.user = null;
//             next();
//           }
//         }
//       });
//     } else {
//       res.locals.adminUser = null;
//       next();
//     }
//   };






// const checkUser = (req, res, next) => {
//     const token = req.cookies.jwt

//     if(token){

//         jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
//             if(err){
//                 res.locals.user = null
//                 next()
//             }
//             else{
//                 let user = await User.findById(decodedToken.userId)
//                 res.locals.user = user
//                 next()
//             }
//         })

//     }else{
//         res.locals.user = null;
//         next();
//     }
// }


module.exports = {
    requireAuth,
    checkUser,
    redirectIfAuthenticated,
}