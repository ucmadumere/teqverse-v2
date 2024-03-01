const express = require('express');
const PostJob = require('../models/postJob');
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
      closingDate,
      salaryRange,
      companyName,
      methodOfApplication,
      salaryRange,
      companyName,
      skills
    } = req.body;

    // Check if the job category is valid
    if (jobCategory !== 'Regular' && jobCategory !== 'Premium') {
      return res.status(400).send('Invalid job category');
    }

    const skillsArray = skills.split(',').map(skill => skill.trim());

    
    const newPost = new PostJob({
      title,
      jobDescription,
      jobType,
      workType,
      jobLocation,
      jobOverview,
      experience,
      requirements,
      jobCategory, 
      closingDate,
      salaryRange,
      companyName,
      methodOfApplication,
      salaryRange,
      companyName,
      skills: skillsArray
    });

    // Save the new postJob object to the database
    await newPost.save();

    // Redirect to the dashboard on successful creation
    res.redirect('/guest-user-job');
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating job:', error);
    res.status(500).send('Failed to create job: ' + error.message);
  }
};



/**--------------------------------------------------------------------------------------------------- **/
/**                                  Get Guest Job List                                                **/
/**--------------------------------------------------------------------------------------------------- **/
const getGuestList = async (req, res) => {
  try {
    const locals = {
      title: 'Job List',
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5; // Number of items per page

    const totalJobs = await PostJob.countDocuments();
    const totalPages = Math.ceil(totalJobs / pageSize);

    const data = await PostJob.find()
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


/**--------------------------------------------------------------------------------------------------- **/
/**                                  Update Job Controller                                             **/
/**--------------------------------------------------------------------------------------------------- **/

const updatejob = async (req, res) => {
  const { title, experience, jobLocation, jobType, workType, jobDescription, salaryRange, companyName, jobOverview, requirements, jobCategory, closingDate, methodOfApplication, skills, updatedAt } = req.body;
  const skillsArray = skills.split(',').map(skill => skill.trim());
  try {

    await PostJob.findByIdAndUpdate(req.params.id, {

      title: req.body.title,
      experience: req.body.experience,
      jobLocation: req.body.jobLocation,
      jobType: req.body.jobType,
      workType: req.body.workType,
      jobDescription: req.body.jobDescription,
      jobOverview: req.body.jobOverview,
      requirements: req.body.requirements,
      jobCategory: req.body.jobCategory,
      closingDate: req.body.closingDate,
      salaryRange: req.body.salaryRange,
      companyName: req.body.companyName,
      methodOfApplication: req.body.methodOfApplication,
      salaryRange: req.body.salaryRange,
      companyName: req.body.companyName,
      skills: skillsArray,
      updatedAt: Date.now(),
      
    });

    // res.redirect(`/edit-job/${req.params.id}`);
    res.redirect('/guest-user-job');

  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).send('Internal Server Error');
  }
};




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
      jobCategory: req.body.jobCategory,
      closingDate: req.body.closingDate,
      methodOfApplication: req.body.methodOfApplication,
      
      skills: req.body.skills,
    };

    const data = await PostJob.findOne({ _id: req.params.id });

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
    await PostJob.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard2');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An error occurred while deleting the post' });
  }
};



// const deleteJob = async (req, res) => {
//   try {
//     await PostJob.deleteOne({ _id: req.params.id });
//     res.redirect('/dashboard2');
//   } catch (error) {
//     console.log(error);
//   }
// };



module.exports = {
  deleteJob,
  updatejob,
  getEditJob,
  createJob,
  getAdmin,
  getGuestList,
}