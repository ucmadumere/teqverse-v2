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
const {requireAuth, checkUser, redirectIfAuthenticated, checkPremiumUser} = require("../midlewares/usersMiddleWares/requiresAuth");
const profileImageController = require("../controllers/updateProfileController");

const {applyPremiumjob, getApplypremiumJob, viewAllApplications} = require("../controllers/premiumJobController");
const jobdetail = require("../controllers/jobdetailController");

const Review = require("../models/review");
const {getUserReview, postUserReview} = require("../controllers/reviewController");
const {upload, imageUpload} = require("../multerConfig");
const { update } = require("../controllers/updateProfileController");
const updateUser = require("../controllers/userController");
const { subscribeToJobs, unsubscribeToJobs} = require('../controllers/subscribeController');
const recommendedJoblist = require('../controllers/recommendedJobs');
const { viewApplicationStatus } = require('../controllers/updateJobStatusController');




router.post("/upload_image", checkUser, requireAuth, update, (req, res) => {
  // The file has been uploaded at this point
  res.send('File uploaded successfully');
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                      **/
// /--------------------------------------------------------------------------------------------------- **/
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
/**                                  MEDIA ROUTE                                                       **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/media", checkUser, (req, res) => {
  res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
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
/**                                   LOGIN ROUTE                                                      **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/login", checkUser, redirectIfAuthenticated, (req, res) => {
  res.render("auth/login", { layout: userLayout });
});
router.post("/login", login);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/signup", redirectIfAuthenticated, (req, res) => {
  res.render("auth/signup", { layout: userLayout });
});
router.post("/signup", register);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  LOG OUT ROUTE                                                     **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/logout", logout);
// /--------------------------------------------------------------------------------------------------- **/
/**                                  FORGOT PASSWORD ROUTE                                                     **/
// /--------------------------------------------------------------------------------------------------- **/
router.get(
  "/forgot-password",
  checkUser,
  redirectIfAuthenticated,
  (req, res) => {
    res.render("auth/forgot-password", { layout: userLayout });
  }
);
router.post('/forgot-password', forgotPassword)



// /--------------------------------------------------------------------------------------------------- **/
/**                                  RESET PASSWORD ROUTE                                                     **/
// /--------------------------------------------------------------------------------------------------- **/
router.get('/reset-password',checkUser, redirectIfAuthenticated, (req, res) => {
  const token = req.query.token;
  
  res.render('auth/reset-password', { layout:userLayout, token });
});

router.post('/reset-password/:token', passwordReset)

// router.patch('/reset-password/:token', passwordReset)

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
/**                                  APPLICATION TRACKING ROUTE                                         **/
// /--------------------------------------------------------------------------------------------------- **/
// router.get("/application-tracking", checkUser, requireAuth, (req, res) => {
//   res.render("application-tracking", { layout:adminLayout});
// });

// /--------------------------------------------------------------------------------------------------- **/
/**                                  EDIT PROFILE ROUTE                                                 **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/update-profile", checkUser, requireAuth, async (req, res) => {
  try {
    const locals = {
      title: "TeqVerse - Edit Profile",
    };
    const cities = [
      { name: "Lagos", value: "Lagos" },
      { name: "Abuja", value: "Abuja" },
      { name: "Kano", value: "Kano" },
      { name: "Ibadan", value: "Ibadan" },
      { name: "Kaduna", value: "Kaduna" },
      { name: "Port Harcourt", value: "Port Harcourt" },
      { name: "Benin City", value: "Benin City" },
      { name: "Maiduguri", value: "Maiduguri" },
      { name: "Zaria", value: "Zaria" },
      { name: "Aba", value: "Aba" },
      { name: "Jos", value: "Jos" },
      { name: "Ilorin", value: "Ilorin" },
      { name: "Oyo", value: "Oyo" },
      { name: "Enugu", value: "Enugu" },
      { name: "Abeokuta", value: "Abeokuta" },
      { name: "Onitsha", value: "Onitsha" },
      { name: "Uyo", value: "Uyo" },
      { name: "Sokoto", value: "Sokoto" },
      { name: "Warri", value: "Warri" },
      { name: "Calabar", value: "Calabar" },
      { name: "Ado-Ekiti", value: "Ado-Ekiti" },
      { name: "Katsina", value: "Katsina" },
      { name: "Akure", value: "Akure" },
      { name: "Bauchi", value: "Bauchi" },
      { name: "Ebute Ikorodu", value: "Ebute Ikorodu" },
      { name: "Makurdi", value: "Makurdi" },
      { name: "Minna", value: "Minna" },
      { name: "Effurun", value: "Effurun" },
      { name: "Ilesa", value: "Ilesa" },
    ];
    const states = [
      { name: "Abia", value: "Abia" },
      { name: "Adamawa", value: "Adamawa" },
      { name: "Akwa Ibom", value: "Akwa Ibom" },
      { name: "Anambra", value: "Anambra" },
      { name: "Bauchi", value: "Bauchi" },
      { name: "Bayelsa", value: "Bayelsa" },
      { name: "Benue", value: "Benue" },
      { name: "Borno", value: "Borno" },
      { name: "Cross River", value: "Cross River" },
      { name: "Delta", value: "Delta" },
      { name: "Ebonyi", value: "Ebonyi" },
      { name: "Edo", value: "Edo" },
      { name: "Ekiti", value: "Ekiti" },
      { name: "Enugu", value: "Enugu" },
      { name: "Gombe", value: "Gombe" },
      { name: "Imo", value: "Imo" },
      { name: "Jigawa", value: "Jigawa" },
      { name: "Kaduna", value: "Kaduna" },
      { name: "Kano", value: "Kano" },
      { name: "Katsina", value: "Katsina" },
      { name: "Kebbi", value: "Kebbi" },
      { name: "Kogi", value: "Kogi" },
      { name: "Kwara", value: "Kwara" },
      { name: "Lagos", value: "Lagos" },
      { name: "Nasarawa", value: "Nasarawa" },
      { name: "Niger", value: "Niger" },
      { name: "Ogun", value: "Ogun" },
      { name: "Ondo", value: "Ondo" },
      { name: "Osun", value: "Osun" },
      { name: "Oyo", value: "Oyo" },
      { name: "Plateau", value: "Plateau" },
      { name: "Rivers", value: "Rivers" },
      { name: "Sokoto", value: "Sokoto" },
      { name: "Taraba", value: "Taraba" },
      { name: "Yobe", value: "Yobe" },
      { name: "Zamfara", value: "Zamfara" },
    ];
    

    res.render("user_dashboard/edit-profile", {
      layout: adminLayout,
      locals,
      cities,
      states,
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
  update,
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

// Apply for a job route
router.get(
  "/apply-job/:id",
  requireAuth,
  checkUser,
  checkPremiumUser,
  getApplypremiumJob
);

// Submit job application route
router.post(
  "/apply-job/:id",
  checkPremiumUser,
  requireAuth,
  checkUser,
  upload.single("cv"),
  applyPremiumjob
);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  SUBSCRIBE ROUTE                                                **/
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



// /--------------------------------------------------------------------------------------------------- **/
/**                                  VERIFY ROUTE                                                **/
// /--------------------------------------------------------------------------------------------------- **/
router.get('/verify-email', verifyToken)

// /--------------------------------------------------------------------------------------------------- **/
/**                                  RECOMMENDED JOB ROUTE                                                **/
// /--------------------------------------------------------------------------------------------------- **/
router.get('/all-recommended-jobs', checkUser,requireAuth,recommendedJoblist);


router.get('/application-tracking/:id', checkUser, viewApplicationStatus);



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
