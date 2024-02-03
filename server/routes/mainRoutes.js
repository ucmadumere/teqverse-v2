const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jobdetailController = require('../controllers/jobdetailController');
const joblistController = require('../controllers/joblistController');
const userLayout = '../views/layouts/userLogin';
const adminLayout = '../views/layouts/adminLogin';
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser, redirectIfAuthenticated } = require('../midlewares/usersMiddleWares/requireAuth')
const upload = require('../midlewares/imageUploader')
const profileImageController = require('../controllers/uploadImageController');
const Review = require('../models/review');
const {getUserReview, postUserReview} = require('../controllers/reviewController')






router.get('/upload-profile-image', checkUser, (req, res) => {
  res.render('upload-profile-image', {layout: adminLayout}); 
});

router.post('/upload-profile-image', checkUser, profileImageController.uploadProfileImage);





/**--------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/', checkUser, async (req, res) => {
  try {
    // Fetch top 4 reviews based on rating in descending order
    // const topReviews = await Review.find()
    const topReviews = await Review.find({ rating: { $gte: 3, $lte: 5 } })
      .sort({ rating: -1 })
      .limit(4);

    res.render('index', { topReviews });
  } catch (error) {
    console.error('Error fetching top reviews:', error);
    res.status(500).send('Failed to fetch top reviews: ' + error.message);
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
router.get('/resources', checkUser, (req, res) => {
    res.render('resources');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  LEARNING ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/learning', checkUser, (req, res) => {
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
router.post('/login', authController.login);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/signup', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('signup', {layout: userLayout });
});
router.post('/signup', authController.register);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  LOG OUT ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/logout', authController.logout)

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
router.get('/edit-profile', checkUser, requireAuth, (req, res) => {
  res.render('edit-profile', {layout: adminLayout});
});
//router.post('/edit-profile', edit)

router.get('/user-profile', checkUser, requireAuth, (req, res) => {
  res.render('user-profile', {layout: adminLayout});
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                  REVIEW ROUTE                                                **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/user-review', checkUser, requireAuth, getUserReview);

// POST route to handle adding a review
router.post('/user-review',checkUser, requireAuth, postUserReview);



module.exports = router;
