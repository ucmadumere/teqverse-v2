const express = require('express');
const router = express.Router();
const adminauthController = require('../controllers/adminauthController')
const adminLayout = '../views/layouts/adminLogin';



/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/create-superuser', (req, res) => {
    res.render('admin/signup', {layout: adminLayout });
  });
router.post('/create-superuser', adminauthController.createSuperuser);


/**--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login-superuser', (req, res) => {
  // res.render('admin/signin');
  res.render('admin/index', {layout: adminLayout });
});
router.post('/login-superuser', adminauthController.loginAdmin);

/**--------------------------------------------------------------------------------------------------- **/
/**                                   DASHBOARD                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/dashboard2', (req, res) => {
  // res.render('admin/signin');
  res.render('admin/dashboard2', {layout: adminLayout });
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   ADD GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
// router.get('/dashboard', (req, res) => {
//   res.render('admin/dashboard', {layout: adminLayout });
// });



module.exports = router