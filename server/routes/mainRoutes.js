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
const review = require('../models/review');






router.get('/upload-profile-image', checkUser, (req, res) => {
  res.render('upload-profile-image', {layout: adminLayout}); 
});

router.post('/upload-profile-image', checkUser, profileImageController.uploadProfileImage);





/**--------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/', checkUser, (req, res) => {
    res.render('index')
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
router.get('/user-review', checkUser, requireAuth, (req, res) => {
  res.render('user-review', {layout: adminLayout});
});

router.post('/user-review', async (req, res) => {
  try {
    const { user, rating, comment } = req.body;
    const newReview = new review({ user, rating, comment });
    await newReview.save();
    res.redirect('/user-review');
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).send('Failed to add review: ' + error.message);
  }
});


module.exports = router;
