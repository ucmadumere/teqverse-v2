const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { login, register, logout,forgotPassword, passwordReset } = require("../controllers/authController");
const jobdetailController = require("../controllers/jobdetailController");
const joblistController = require("../controllers/joblistController");
const userLayout = "../views/layouts/userLogin";
const adminLayout = "../views/layouts/adminLogin";
const jwt = require("jsonwebtoken");
const {
  requireAuth,
  checkUser,
  redirectIfAuthenticated,
  checkPremiumUser,
} = require("../midlewares/usersMiddleWares/requireAuth");

const profileImageController = require("../controllers/updateProfileController");

const {
  applyPremiumjob,
  getApplypremiumJob,
} = require("../controllers/premiumJobController");
const jobdetail = require("../controllers/jobdetailController");

const Review = require("../models/review");
const {
  getUserReview,
  postUserReview,
} = require("../controllers/reviewController");
const upload = require("../multerConfig");
const update = require("../controllers/updateProfileController");
const updateUser = require("../controllers/userController");


router.post("/profileimage", checkUser, requireAuth);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                     **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/", checkUser, async (req, res) => {
  try {
    // Fetch top 4 reviews based on rating in descending order
    const topReviews = await Review.find({ rating: { $gte: 3, $lte: 5 } })
      .sort({ rating: -1 })
      .limit(4);

    // Fetch 4 random reviews based on the same criteria
    const randomReviews = await Review.aggregate([
      { $match: { rating: { $gte: 3, $lte: 5 } } },
      { $sample: { size: 4 } },
    ]);

    res.render("index", { topReviews, randomReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send("Failed to fetch reviews: " + error.message);
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
  res.render("media");
});
// /--------------------------------------------------------------------------------------------------- **/
/**                                  RESOURCES ROUTE                                                   **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/resources", checkUser, requireAuth, (req, res) => {
  res.render("resources");
});
// /--------------------------------------------------------------------------------------------------- **/
/**                                  LEARNING ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/learning", checkUser, requireAuth, (req, res) => {
  res.render("learning");
});
router.get("/learning-mentor", (req, res) => {
  res.render("learning-mentor");
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/login", checkUser, redirectIfAuthenticated, (req, res) => {
  res.render("login", { layout: userLayout });
});
router.post("/login", login);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/signup", checkUser, redirectIfAuthenticated, (req, res) => {
  res.render("signup", { layout: userLayout });
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
    res.render("forgot-password", { layout: userLayout });
  }
);
router.post('/forgot-password', forgotPassword)



// /--------------------------------------------------------------------------------------------------- **/
/**                                  RESET PASSWORD ROUTE                                                     **/
// /--------------------------------------------------------------------------------------------------- **/
router.get('/reset-password',checkUser, redirectIfAuthenticated, (req, res) => {
  const token = req.query.token;
  
  res.render('reset-password', { layout:userLayout, token });
});

router.post('/reset-password/:token', passwordReset)
// router.patch('/reset-password/:token', passwordReset)

// /--------------------------------------------------------------------------------------------------- **/
/**                                  JOB DETAILS ROUTE                                                 **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/jobdetails/:id?", checkUser, requireAuth, jobdetailController);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  JOB LIST ROUTE                                                    **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/joblist", checkUser, requireAuth, joblistController);

// /--------------------------------------------------------------------------------------------------- **/
/**                                  JOB FILTER ROUTE                                                  **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/resetfilters", checkUser, requireAuth, (req, res) => {
  // Redirect to the joblist route without any filter parameters
  res.redirect("/joblist");
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                  EDIT PROFILE ROUTE                                                **/
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
    

    res.render("edit-profile", {
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
    res.render("user-profile", { layout: adminLayout, locals });
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

module.exports = router;
