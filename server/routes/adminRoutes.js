const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const adminauthController = require('../controllers/adminauthController')
const adminLayout = '../views/layouts/adminLogin';
const { redirectAdminIfAuthenticated, isAdminOrSuperuser } = require('../midlewares/authMiddleware');
const  { checAdminkUser }  = require('../midlewares/adminAuthMiddleware');
const { logout,
  deletePost,
  updatejob,
  getEditJob,
  postAddJob,
  getAddJob,
  getDashboard,
  postAdmin,
  getAdmin,
  getGuestList} = require('../controllers/postadminController')




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
router.get('/add-job', (req, res) => {
  res.render('admin/add-job', {layout: adminLayout });
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   EDIT GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/edit-job', (req, res) => {
  res.render('admin/edit-job', {layout: adminLayout });
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/guest-user-job', getGuestList, (req, res) => {
  res.render('admin/guest-user-job', {layout: adminLayout });
});


module.exports = router