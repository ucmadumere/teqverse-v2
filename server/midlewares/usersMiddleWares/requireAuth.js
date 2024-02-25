const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const userLayout = '../views/layouts/userLogin';
const PostJob = require('../../models/postJob');



/**--------------------------------------------------------------------------------------------------- **/
/**                            Portects Routes from Un-Authenticated users                             **/
/**--------------------------------------------------------------------------------------------------- **/
// const requireAuth = (req, res, next) => {
//   const token = req.cookies.token;

//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//       if (err) {
//         res.redirect("/login");
//       } else {
//         req.user = user;
//       }
//     });
//   } else {
//     res.status(400).render('login', {

//       layout: userLayout,
//     });
//   }
// };

const requireAuth = async (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.userId);

      if (!user) {
        res.redirect('login?failure= User Not Found, Please Sign In')
      }

      req.user = user; // Attach user information to the request object
      next();
    } catch (error) {
      res.redirect('login?failure=Unauthorized, Please Sign In')

    }
  } else {
    res.redirect('login?failure=Unauthorized, Please Sign In')
  }
};







/**--------------------------------------------------------------------------------------------------- **/
/**                  Check decodes token and send user details to the front end                        **/
/**--------------------------------------------------------------------------------------------------- **/
// const checkUser = async (req, res, next) => {
//   const token = req.cookies.token;

//   try {
//     if (token) {
//       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//       const user = await User.findById(decodedToken.userId);
//       res.locals.user = user;
//     } else {
//       res.locals.user = null;
//     }
//     next();
//   } catch (error) {
//     console.error(error);
//     res.locals.user = null;
//     next();
//   }
// };

const checkUser = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decodedToken.userId);
      if (!user) {
        res.locals.user = null;
      } else {
        const additionalDetails = await fetchAdditionalDetails(user);
        const mergedUser = { ...user._doc, ...additionalDetails };
        res.locals.user = mergedUser;
      }
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


// Function to fetch additional details from the database
const fetchAdditionalDetails = async (user) => {
  try {
    const additionalDetails = await User.findById(user._id).select('other_names interest');
    return additionalDetails;
  } catch (error) {
    console.error('Error fetching additional details:', error);
    return {};
  }
};






/**--------------------------------------------------------------------------------------------------- **/
/**                             A Middle Ware that redirects a logged in user                          **/
/**                         when they try to access the login page while logged in                     **/
/**--------------------------------------------------------------------------------------------------- **/
const redirectIfAuthenticated = (req, res, next) => {
  if (res.locals.user) {
    return res.redirect('/?failure= This User is Already Signed In, You Can Sign out and Sign Back In');
  }
  return next();
};



const checkPremiumUser = async (req, res, next) => {
  try {
    const token = req.cookies.token; // Assuming the JWT token is stored in a cookie
    if (!token) {
      // Handle case where token is missing
      return res.status(401).send('Authentication required');
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId; 

    // Assuming you have a way to retrieve user details from the database
    // You can use the userId to fetch the user's details from the database
    // Replace this with your actual code to retrieve user details
    const user = await User.findById(userId).exec();

    if (!user) {
      // Handle case where user is not found
      return res.status(404).send('User not found');
    }
    

    // Assuming you have a way to retrieve the job details based on the request
    // For example, if the job ID is passed in the URL params
    const jobId = req.params.id; // Replace with your actual way of getting the job ID
    const job = await PostJob.findById(jobId).exec();

    

    if (!job) {
      // Handle case where job is not found
      return res.status(404).send('Job not found');
    }
    

    // Check if the user is eligible based on their user category and the job category
    if ((user.userCategory === 'Premium' && job.jobCategory === 'Premium') ||
        (user.userCategory === 'Regular' && job.jobCategory === 'Regular') ||
        (user.userCategory === 'Premium' && job.jobCategory === 'Regular')) {
      // User is eligible to apply for the job
      next();
    } else if (user.userCategory === 'Regular' && job.jobCategory === 'Premium') {
      // User is not eligible for premium job
      return res.status(403).send('User is not eligible to apply for this premium job');
    } else {
      // User is not eligible
      return res.status(403).send('User is not eligible to apply for this job');
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).send('Internal server error');
  }
};





// const checkPremiumUser = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).send('Authentication required');
//     }

//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decodedToken.userId;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send('User not found');
//     }

//     const jobId = req.params.id;
//     const job = await PostJob.findById(jobId);
//     if (!job) {
//       return res.status(404).send('Job not found');
//     }

//     if (job.jobCategory === 'Premium' && user.userCategory !== 'Premium User') {
//       return res.status(403).redirect('/apply-job').send('Premium job requires premium user');
//     }

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal server error');
//   }
// };







module.exports = {
  requireAuth,
  checkUser,
  redirectIfAuthenticated,
  checkPremiumUser
};
