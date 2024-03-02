const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const adminauthController = require('../controllers/adminauthController')
const adminLayout = '../views/layouts/adminLogin';

const { checkAdminUser, requireAdminAuth } = require('../midlewares/adminMiddleWares/requireAdminAuth')
const { createJob } = require('../controllers/postadminController')
const Review = require('../models/review');
const { 
  getUpdateStatusForm, 
  updateStatus 
} = require('../controllers/updateJobStatusController');

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
  getGuestList } = require('../controllers/postadminController');




/**--------------------------------------------------------------------------------------------------- **/
/**                                   EDIT GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/edit-job/:id', getEditJob, (req, res) => {
  res.render('admin/edit-job', { locals, data, layout: adminLayout });
});

router.put('/edit-job/:id', updatejob);




/**--------------------------------------------------------------------------------------------------- **/
/**                                   DASHBOARD                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/dashboard', requireAdminAuth, checkAdminUser, (req, res) => {
  const admintoken = req.cookies.token;

  if (admintoken) {
    jwt.verify(admintoken, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.render('login');
      } else {
        res.render('admin/dashboard', { layout: adminLayout });
      };
    });
  } else {
    res.render('admin/dashboard', { layout: adminLayout });
  }
});


/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
// router.get('/create-superuser', (req, res) => {
//   res.render('admin/signup', { layout: adminLayout });
// });
// router.post('/create-superuser', adminauthController.createSuperuser);


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
/**                                   GUEST JOB LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/guest-user-job', getGuestList, (req, res) => {
  res.render('admin/guest-user-job', { layout: adminLayout });
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   REVIEW LIST                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/review-list', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // Fetch reviews from the database and sort by createdAt
    res.render('admin/review-list', { layout: adminLayout, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Failed to fetch reviews: ' + error.message);
  }
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   USER APPLICATION                                                  **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/applications', async (req, res) => {
  try {
    res.render('admin/applications', { layout: adminLayout });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send(error.message);
  }
});




/**--------------------------------------------------------------------------------------------------- **/
/**                                  Delete Job                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
router.delete('/delete-job/:id', deleteJob);




router.get('/update-status/:id', checkAdminUser, getUpdateStatusForm);


router.post('/update-status/:id', checkAdminUser, updateStatus);

module.exports = router