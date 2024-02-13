const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const { login, register, logout } = require("../controllers/authController");
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

const crypto = require("crypto");
const nodemailer = require("nodemailer");

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

// Function to generate a random token
function generateRandomToken() {
  return crypto.randomBytes(20).toString("hex");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "chibseze933@gmail.com",
    // pass: 'chinkoeze@IG',
    pass: "fmyb bqkv madm hmpx",
  },
});

function sendEmail(to, subject, html) {
  const mailOptions = {
    from: "chibseze933@gmail.com",
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user with the provided email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.render("forgot-password", {
        layout: userLayout,
        errorMessage: "User not found with the provided email",
      });
    }

    // Generate a unique token for password reset (you can use a library like crypto)
    const resetToken = generateRandomToken();

    // Save the reset token and its expiration time to the user in the database
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();

    // Send an email with a link containing the reset token
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const emailSubject = "Password Reset Request";
    const emailHTML = `<p>You have requested a password reset. Click the following link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`;

    await sendEmail(user.email, emailSubject, emailHTML);

    res.render("forgot-password", {
      layout: userLayout,
      successMessage:
        "Password reset link sent successfully. Check your email.",
    });
  } catch (error) {
    console.error(error);
    res.render("forgot-password", {
      layout: userLayout,
      errorMessage: "Internal Server Error. Please try again later.",
    });
  }
});

// /--------------------------------------------------------------------------------------------------- **/
/**                                  RESET PASSWORD ROUTE                                                     **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/reset-password", async (req, res) => {
  const { token } = req.query;

  try {
    // Find the user with the provided reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      // Token is invalid or expired
      return res.render("reset-password", {
        layout: userLayout,
        errorMessage:
          "Invalid or expired token. Please request a new password reset.",
      });
    }

    res.render("reset-password", {
      layout: userLayout,
      token: token, // Pass the token to the reset password form
    });
  } catch (error) {
    console.error(error);
    res.render("reset-password", {
      layout: userLayout,
      errorMessage: "Internal Server Error. Please try again later.",
    });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    // Check if the passwords match
    if (newPassword !== confirmPassword) {
      return res.render("reset-password", {
        layout: userLayout,
        token,
        errorMessage:
          "Passwords do not match. Please enter matching passwords.",
      });
    }

    // Find the user with the provided reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      // Token is invalid or expired
      return res.render("reset-password", {
        layout: userLayout,
        token,
        errorMessage:
          "Invalid or expired reset token. Please request a new one.",
      });
    }

    // Update the user's password
    user.password = newPassword;
    // Clear the reset token and its expiration time
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    // Redirect to the login page or any other destination
    return res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.render("reset-password", {
      layout: userLayout,
      errorMessage: "Internal Server Error. Please try again later.",
    });
  }
});

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
    const country = [
      {
        value: "ZA",
        name: "África do Sul",
      },
      {
        value: "AT",
        name: "Áustria",
      },
      {
        value: "IN",
        name: "Índia",
      },
      {
        value: "AF",
        name: "Afeganistão",
      },
      {
        value: "AL",
        name: "Albânia",
      },
      {
        value: "DE",
        name: "Alemanha",
      },
      {
        value: "AD",
        name: "Andorra",
      },
      {
        value: "AO",
        name: "Angola",
      },
      {
        value: "AI",
        name: "Anguila",
      },
      {
        value: "AQ",
        name: "Antárctida",
      },
      {
        value: "AG",
        name: "Antígua e Barbuda",
      },
      {
        value: "AN",
        name: "Antilhas Neerlandesas",
      },
      {
        value: "SA",
        name: "Arábia Saudita",
      },
      {
        value: "DZ",
        name: "Argélia",
      },
      {
        value: "AR",
        name: "Argentina",
      },
      {
        value: "AM",
        name: "Arménia",
      },
      {
        value: "AW",
        name: "Aruba",
      },
      {
        value: "AU",
        name: "Austrália",
      },
      {
        value: "AZ",
        name: "Azerbaijão",
      },
      {
        value: "BE",
        name: "Bélgica",
      },
      {
        value: "BA",
        name: "Bósnia e Herzegovina",
      },
      {
        value: "BS",
        name: "Baamas",
      },
      {
        value: "BD",
        name: "Bangladeche",
      },
      {
        value: "BH",
        name: "Barém",
      },
      {
        value: "BB",
        name: "Barbados",
      },
      {
        value: "BZ",
        name: "Belize",
      },
      {
        value: "BJ",
        name: "Benim",
      },
      {
        value: "BM",
        name: "Bermudas",
      },
      {
        value: "BY",
        name: "Bielorrússia",
      },
      {
        value: "MM",
        name: "Birmânia",
      },
      {
        value: "BO",
        name: "Bolívia",
      },
      {
        value: "BW",
        name: "Botsuana",
      },
      {
        value: "BR",
        name: "Brasil",
      },
      {
        value: "BN",
        name: "Brunei",
      },
      {
        value: "BG",
        name: "Bulgária",
      },
      {
        value: "BI",
        name: "Burúndi",
      },
      {
        value: "BF",
        name: "Burquina Faso",
      },
      {
        value: "BT",
        name: "Butão",
      },
      {
        value: "CV",
        name: "Cabo Verde",
      },
      {
        value: "CM",
        name: "Camarões",
      },
      {
        value: "KH",
        name: "Camboja",
      },
      {
        value: "CA",
        name: "Canadá",
      },
      {
        value: "QA",
        name: "Catar",
      },
      {
        value: "KZ",
        name: "Cazaquistão",
      },
      {
        value: "TD",
        name: "Chade",
      },
      {
        value: "CL",
        name: "Chile",
      },
      {
        value: "CN",
        name: "China",
      },
      {
        value: "CY",
        name: "Chipre",
      },
      {
        value: "CO",
        name: "Colômbia",
      },
      {
        value: "KM",
        name: "Comores",
      },
      {
        value: "CG",
        name: "Congo-Brazzaville",
      },
      {
        value: "CD",
        name: "Congo-Kinshasa",
      },
      {
        value: "KP",
        name: "Coreia do Norte",
      },
      {
        value: "KR",
        name: "Coreia do Sul",
      },
      {
        value: "CR",
        name: "Costa Rica",
      },
      {
        value: "CI",
        name: "Costa do Marfim",
      },
      {
        value: "HR",
        name: "Croácia",
      },
      {
        value: "CU",
        name: "Cuba",
      },
      {
        value: "DK",
        name: "Dinamarca",
      },
      {
        value: "DM",
        name: "Domínica",
      },
      {
        value: "EG",
        name: "Egipto",
      },
      {
        value: "AE",
        name: "Emiratos Árabes Unidos",
      },
      {
        value: "EC",
        name: "Equador",
      },
      {
        value: "ER",
        name: "Eritreia",
      },
      {
        value: "SK",
        name: "Eslováquia",
      },
      {
        value: "SI",
        name: "Eslovénia",
      },
      {
        value: "ES",
        name: "Espanha",
      },
      {
        value: "EE",
        name: "Estónia",
      },
      {
        value: "US",
        name: "Estados Unidos",
      },
      {
        value: "ET",
        name: "Etiópia",
      },
      {
        value: "FO",
        name: "Faroé",
      },
      {
        value: "FJ",
        name: "Fiji",
      },
      {
        value: "PH",
        name: "Filipinas",
      },
      {
        value: "FI",
        name: "Finlândia",
      },
      {
        value: "FR",
        name: "França",
      },
      {
        value: "GM",
        name: "Gâmbia",
      },
      {
        value: "GA",
        name: "Gabão",
      },
      {
        value: "GH",
        name: "Gana",
      },
      {
        value: "GE",
        name: "Geórgia",
      },
      {
        value: "GS",
        name: "Geórgia do Sul e Sandwich do Sul",
      },
      {
        value: "GI",
        name: "Gibraltar",
      },
      {
        value: "GR",
        name: "Grécia",
      },
      {
        value: "GD",
        name: "Granada",
      },
      {
        value: "GL",
        name: "Gronelândia",
      },
      {
        value: "GP",
        name: "Guadalupe",
      },
      {
        value: "GU",
        name: "Guame",
      },
      {
        value: "GT",
        name: "Guatemala",
      },
      {
        value: "GY",
        name: "Guiana",
      },
      {
        value: "GF",
        name: "Guiana Francesa",
      },
      {
        value: "GN",
        name: "Guiné",
      },
      {
        value: "GQ",
        name: "Guiné Equatorial",
      },
      {
        value: "GW",
        name: "Guiné-Bissau",
      },
      {
        value: "HT",
        name: "Haiti",
      },
      {
        value: "HN",
        name: "Honduras",
      },
      {
        value: "HK",
        name: "Hong Kong",
      },
      {
        value: "HU",
        name: "Hungria",
      },
      {
        value: "YE",
        name: "Iémen",
      },
      {
        value: "BV",
        name: "Ilha Bouvet",
      },
      {
        value: "NF",
        name: "Ilha Norfolk",
      },
      {
        value: "CX",
        name: "Ilha do Natal",
      },
      {
        value: "KY",
        name: "Ilhas Caimão",
      },
      {
        value: "CK",
        name: "Ilhas Cook",
      },
      {
        value: "FK",
        name: "Ilhas Falkland",
      },
      {
        value: "HM",
        name: "Ilhas Heard e McDonald",
      },
      {
        value: "MH",
        name: "Ilhas Marshall",
      },
      {
        value: "UM",
        name: "Ilhas Menores Distantes dos Estados Unidos",
      },
      {
        value: "SB",
        name: "Ilhas Salomão",
      },
      {
        value: "TC",
        name: "Ilhas Turcas e Caicos",
      },
      {
        value: "VI",
        name: "Ilhas Virgens Americanas",
      },
      {
        value: "VG",
        name: "Ilhas Virgens Britânicas",
      },
      {
        value: "CC",
        name: "Ilhas dos Cocos",
      },
      {
        value: "ID",
        name: "Indonésia",
      },
      {
        value: "IR",
        name: "Irão",
      },
      {
        value: "IQ",
        name: "Iraque",
      },
      {
        value: "IE",
        name: "Irlanda",
      },
      {
        value: "IS",
        name: "Islândia",
      },
      {
        value: "IL",
        name: "Israel",
      },
      {
        value: "IT",
        name: "Itália",
      },
      {
        value: "JM",
        name: "Jamaica",
      },
      {
        value: "JP",
        name: "Japão",
      },
      {
        value: "DJ",
        name: "Jibuti",
      },
      {
        value: "JO",
        name: "Jordânia",
      },
      {
        value: "YU",
        name: "Jugoslávia",
      },
      {
        value: "KW",
        name: "Kuwait",
      },
      {
        value: "LB",
        name: "Líbano",
      },
      {
        value: "LY",
        name: "Líbia",
      },
      {
        value: "LA",
        name: "Laos",
      },
      {
        value: "LS",
        name: "Lesoto",
      },
      {
        value: "LV",
        name: "Letónia",
      },
      {
        value: "LR",
        name: "Libéria",
      },
      {
        value: "LI",
        name: "Listenstaine",
      },
      {
        value: "LT",
        name: "Lituânia",
      },
      {
        value: "LU",
        name: "Luxemburgo",
      },
      {
        value: "MX",
        name: "México",
      },
      {
        value: "MC",
        name: "Mónaco",
      },
      {
        value: "MO",
        name: "Macau",
      },
      {
        value: "MK",
        name: "Macedónia",
      },
      {
        value: "MG",
        name: "Madagáscar",
      },
      {
        value: "MY",
        name: "Malásia",
      },
      {
        value: "MW",
        name: "Malávi",
      },
      {
        value: "MV",
        name: "Maldivas",
      },
      {
        value: "ML",
        name: "Mali",
      },
      {
        value: "MT",
        name: "Malta",
      },
      {
        value: "MP",
        name: "Marianas do Norte",
      },
      {
        value: "MA",
        name: "Marrocos",
      },
      {
        value: "MQ",
        name: "Martinica",
      },
      {
        value: "MU",
        name: "Maurícia",
      },
      {
        value: "MR",
        name: "Mauritânia",
      },
      {
        value: "YT",
        name: "Mayotte",
      },
      {
        value: "FM",
        name: "Micronésia",
      },
      {
        value: "MZ",
        name: "Moçambique",
      },
      {
        value: "MD",
        name: "Moldávia",
      },
      {
        value: "MN",
        name: "Mongólia",
      },
      {
        value: "MS",
        name: "Monserrate",
      },
      {
        value: "NE",
        name: "Níger",
      },
      {
        value: "NA",
        name: "Namíbia",
      },
      {
        value: "NR",
        name: "Nauru",
      },
      {
        value: "NP",
        name: "Nepal",
      },
      {
        value: "NI",
        name: "Nicarágua",
      },
      {
        value: "NG",
        name: "Nigéria",
      },
      {
        value: "NU",
        name: "Niue",
      },
      {
        value: "NO",
        name: "Noruega",
      },
      {
        value: "NC",
        name: "Nova Caledónia",
      },
      {
        value: "NZ",
        name: "Nova Zelândia",
      },
      {
        value: "OM",
        name: "Omã",
      },
      {
        value: "NL",
        name: "Países Baixos",
      },
      {
        value: "PW",
        name: "Palau",
      },
      {
        value: "PA",
        name: "Panamá",
      },
      {
        value: "PG",
        name: "Papua-Nova Guiné",
      },
      {
        value: "PK",
        name: "Paquistão",
      },
      {
        value: "PY",
        name: "Paraguai",
      },
      {
        value: "PE",
        name: "Peru",
      },
      {
        value: "PN",
        name: "Pitcairn",
      },
      {
        value: "PL",
        name: "Polónia",
      },
      {
        value: "PF",
        name: "Polinésia Francesa",
      },
      {
        value: "PR",
        name: "Porto Rico",
      },
      {
        value: "PT",
        name: "Portugal",
      },
      {
        value: "KE",
        name: "Quénia",
      },
      {
        value: "KG",
        name: "Quirguizistão",
      },
      {
        value: "KI",
        name: "Quiribáti",
      },
      {
        value: "RU",
        name: "Rússia",
      },
      {
        value: "GB",
        name: "Reino Unido",
      },
      {
        value: "CF",
        name: "República Centro-Africana",
      },
      {
        value: "CZ",
        name: "República Checa",
      },
      {
        value: "DO",
        name: "República Dominicana",
      },
      {
        value: "RE",
        name: "Reunião",
      },
      {
        value: "RO",
        name: "Roménia",
      },
      {
        value: "RW",
        name: "Ruanda",
      },
      {
        value: "KN",
        name: "São Cristóvão e Neves",
      },
      {
        value: "SM",
        name: "São Marinho",
      },
      {
        value: "PM",
        name: "São Pedro e Miquelon",
      },
      {
        value: "ST",
        name: "São Tomé e Príncipe",
      },
      {
        value: "VC",
        name: "São Vicente e Granadinas",
      },
      {
        value: "SY",
        name: "Síria",
      },
      {
        value: "SV",
        name: "Salvador",
      },
      {
        value: "WS",
        name: "Samoa",
      },
      {
        value: "AS",
        name: "Samoa Americana",
      },
      {
        value: "SH",
        name: "Santa Helena",
      },
      {
        value: "LC",
        name: "Santa Lúcia",
      },
      {
        value: "EH",
        name: "Sara Ocidental",
      },
      {
        value: "SC",
        name: "Seicheles",
      },
      {
        value: "SN",
        name: "Senegal",
      },
      {
        value: "SL",
        name: "Serra Leoa",
      },
      {
        value: "SG",
        name: "Singapura",
      },
      {
        value: "SO",
        name: "Somália",
      },
      {
        value: "LK",
        name: "Sri Lanca",
      },
      {
        value: "SE",
        name: "Suécia",
      },
      {
        value: "CH",
        name: "Suíça",
      },
      {
        value: "SZ",
        name: "Suazilândia",
      },
      {
        value: "SD",
        name: "Sudão",
      },
      {
        value: "SR",
        name: "Suriname",
      },
      {
        value: "SJ",
        name: "Svalbard e Jan Mayen",
      },
      {
        value: "TH",
        name: "Tailândia",
      },
      {
        value: "TW",
        name: "Taiwan",
      },
      {
        value: "TJ",
        name: "Tajiquistão",
      },
      {
        value: "TZ",
        name: "Tanzânia",
      },
      {
        value: "IO",
        name: "Território Britânico do Oceano Índico",
      },
      {
        value: "TF",
        name: "Territórios Austrais Franceses",
      },
      {
        value: "TL",
        name: "Timor Leste",
      },
      {
        value: "TG",
        name: "Togo",
      },
      {
        value: "TK",
        name: "Tokelau",
      },
      {
        value: "TO",
        name: "Tonga",
      },
      {
        value: "TT",
        name: "Trindade e Tobago",
      },
      {
        value: "TN",
        name: "Tunísia",
      },
      {
        value: "TM",
        name: "Turquemenistão",
      },
      {
        value: "TR",
        name: "Turquia",
      },
      {
        value: "TV",
        name: "Tuvalu",
      },
      {
        value: "UA",
        name: "Ucrânia",
      },
      {
        value: "UG",
        name: "Uganda",
      },
      {
        value: "UY",
        name: "Uruguai",
      },
      {
        value: "UZ",
        name: "Usbequistão",
      },
      {
        value: "VU",
        name: "Vanuatu",
      },
      {
        value: "VA",
        name: "Vaticano",
      },
      {
        value: "VE",
        name: "Venezuela",
      },
      {
        value: "VN",
        name: "Vietname",
      },
      {
        value: "WF",
        name: "Wallis e Futuna",
      },
      {
        value: "ZM",
        name: "Zâmbia",
      },
      {
        value: "ZW",
        name: "Zimbábue",
      },
    ];

    res.render("edit-profile", {
      layout: adminLayout,
      locals,
      cities,
      states,
      country,
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
