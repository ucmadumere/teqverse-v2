const express = require('express');
const router = express.Router();
const { login, register, logout} = require('../controllers/authController');
const jobdetailController = require('../controllers/jobdetailController');
const joblistController = require('../controllers/joblistController');
const userLayout = '../views/layouts/userLogin';
const adminLayout = '../views/layouts/adminLogin';
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser, redirectIfAuthenticated, checkPremiumUser } = require('../midlewares/usersMiddleWares/requireAuth')

const profileImageController = require('../controllers/updateProfileController');

const {applyPremiumjob, getApplypremiumJob} = require('../controllers/premiumJobController');
const jobdetail = require('../controllers/jobdetailController');

const Review = require('../models/review');
const {getUserReview, postUserReview} = require('../controllers/reviewController')
const upload = require('../multerConfig')
const update = require('../controllers/updateProfileController')
const updateUser = require('../controllers/userController')



router.post('/profileimage', checkUser, requireAuth, )



/**--------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/', checkUser, async (req, res) => {
  try {
    // Fetch top 4 reviews based on rating in descending order
    const topReviews = await Review.find({ rating: { $gte: 3, $lte: 5 } })
      .sort({ rating: -1 })
      .limit(4);

    // Fetch 4 random reviews based on the same criteria
    const randomReviews = await Review.aggregate([
      { $match: { rating: { $gte: 3, $lte: 5 } } },
      { $sample: { size: 4 } }
    ]);

    res.render('index', { topReviews, randomReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Failed to fetch reviews: ' + error.message);
  }
});




/**--------------------------------------------------------------------------------------------------- **/
/**                                  FAQ ROUTE                                                         **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/faq', checkUser, (req, res) => {
    res.render('faq');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  ABOUT US ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/about-us', checkUser, (req, res) => {
    res.render('about-us');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  MEDIA ROUTE                                                       **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/media', checkUser, (req, res) => {
    res.render('media');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  RESOURCES ROUTE                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/resources', checkUser, requireAuth, (req, res) => {
    res.render('resources');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  LEARNING ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/learning', checkUser, requireAuth, (req, res) => {
    res.render('learning');
});
router.get('/learning-mentor', (req, res) => {
    res.render('learning-mentor');
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('login', {layout: userLayout });
});
router.post('/login', login);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/signup', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('signup', {layout: userLayout });
});
router.post('/signup', register);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  LOG OUT ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/logout', logout)
/**--------------------------------------------------------------------------------------------------- **/
/**                                  FORGOT PASSWORD ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/forgot-password', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('forgot-password', {layout: userLayout });
});
router.post('/forgot-password');
/**--------------------------------------------------------------------------------------------------- **/
/**                                  RESET PASSWORD ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/reset-password', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('reset-password', {layout: userLayout });
});
router.post('/reset-password');


/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB DETAILS ROUTE                                                 **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/jobdetails/:id?', checkUser, requireAuth, jobdetailController);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB LIST ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/joblist', checkUser, requireAuth, joblistController);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB FILTER ROUTE                                                  **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/resetfilters', checkUser, requireAuth, (req, res) => {
    // Redirect to the joblist route without any filter parameters
    res.redirect('/joblist');
});
          
/**--------------------------------------------------------------------------------------------------- **/
/**                                  EDIT PROFILE ROUTE                                                **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/update-profile', checkUser, requireAuth, async (req, res) => {
  try {
    const locals = {
      title: 'TeqVerse - Edit Profile'
  };
    res.render('edit-profile', {layout: adminLayout, locals});
  } catch (error) {
    console.error( error);
    res.status(500).send( error.message);
  }
  
});


router.post('/update-profile', checkUser, requireAuth, updateUser, update, (req, res) => {});

router.get('/user-profile', checkUser, requireAuth, (req, res) => {
  try {
    const locals = {
      title: 'TeqVerse - View Profile'
    };
    res.render('user-profile', {layout: adminLayout, locals});
  } catch (error) {
    console.error( error);
    res.status(500).send( error.message);
  }
  
});


/**--------------------------------------------------------------------------------------------------- **/
/**                                  REVIEW ROUTE                                                **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/user-review', checkUser, requireAuth, getUserReview);

// POST route to handle adding a review
router.post('/user-review',checkUser, requireAuth, postUserReview);






// Apply for a job route
router.get('/apply-job/:id', requireAuth, checkUser, checkPremiumUser, getApplypremiumJob);

// Submit job application route
router.post('/apply-job/:id', checkPremiumUser, requireAuth, checkUser, upload.single('cv'), applyPremiumjob);




module.exports = router;