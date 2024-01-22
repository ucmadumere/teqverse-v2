const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const jobdetailController = require('../controllers/jobdetailController');
const joblistController = require('../controllers/joblistController');
const userLayout = '../views/layouts/userLogin';



/**--------------------------------------------------------------------------------------------------- **/
/**                                  LANDING ROUTE                                                     **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/', (req, res) => {
    res.render('index');
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                   LOGIN ROUTE                                                      **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login', (req, res) => {
  res.render('login', {layout: userLayout });
});
router.post('/login', authController.login);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  REGISTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/signup', (req, res) => {
  res.render('signup', {layout: userLayout });
});
router.post('/signup', authController.register);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB DETAILS ROUTE                                               **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/jobdetails/:id?', jobdetailController);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB LIST ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/joblist', joblistController);

/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB FILTER ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/resetfilters', (req, res) => {
    // Redirect to the joblist route without any filter parameters
    res.redirect('/joblist');
});
          
/**--------------------------------------------------------------------------------------------------- **/
/**                                  JOB LIST ROUTE                                                    **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/edit-profile', (req, res) => {
  res.render('edit-page');
});
//router.post('/edit-profile', edit)

module.exports = router;
