const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { login, register, logout } = require('../controllers/authController');
const jobdetailController = require('../controllers/jobdetailController');
const joblistController = require('../controllers/joblistController');
const userLayout = '../views/layouts/userLogin';
const adminLayout = '../views/layouts/adminLogin';
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser, redirectIfAuthenticated, checkPremiumUser } = require('../midlewares/usersMiddleWares/requireAuth')

const profileImageController = require('../controllers/updateProfileController');

const { applyPremiumjob, getApplypremiumJob } = require('../controllers/premiumJobController');
const jobdetail = require('../controllers/jobdetailController');

const Review = require('../models/review');
const { getUserReview, postUserReview } = require('../controllers/reviewController')
const upload = require('../multerConfig')
const update = require('../controllers/updateProfileController')
const updateUser = require('../controllers/userController')
const crypto = require('crypto');
const nodemailer = require('nodemailer');


router.post('/profileimage', checkUser, requireAuth,)



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
  res.render('login', { layout: userLayout });
});
router.post('/login', login);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/signup', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('signup', { layout: userLayout });
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
  res.render('forgot-password', { layout: userLayout });
});

// Function to generate a random token
function generateRandomToken() {
  return crypto.randomBytes(20).toString('hex');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chibseze933@gmail.com',
    pass: 'fmyb bqkv madm hmpx',
  },
});

function sendEmail(to, subject, html) {
  const mailOptions = {
    from: 'chibseze933@gmail.com',
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.render('forgot-password', {
        layout: userLayout,
        errorMessage: 'User not found with the provided email',
      });
    }

    // Generate a unique token for password reset (you can use a library like `crypto`)
    const resetToken = generateRandomToken();

    // Save the reset token and its expiration time to the user in the database
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();


    // Send an email with a link containing the reset token
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const emailSubject = 'Password Reset Request';
    const emailHTML = `<p>You have requested a password reset. Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`;


    await sendEmail(user.email, emailSubject, emailHTML);

    res.render('forgot-password', {
      layout: userLayout,
      successMessage: 'Password reset link sent successfully. Check your email.',
    });
  } catch (error) {
    console.error(error);
    res.render('forgot-password', {
      layout: userLayout,
      errorMessage: 'Internal Server Error. Please try again later.',
    });
  }
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                  RESET PASSWORD ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/reset-password/:token', checkUser, redirectIfAuthenticated, async (req, res) => {
  try {

    const locals = {
      title: 'TeqVerse - Reset Password'
  };
    const token = req.params.token;

    // Find the user with the provided reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      // Token is invalid or expired
      return res.render('reset-password', {
        layout: userLayout,
        locals,
        errorMessage: 'Invalid or expired reset token. Please request a new one.',
      });
    }

    // Render the reset password page with the token (hidden input field in the form)
    res.render('reset-password', {
      layout: userLayout,
      token,
    });
  } catch (error) {
    console.error(error);
    res.render('reset-password', {
      layout: userLayout,
      errorMessage: 'Internal Server Error. Please try again later.',
    });
  }
});


router.post('/reset-password/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const newPassword = req.body.newPassword; // Assuming there's an input field with the name "newPassword"

    // Find the user with the provided reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }, // Check if the token is still valid
    });

    if (!user) {
      // Token is invalid or expired
      return res.render('reset-password', {
        layout: userLayout,
        errorMessage: 'Invalid or expired reset token. Please request a new one.',
      });
    }

    // Update the user's password
    user.password = newPassword;
    // Clear the reset token and its expiration time
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    console.log(newPassword)
    await user.save();

   // Redirect to the login page or any other page you prefer
   res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('reset-password', {
      layout: userLayout,
      errorMessage: 'Internal Server Error. Please try again later.',
    });
  }
});



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
    res.render('user-profile', { layout: adminLayout, locals });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }

});


/**--------------------------------------------------------------------------------------------------- **/
/**                                  REVIEW ROUTE                                                **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/user-review', checkUser, requireAuth, getUserReview);

// POST route to handle adding a review
router.post('/user-review', checkUser, requireAuth, postUserReview);






// Apply for a job route
router.get('/apply-job/:id', requireAuth, checkUser, checkPremiumUser, getApplypremiumJob);

// Submit job application route
router.post('/apply-job/:id', checkPremiumUser, requireAuth, checkUser, upload.single('cv'), applyPremiumjob);







module.exports = router;