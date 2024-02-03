const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jobdetailController = require('../controllers/jobdetailController');
const joblistController = require('../controllers/joblistController');
const userLayout = '../views/layouts/userLogin';
const adminLayout = '../views/layouts/adminLogin';
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser, redirectIfAuthenticated, checkPremiumUser } = require('../midlewares/usersMiddleWares/requireAuth')
const upload = require('../midlewares/imageUploader')
const profileImageController = require('../controllers/uploadImageController');

const {applyPremiumjob, getApplypremiumJob} = require('../controllers/premiumJobController');
const jobdetail = require('../controllers/jobdetailController');

const Review = require('../models/review');

const User = require('../models/userModel')






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


  router.get('/user-review', checkUser, requireAuth, async (req, res) => {
    try {
      // Retrieve the JWT token from the request cookies
      const token = req.cookies.token;
  
      if (!token) {
        // If the token is missing, the user is not authenticated
        res.status(401).send('Authentication required');
        return;
      }
  
      // Verify the JWT token to extract user details
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;

      const user = await User.findById(userId).exec();



    if (!user) {
      // Handle case where user is not found
      res.status(404).send('User not found');
      return;
    }

  
      // Fetch reviews made by the logged-in user
      const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });
      res.render('user-review', { layout: adminLayout, user, reviews });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).send('Failed to fetch user reviews: ' + error.message);
    }
  });
  





router.post('/user-review', async (req, res) => {
  try {
    const token = req.cookies.token; // Assuming the JWT token is stored in a cookie
    if (!token) {
      // Handle case where token is missing
      res.status(401).send('Authentication required');
      return;
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    // Assuming you have a way to retrieve user details from the database
    // You can use the userId to fetch the user's details from the database
    // Replace this with your actual code to retrieve user details
    const user = await User.findById(userId).exec();
    console.log(user.first_name)
    

    if (!user) {
      // Handle case where user is not found
      res.status(404).send('User not found');
      return;
    }

    const { title, techSpecialty, rating, comment } = req.body;


    let fullName = user.first_name;
      if (user.other_names) {
      fullName += ` ${user.other_names}`;
    }
    fullName += ` ${user.last_name}`;

    const newReview = new Review({
      user: user._id, // Assuming user._id is the correct field for the user's ID
      fullName,
      email: user.email, // Use the user's email
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





// Apply for a job route
router.get('/apply-job/:id', requireAuth, checkUser, checkPremiumUser, getApplypremiumJob);

// Submit job application route
router.post('/apply-job/:id', checkPremiumUser, requireAuth, checkUser, applyPremiumjob);


module.exports = router;
