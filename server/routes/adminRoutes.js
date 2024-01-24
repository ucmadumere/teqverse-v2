const express = require('express');
const router = express.Router();
const adminauthController = require('../controllers/adminauthController')
const adminLayout = '../views/layouts/adminLogin';




/**--------------------------------------------------------------------------------------------------- **/
/**                                   DASHBOARD                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/dashboard2', (req, res) => {
  // res.render('admin/signin');
  res.render('admin/dashboard2', {layout: adminLayout });
});


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





module.exports = router