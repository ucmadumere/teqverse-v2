const express = require('express');
const router = express.Router();
const adminauthController = require('../controllers/adminauthController')
const adminLayout = '../views/layouts/adminLogin';



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
  // res.render('admin/signin');
  res.render('admin/index', {layout: adminLayout });
});
router.post('/login-superuser', adminauthController.loginAdmin);

/**--------------------------------------------------------------------------------------------------- **/
/**                                   DASHBOARD                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
// const getDashboard = async (req, res) => {
//     try {
//         const locals = {
//             title: 'Dashboard'
//         }

//         const data = await postJob.find();
//         res.render('admin/dashboard', {
//             locals,
//             data,
//             layout: adminLayout
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }


module.exports = router