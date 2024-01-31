const express = require('express');
const postJob = require('../models/postJob');
const adminUser = require('../models/adminUserModel');

const adminLayout = '../views/layouts/adminLogin';




const getAdmin = async (req, res) => {
  try {
    const locals = {
      title: "Admin Panel"
    }
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error)
  }
}


/**--------------------------------------------------------------------------------------------------- **/
/**                                  Create Jobs Controller                                            **/
/**--------------------------------------------------------------------------------------------------- **/


const createJob = async (req, res) => {
  try {
    const {
      title,
      jobDescription,
      jobType,
      workType,
      jobLocation,
      jobOverview,
      experience,
      requirements,
      jobCategory,
    } = req.body;

    // Check if the job category is valid
    if (jobCategory !== 'normal' && jobCategory !== 'premium') {
      return res.status(400).send('Invalid job category');
    }

    // Create a new postJob object with the specified category
    const newPost = new postJob({
      title,
      jobDescription,
      jobType,
      workType,
      jobLocation,
      jobOverview,
      experience,
      requirements,
      jobCategory, // Include the job category in the new post
    });

    // Save the new postJob object to the database
    await newPost.save();

    // Redirect to the dashboard on successful creation
    res.redirect('/guest-user-job');
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating job:', error);
    // Send an error response with detailed error message
    res.status(500).send('Failed to create job: ' + error.message);
  }
};

// const createJob = async (req, res) => {
//   try {
//     const {
//       title,
//       jobDescription,
//       jobType,
//       workType,
//       jobLocation,
//       jobOverview,
//       experience,
//       requirements,
//     } = req.body;

    // Create a new postJob object
    // const newPost = new postJob({
    //   title,
    //   jobDescription,
    //   jobType,
    //   workType,
    //   jobLocation,
    //   jobOverview,
    //   experience,
    //   requirements,
    // });

    // Save the new postJob object to the database
    // await newPost.save();

    // Redirect to the dashboard on successful creation
  //   res.redirect('/guest-user-job');
  // } catch (error) {
    // Log the error for debugging purposes
    // console.error('Error creating job:', error);
    // Send an error response with detailed error message
//     res.status(500).send('Failed to create job: ' + error.message);
//   }
// };
/**--------------------------------------------------------------------------------------------------- **/
/**                                  Create Premium Controller                                            **/
/**--------------------------------------------------------------------------------------------------- **/


// const createPremium = async (req, res) => {
//   try {
//     const {
//       title,
//       jobDescription,
//       jobType,
//       workType,
//       jobLocation,
//       jobOverview,
//       experience,
//       requirements,
//     } = req.body;

    // Create a new premiumJob object
    // const newPost = new premiumJob({
    //   title,
    //   jobDescription,
    //   jobType,
    //   workType,
    //   jobLocation,
    //   jobOverview,
    //   experience,
    //   requirements,
    // });

    // Save the new postJob object to the database
    // await newPost.save();

    // Redirect to the dashboard on successful creation
  //   res.redirect('/premium-user-job');
  // } catch (error) {
    // Log the error for debugging purposes
    // console.error('Error creating job:', error);
    // Send an error response with detailed error message
//     res.status(500).send('Failed to create job: ' + error.message);
//   }
// };



/**--------------------------------------------------------------------------------------------------- **/
/**                                  Get Guest Job List                                                **/
/**--------------------------------------------------------------------------------------------------- **/
const getGuestList = async (req, res) => {
  try {
    const locals = {
      title: 'Guest Job List',
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5; // Number of items per page

    const totalJobs = await postJob.countDocuments();
    const totalPages = Math.ceil(totalJobs / pageSize);

    const data = await postJob.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.render('admin/guest-user-job', {
      locals,
      data,
      currentPage: page,
      totalPages,
      layout: adminLayout,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};
/**--------------------------------------------------------------------------------------------------- **/
/**                                  Get Premium Job List                                                **/
/**--------------------------------------------------------------------------------------------------- **/
const getPremiumList = async (req, res) => {
  try {
    const locals = {
      title: 'Premium Job List',
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5; // Number of items per page

    const totalJobs = await premiumJob.countDocuments();
    const totalPages = Math.ceil(totalJobs / pageSize);

    const data = await premiumJob.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.render('admin/premium-user-job', {
      locals,
      data,
      currentPage: page,
      totalPages,
      layout: adminLayout,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};


/**--------------------------------------------------------------------------------------------------- **/
/**                                  Update Job Controller                                             **/
/**--------------------------------------------------------------------------------------------------- **/

const updatejob = async (req, res) => {
  try {

    await postJob.findByIdAndUpdate(req.params.id, {

      title: req.body.title,
      experience: req.body.experience,
      jobLocation: req.body.jobLocation,
      jobType: req.body.jobType,
      workType: req.body.workType,
      jobDescription: req.body.jobDescription,
      jobOverview: req.body.jobOverview,
      requirements: req.body.requirements,
      updatedAt: Date.now(),
    });

    // res.redirect(`/edit-job/${req.params.id}`);
    res.redirect('/guest-user-job');

  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).send('Internal Server Error');
  }
};  


// const getEditJob = async (req, res, next) => {
//   try {
//     const locals = {
//       title: req.body.title,
//       experience: req.body.experience,
//       jobLocation: req.body.jobLocation,
//       jobType: req.body.jobType,
//       workType: req.body.workType,
//       jobDescription: req.body.jobDescription,
//       jobOverview: req.body.jobOverview,
//       requirements: req.body.requirements,
//     };

//     const data = await postJob.findOne({ _id: req.params.id });

//     // Attach the locals and data to the request object
//     req.locals = locals;
//     req.data = data;

//     // Call next to pass control to the next middleware or route handler
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

  

const getEditJob = async (req, res) => {
  try {

    const locals = {
      title: req.body.title,
      experience: req.body.experience,
      jobLocation: req.body.jobLocation,
      jobType: req.body.jobType,
      workType: req.body.workType,
      jobDescription: req.body.jobDescription,
      jobOverview: req.body.jobOverview,
      requirements: req.body.requirements,
    };

    const data = await postJob.findOne({ _id: req.params.id });

    res.render('admin/edit-job', {
      locals,
      data,
      layout: adminLayout,
    });

  
  } catch (error) {
    console.log(error)
  }
};



/**--------------------------------------------------------------------------------------------------- **/
/**                                  Delete Job                                                        **/
/**--------------------------------------------------------------------------------------------------- **/
const deleteJob = async (req, res) => {
  try {
    await postJob.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard2');
  } catch (error) {
    console.log(error);
  }
};



module.exports = {
  deleteJob,
  updatejob,
  //updatepremium,
  getEditJob,
  //getEditPremiumJob,
  createJob,
  // createPremium,
  getAdmin,
  getPremiumList,
  getGuestList,
}