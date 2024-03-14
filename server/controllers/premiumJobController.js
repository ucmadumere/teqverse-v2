const premiumJob = require('../models/premiumJobApplication')
const User = require('../models/userModel')
const userLayout = '../views/layouts/userLogin'
const jwt = require('jsonwebtoken')
const postJob = require('../models/postJob')
const adminLayout = '../views/layouts/adminLogin'

// Controller function to render the job application form
const getApplypremiumJob = async (req, res) => {
  try {
    // Retrieve the JWT token from the request cookies
    const token = req.cookies.token

    if (!token) {
      // If the token is missing, the user is not authenticated
      // You may want to handle this case based on your application's requirements
      res.status(401).send('Authentication required')
      return
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const { userId } = decodedToken

    // Assuming you have a way to retrieve user details from the database
    // You can use the userId to fetch the user's details from the database
    // Replace this with your actual code to retrieve user details
    const user = await User.findById(userId).exec()

    if (!user) {
      // Handle case where user is not found
      res.status(404).send('User not found')
      return
    }

    // Assuming you have a way to retrieve the job details based on the request
    // For example, if the job ID is passed in the URL params
    const jobId = req.params.id // Replace with your actual way of getting the job ID
    const job = await postJob.findById(jobId).exec()

    if (!job) {
      // Handle case where job is not found
      res.status(404).send('Job not found')
      return
    }

    // Pass both user and job details to the template for pre-filling the form
    // res.render("apply-premiumJob", { user, job });
    res.render('jobdetails', { user, job })
  } catch (error) {
    console.error(error)
    res.status(500).send('An error occurred while processing your request.')
  }
}



const applyPremiumjob = async (req, res) => {
  try {
    const token = req.cookies.token // Assuming the JWT token is stored in a cookie
    if (!token) {
      // Handle case where token is missing
      return res.status(401).send('Authentication required')
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId

    // Fetch the user's current data from the database
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).send('User not found')
    }

    const jobId = req.params.id

    // Check if the user has already applied for this job
    const existingApplication = await premiumJob.findOne({
      job: jobId,
      user: userId
    })
    if (existingApplication) {
      return res.redirect(
        '/?failure=Existing Application: This user has already applied for this job. check application status'
      )
    }

    let job
    try {
      job = await postJob.findById(jobId)
      if (!job) {
        return res.status(404).json({ message: 'Job not found' })
      }
    } catch (error) {
      console.error('Error retrieving job:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }

 

    // Create a new job application with the user's _id
    const newJobApplication = new premiumJob({
      job: jobId,
      user: userId,
      first_name: user.first_name,
      other_name: user.other_name,
      last_name: user.last_name,
      email: user.email,
      contact_address: req.body.contact_address,
      phone_no: req.body.phone_no,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      genderSpecify: req.body.genderSpecify,
      additionalInfo: req.body.additionalInfo,
      coverLetter: req.body.coverLetter,
      applicationsStatus: [{ status: 'Submitted' }]
    })

    // Save the new job application
    await newJobApplication.save()
    return res.redirect(
      '/?success=Application Created Successfully, Please check your application status for updates'
    )
  } catch (error) {
    console.error('Error processing request:', error)
    return res.redirect('/?failure=Internal Server Error')
  }
}

const viewAllApplications = async (req, res) => {
  try {
    const token = req.cookies.token // Assuming the JWT token is stored in a cookie
    if (!token) {
      // Handle case where token is missing
      return res.redirect('/?failure=Please log in to view all Applications')
    }

    // Verify the JWT token to extract user details
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId

    // Find all job applications for the user
    const jobApplications = await premiumJob.find({ user: userId })

    // Create an array to store job details for each application
    const jobDetailsPromises = jobApplications.map(application => {
      return postJob.findById(application.job)
    })

    // Fetch job details for all applications
    const jobDetails = await Promise.all(jobDetailsPromises)

    res.render('user_dashboard/all-applications', {
      jobApplications: jobApplications,
      jobDetails: jobDetails,
      layout: adminLayout
    })
  } catch (error) {
    console.error('Error retrieving applications:', error)
    return res.status(500).render('error', { message: 'Internal server error' })
  }
}






const uploadUserCv = async (req, res) => {
  try {
    // Upload image to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path, { folder: `profiles/${req.userId}` });
    // console.log('Cloudinary upload result:', result); // Log the result
    // Update user profile image URL in the database
    const user = await User.findByIdAndUpdate(req.userId, { cv: req.body.secure_url }, { new: true });

    

    // Redirect with success message
    // return res.redirect('update-profile?success=Profile Image Uploaded Successfully...');
    res.status(200).json({
      error: false, message: "CV Uploaded successfully"
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err); // Log any errors
    res.status(500).json({ message: 'Failed to update profile image', error: err.message });
  }
};

module.exports = {
  applyPremiumjob,
  getApplypremiumJob,
  viewAllApplications,
  uploadUserCv
}
