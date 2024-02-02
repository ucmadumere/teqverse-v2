const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const userLayout = '../views/layouts/userLogin';
const Postjob = require('../../models/postJob');



/**--------------------------------------------------------------------------------------------------- **/
/**                            Portects Routes from Un-Authenticated users                             **/
/**--------------------------------------------------------------------------------------------------- **/
const requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.status(400).render('login', {

      layout: userLayout,
    });
  }
};






/**--------------------------------------------------------------------------------------------------- **/
/**                  Check decodes token and send user details to the front end                        **/
/**--------------------------------------------------------------------------------------------------- **/
const checkUser = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.userId);
      res.locals.user = user;
    } else {
      res.locals.user = null;
    }
    next();
  } catch (error) {
    console.error(error);
    res.locals.user = null;
    next();
  }
};




/**--------------------------------------------------------------------------------------------------- **/
/**                             A Middle Ware that redirects a logged in user                          **/
/**                         when they try to access the login page while logged in                     **/
/**--------------------------------------------------------------------------------------------------- **/
const redirectIfAuthenticated = (req, res, next) => {
  if (res.locals.user) {
    return res.redirect('/');
  }
  return next();
};



// const checkPremiumUser = async (req, res, next) => {
//   try {
//     const token = req.cookies.token; // Assuming the JWT token is stored in a cookie named 'token'
//     if (!token) {
//       return res.status(401).json({ message: 'Authentication required' });
//     }

//     // Verify the JWT token to extract user details
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decodedToken.userId;

//     // Retrieve the user from the database using the user ID
//     const user = await User.findById(userId);
//     console.log(user)
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Assuming the job ID is in the URL params
//     const { jobId } = req.params;
//     console.log('Job ID:', jobId);

//   try {
//   const job = await Postjob.findById(jobId);
//     if (!job) {
//     return res.status(404).json({ message: 'Job not found' });
//     }
//     // Handle the case when the job is found
//     res.status(200).json({ job });
//   } catch (error) {
//     console.error('Error retrieving job:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }

//     // Check if the job requires a premium user and if the user is a premium user
//     if (job.jobCategory === 'Premium' && user.userCategory !== 'Premium User') {
//       return res.status(403).json({ message: 'Premium job requires premium user' });
//     }

//     // If the user category is premium or the job is not premium, allow the request to proceed
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


const checkPremiumUser = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Assuming the JWT token is stored in a cookie named 'token'
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Retrieve the user from the database using the user ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const jobId = req.params.id;
   

    let job; 
    try {
      job = await Postjob.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      // Handle the case when the job is found
      res.status(200).render('apply-premiumJob', {job: job});
    } catch (error) {
      console.error('Error retrieving job:', error);
      res.status(500).json({ message: 'Internal server error' });
    }

    // Check if the job requires a premium user and if the user is a premium user
    if (job.jobCategory === 'Premium' && user.userCategory !== 'Premium User') {
      return res.status(403).json({ message: 'Premium job requires premium user' });
    }

    // If the user category is premium or the job is not premium, allow the request to proceed
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
  requireAuth,
  checkUser,
  redirectIfAuthenticated,
  checkPremiumUser
};
