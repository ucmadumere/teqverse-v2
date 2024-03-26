const express = require("express");
const { checkUser, redirectIfAuthenticated } = require("../midlewares/usersMiddleWares/requiresAuth");
const { register, logout, login, forgotPassword, passwordReset, verifyToken } = require("../controllers/authController");
const router = express.Router();
const userLayout = "../views/layouts/userLogin";
const adminLayout = "../views/layouts/adminLogin";





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
/**                                  VERIFY ROUTE                                                **/
// /--------------------------------------------------------------------------------------------------- **/
router.get('/verify-email', verifyToken)
  
  // /--------------------------------------------------------------------------------------------------- **/
  /**                                  LOG OUT ROUTE                                                     **/
  // /--------------------------------------------------------------------------------------------------- **/
  router.get("/logout", logout);
  // /--------------------------------------------------------------------------------------------------- **/
  /**                                  FORGOT PASSWORD ROUTE                                                     **/
  // /--------------------------------------------------------------------------------------------------- **/
  router.get("/forgot-password", checkUser, redirectIfAuthenticated, (req, res) => {
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


module.exports = router;