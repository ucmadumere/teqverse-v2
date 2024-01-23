const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jobdetailController = require('../controllers/jobdetailController');
const joblistController = require('../controllers/joblistController');
const userLayout = '../views/layouts/userLogin';
const jwt = require('jsonwebtoken');
const { requireAuth, checkUser, redirectIfAuthenticated } = require('../midlewares/authMiddleware');




router.get('*', checkUser)

/**--------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/', (req, res) => {
    const token = req.cookies.jwt;

    if(token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
          if(err) {
            res.render('index');
          }else{
            res.render('index');
          };
      });
    } else{
      res.render('index');
    }
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                  FAQ ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/faq', (req, res) => {
    res.render('faq');
});
/**--------------------------------------------------------------------------------------------------- **/
/**                                  ABOUT US ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/about-us', (req, res) => {
    res.render('about-us');
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('login', {layout: userLayout });
});
router.post('/login', checkUser, redirectIfAuthenticated, authController.login);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/signup', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('signup', {layout: userLayout });
});
router.post('/signup', checkUser, redirectIfAuthenticated, authController.register);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  LOG OUT ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/logout', (req, res) => {
    res.render('logout', {layout: userLayout});
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB DETAILS ROUTE                                                 **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/jobdetails/:id?',checkUser, redirectIfAuthenticated, jobdetailController);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB LIST ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/joblist', checkUser, redirectIfAuthenticated, joblistController);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB FILTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/resetfilters', checkUser, redirectIfAuthenticated, (req, res) => {
    // Redirect to the joblist route without any filter parameters
    res.redirect('/joblist');
});
          
/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB LIST ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/edit-profile', checkUser, redirectIfAuthenticated, (req, res) => {
  res.render('edit-page');
});
//router.post('/edit-profile', edit)













































/**--------------------------------------------------------------------------------------------------- **/
/**                                  A CATCH ALL ROUTE                                                 **/
/**--------------------------------------------------------------------------------------------------- **/

// 

module.exports = router;
