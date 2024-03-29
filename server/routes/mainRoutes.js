//----------------------------------------------------------------------------------------------------- **/
/**                                          ALL USER ROUTES                                             **/
// /--------------------------------------------------------------------------------------------------- **/
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { login, register, logout,forgotPassword, passwordReset, verifyToken } = require("../controllers/authController");
const jobdetailController = require("../controllers/jobdetailController");
const joblistController = require("../controllers/joblistController");
const userLayout = "../views/layouts/userLogin";
const adminLayout = "../views/layouts/adminLogin";
const jwt = require("jsonwebtoken");
const {requireAuth, checkUser, redirectIfAuthenticated, checkPremiumUser, userCategory} = require("../midlewares/usersMiddleWares/requiresAuth");
const profileImageController = require("../controllers/updateProfileController");

const {applyPremiumjob, getApplypremiumJob, viewAllApplications, uploadUserCv, decodedToken} = require("../controllers/premiumJobController");
const jobdetail = require("../controllers/jobdetailController");

const Review = require("../models/review");
const {getUserReview, postUserReview} = require("../controllers/reviewController");
const { update, decodeToken, updateProfileImage } = require("../controllers/updateProfileController");
const updateUser = require("../controllers/userController");
const { subscribeToJobs, unsubscribeToJobs} = require('../controllers/subscribeController');
const recommendedJoblist = require('../controllers/recommendedJobs');
const { countries, states, cities } = require("../allCountries");



// /--------------------------------------------------------------------------------------------------- **/
/**                                 ROUTE FOR UPLOADING CV                                              **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/upload-cv", checkUser, userCategory, (req, res) => {
  res.render('uploadcv')
})
router.post("/upload-cv", checkUser, userCategory, decodeToken, uploadUserCv)



// /--------------------------------------------------------------------------------------------------- **/
/**                              ROUTE FOR UPLOADING PROFILE IMAGE                                      **/
// /--------------------------------------------------------------------------------------------------- **/
router.post("/upload_image", checkUser, requireAuth, decodeToken, updateProfileImage, (req, res) => {
});



//----------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                      **/
//----------------------------------------------------------------------------------------------------- **/
// Fetch reviews function
async function fetchReviews() {
  try {
    const topReviews = await Review.find({ rating: { $gte: 3, $lte: 5 } })
      .sort({ rating: -1 })
      .limit(4);

    const randomReviews = await Review.aggregate([
      { $match: { rating: { $gte: 3, $lte: 5 } } },
      { $sample: { size: 4 } },
    ]);

    return { topReviews, randomReviews };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews: " + error.message);
  }
}

// Route handler
router.get("/index", checkUser, async (req, res) => {
  try {
    const reviews = await fetchReviews();
    res.render("index", {reviews});
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                  FAQ ROUTE                                                         **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/faq", checkUser, (req, res) => {
  res.render("faq");
});
// /--------------------------------------------------------------------------------------------------- **/
/**                                  ABOUT US ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/about-us", checkUser, (req, res) => {
  res.render("about-us");
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                  RESOURCES ROUTE                                                   **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/resources", checkUser, requireAuth, (req, res) => {
  res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
});
// /--------------------------------------------------------------------------------------------------- **/
/**                                  LEARNING ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/learning", checkUser, requireAuth, (req, res) => {
  res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
  // return res.redirect('login?failure=Incorrect Email or Password'); 
});
router.get("/learning-mentor",checkUser, (req, res) => {
  res.render("learning-mentor");
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                  COMMUNITY ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/community", checkUser, requireAuth, (req, res) => {
  res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
  // return res.redirect('login?failure=Incorrect Email or Password'); 
});



// /--------------------------------------------------------------------------------------------------- **/
/**                                  JOB DETAILS ROUTE                                                 **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/jobdetails/:id?", checkUser, requireAuth, jobdetailController);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  JOB LIST ROUTE                                                     **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/", checkUser, joblistController);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  JOB FILTER ROUTE                                                   **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/resetfilters", checkUser, requireAuth, (req, res) => {
  // Redirect to the joblist route without any filter parameters
  res.redirect("/");
});


// /--------------------------------------------------------------------------------------------------- **/
/**                                  EDIT PROFILE ROUTE                                                 **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/update-profile", checkUser, requireAuth, async (req, res) => {
  try {
    const locals = {
      title: "TeqVerse - Edit Profile",
    };
   
    
    res.render("user_dashboard/edit-profile", {
      layout: adminLayout,
      locals,
      cities,
      states,
      countries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

router.post(
  "/update-profile",
  checkUser,
  requireAuth,
  updateUser,
  (req, res) => { }
);

router.get("/user-profile", checkUser, requireAuth, (req, res) => {
  try {
    const locals = {
      title: "TeqVerse - View Profile",
    };
    res.render("user_dashboard/user-profile", { layout: adminLayout, locals });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                  REVIEW ROUTE                                                **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/user-review", checkUser, requireAuth, getUserReview);

// POST route to handle adding a review
router.post("/user-review", checkUser, requireAuth, postUserReview);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  JOB APPLICATION ROUTE                                              **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/apply-job/:id", requireAuth, checkUser, checkPremiumUser, getApplypremiumJob);

// Submit job application route
router.post("/apply-job/:id", checkPremiumUser, requireAuth, checkUser, applyPremiumjob);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  SUBSCRIBE ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.post('/subscribe', subscribeToJobs);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  UNSUBSCRIBE ROUTE                                                **/
// /--------------------------------------------------------------------------------------------------- **/
router.get('/unsubscribe', checkUser, (req, res) => {
    res.render("unsubscribe", { layout: userLayout });
  }
);
router.post('/unsubscribe', unsubscribeToJobs);



// Route to handle displaying all job applications for a user
router.get('/user-applications', checkUser, viewAllApplications);



// Team route
router.get("/team", checkUser, (req, res) => {
  res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
});
// Career Route
router.get("/career", checkUser, (req, res) => {
  res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
});
// Terms & Conditions
router.get("/terms", checkUser, (req, res) => {
  res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
});



module.exports = router;
