const express = require('express');
const router = express.Router();
const adminauthController = require('../controllers/adminauthController')



/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/create-superuser', (req, res) => {
    res.render('admin/signup');
  });
router.post('/create-superuser', adminauthController.createSuperuser);


/**--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login-superuser', (req, res) => {
  res.render('admin/signin');
});
router.post('/login-superuser', adminauthController.loginAdmin);


module.exports = router