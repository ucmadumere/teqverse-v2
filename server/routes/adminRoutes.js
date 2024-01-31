const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const adminauthController = require('../controllers/adminauthController')
const adminLayout = '../views/layouts/adminLogin';

const { checkAdminUser, requireAdminAuth } = require('../midlewares/adminMiddleWares/requireAdminAuth')
const { createJob } = require('../controllers/postadminController')


const { logout,
  deleteJob,
  updatejob,
  getEditJob,
  getEditPremiumJob,
  postAddJob,
  getAddJob,
  getDashboard,
  postAdmin,
  getAdmin,
  getPremiumList,
  getGuestList } = require('../controllers/postadminController')




/**--------------------------------------------------------------------------------------------------- **/
/**                                   EDIT GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/

router.get('/edit-job/:id', getEditJob, (req, res) => {
  res.render('admin/edit-job', { locals, data, layout: adminLayout });
});

router.put('/edit-job/:id', updatejob);


/**--------------------------------------------------------------------------------------------------- **/
/**                                   EDIT GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/edit-job/:id', getEditJob, (req, res) => {
  res.render('admin/edit-job', { locals, data, layout: adminLayout });
});

router.put('/edit-job/:id', updatejob);

/**--------------------------------------------------------------------------------------------------- **/
/**                                   EDIT PREMIUM JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/edit-premium-job/:id', getEditPremiumJob, (req, res) => {
  res.render('admin/edit-premium-job', { locals, data, layout: adminLayout });
});

router.put('/edit-premium-job/:id', updatejob);


/**--------------------------------------------------------------------------------------------------- **/
/**                                   DASHBOARD                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/dashboard2', requireAdminAuth, checkAdminUser, (req, res) => {
  const admintoken = req.cookies.token;

  if (admintoken) {
    jwt.verify(admintoken, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.render('login');
      } else {
        res.render('admin/dashboard2', { layout: adminLayout });
      };
    });
  } else {
    res.render('admin/dashboard2', { layout: adminLayout });
  }
});


/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/create-superuser', (req, res) => {
  res.render('admin/signup', { layout: adminLayout });
});
router.post('/create-superuser', adminauthController.createSuperuser);


/**--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login-superuser', (req, res) => {
  // res.render('admin/signin');
  res.render('admin/login', { layout: adminLayout });
});
router.post('/login-superuser', adminauthController.loginAdmin);


router.get('/adminlogout', adminauthController.adminLogout)



/**--------------------------------------------------------------------------------------------------- **/
/**                                   ADD GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/add-job', (req, res) => {
  res.render('admin/add-job', { layout: adminLayout });
});

router.post('/add-job', createJob)
/**--------------------------------------------------------------------------------------------------- **/
/**                                   ADD PREMIUM JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/add-premium-job', (req, res) => {
  res.render('admin/add-premium-job', { layout: adminLayout });
});

router.post('/add-premium-job', createJob)




/**--------------------------------------------------------------------------------------------------- **/
/**                                   GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/guest-user-job', getGuestList, (req, res) => {
  res.render('admin/guest-user-job', { layout: adminLayout });
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                   PREMIUM JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/premium-user-job', getPremiumList, (req, res) => {
  res.render('admin/premium-user-job', { layout: adminLayout });
});



/**--------------------------------------------------------------------------------------------------- **/
/**                                  Delete Job                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
router.delete('/delete-job/:id', deleteJob);


module.exports = router