const express = require("express");
const { checkUser } = require("../midlewares/usersMiddleWares/requiresAuth");
const router = express.Router();





// /--------------------------------------------------------------------------------------------------- **/
/**                                  MEDIA ROUTE                                                       **/
// /--------------------------------------------------------------------------------------------------- **/
router.get("/media", checkUser, (req, res) => {
    // res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
    res.render("media_section/media");
  });
  
  router.get("/industry_discussion", checkUser, (req, res) => {
    // res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
    res.render("media_section/industry_discussion");
  });
  
  router.get("/tech_insight", checkUser, (req, res) => {
    // res.redirect("/?failure=This feature is not yet available to the public. Work-in-progress." );
    res.render("media_section/tech_insight");
  });



module.exports = router;