const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const adminauthController = require('../controllers/adminauthController')
const adminLayout = '../views/layouts/adminLogin';
const { redirectAdminIfAuthenticated, isAdminOrSuperuser } = require('../midlewares/authMiddleware');
const  { checAdminkUser }  = require('../midlewares/adminAuthMiddleware')




/**--------------------------------------------------------------------------------------------------- **/
/**                                   DASHBOARD                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/dashboard2', (req, res) => {
  const admintoken = req.cookies.token;

  if(admintoken) {
    jwt.verify(admintoken, process.env.JWT_SECRET, (err, decodedToken) => {
        if(err) {
          res.render('login');
        }else{
          res.render('admin/dashboard2', {layout: adminLayout });
        };
    });
  } else{
  res.render('admin/dashboard2', {layout: adminLayout });
  }
});


/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/create-superuser',  redirectAdminIfAuthenticated, (req, res) => {
    res.render('admin/signup', {layout: adminLayout });
  });
router.post('/create-superuser', redirectAdminIfAuthenticated, adminauthController.createSuperuser);


/**--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login-superuser', redirectAdminIfAuthenticated, (req, res) => {
  // res.render('admin/signin');
  res.render('admin/login', {layout: adminLayout });
});
router.post('/login-superuser', redirectAdminIfAuthenticated, adminauthController.loginAdmin);


router.get('/adminlogout', adminauthController.adminLogout)



/**--------------------------------------------------------------------------------------------------- **/
/**                                   ADD GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
// router.get('/dashboard', (req, res) => {
//   res.render('admin/dashboard', {layout: adminLayout });
// });



module.exports = router