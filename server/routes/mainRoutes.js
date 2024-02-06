const express = require('express');
const router = express.Router();
const { login, register, logout} = require('../controllers/authController');
const jobdetailController = require('../controllers/jobdetailController');
const joblistController = require('../controllers/joblistController');
const userLayout = '../views/layouts/userLogin';
const adminLayout = '../views/layouts/adminLogin';
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser, redirectIfAuthenticated } = require('../midlewares/usersMiddleWares/requireAuth')
const upload = require('../midlewares/imageUploader')
const profileImageController = require('../controllers/uploadImageController');
const Review = require('../models/review');






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
router.get('/faq', (req, res) => {
    res.render('faq');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  ABOUT US ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/about-us', (req, res) => {
    res.render('about-us');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  MEDIA ROUTE                                                       **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/media', (req, res) => {
    res.render('media');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  RESOURCES ROUTE                                                   **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/resources', (req, res) => {
    res.render('resources');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  LEARNING ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/learning', (req, res) => {
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
router.get('/user-review', checkUser, requireAuth, async (req, res) => {
  try {
    // Fetch all reviews initially
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.render('user-review', { layout: adminLayout, reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).send('Failed to fetch reviews: ' + error.message);
  }
});

// POST route to handle adding a review
router.post('/user-review', async (req, res) => {
  try {
    const { user, title, techSpecialty, rating, comment } = req.body;

    const newReview = new Review({
      user,
      title,
      techSpecialty,
      rating,
      comment,
    });

    await newReview.save();

    // Redirect to the user-review page or display a success message
    res.redirect('/user-review');
  } catch (error) {
    // Handle errors
    console.error('Error creating review:', error);
    res.status(500).send('Failed to create review: ' + error.message);
  }
});



module.exports = router;
