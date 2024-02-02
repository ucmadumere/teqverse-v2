const premiumJob = require('../models/premiumJobApplication');
const User = require('../models/userModel')
const userLayout = '../views/layouts/userLogin';
const jwt = require('jsonwebtoken');







// // Controller function to render the job application form
// const getApplypremiumJob = (req, res) => {
//   try {
//     // Decode the JWT token to extract user details
//     const token = req.cookies.token;
//     console.log(token)
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//     const { userId } = decodedToken;
//     console.log(decodedToken)

//     // Assuming you have a way to retrieve user details from the database
//     // You can use the userId to fetch the user's details from the database
//     // Replace this with your actual code to retrieve user details
//     const user = User.findById(userId);

//     // Pass the user's details to the template for pre-filling the form
//     res.render('apply-premiumJob', { user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while processing your request.');
//   }
// };



// Controller function to render the job application form
const getApplypremiumJob = async (req, res) => {
  try {
    // Retrieve the JWT token from the request cookies
    const token = req.cookies.token;

    if (!token) {
      // If the token is missing, the user is not authenticated
      // You may want to handle this case based on your application's requirements
      res.status(401).send('Authentication required');
      return;
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    console.log(decodedToken);


    // Assuming you have a way to retrieve user details from the database
    // You can use the userId to fetch the user's details from the database
    // Replace this with your actual code to retrieve user details
    const user = await User.findById(userId).exec();

    if (!user) {
        // Handle case where user is not found
        res.status(404).send('User not found');
        return;
    }

    // Pass the user's details to the template for pre-filling the form
    res.render('apply-premiumJob', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
};




const applyPremiumjob = async (req, res) => {
  try {
    const token = req.cookies.token; // Assuming the JWT token is stored in a cookie
    if (!token) {
      // Handle case where token is missing
      res.status(401).send('Authentication required');
      return;
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId; 

    const jobId = req.params.id;

    let job;
    try {
      job = await Postjob.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
    } catch (error) {
      console.error('Error retrieving job:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Create a new job application with the user's _id
    const newJobApplication = new premiumJob({
      job: jobId,
      user: userId,
      first_name: req.body.first_name,
      other_names: req.body.other_names,
      last_name: req.body.last_name,
      email: req.body.email,
      contact_address: req.body.contact_address,
      phone_no: req.body.phone_no,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      genderSpecify: req.body.genderSpecify,
      additionalInfo: req.body.additionalInfo,
      // Other fields for the job application
    });

    // Save the new job application
    await newJobApplication.save();
    console.log(job)

    res.status(200).render('apply-premiumJob', { job: job });

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your application.');
  }
};







// const applyPremiumjob = async (req, res) => {
//   try {
    
//     const newJobApplication = new premiumJob({
//       first_name: req.body.first_name,
//       other_names: req.body.other_names,
//       last_name: req.body.last_name,
//       email: req.body.email,
//       ontact_address: req.body.contact_address,
//       phone_no: req.body.phone_no,
//       dateOfBirth: req.body.dateOfBirth,
//       gender: req.body.gender,
//       genderSpecify: req.body.genderSpecify,
//       additionalInfo: req.body.additionalInfo,
    
//     });

//     await newJobApplication.save();

//     res.redirect('/');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('An error occurred while processing your application.');
//   }
// };





module.exports = {
    applyPremiumjob,
    getApplypremiumJob
}