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
    } = req.body;

    // Create a new postJob object
    const newPost = new postJob({
      title,
      jobDescription,
      jobType,
      workType,
      jobLocation,
      jobOverview,
      experience,
      requirements,
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
/**                                  Update Job Controller                                             **/
/**--------------------------------------------------------------------------------------------------- **/
  const updatejob = async (req, res) => {
    try {

      await postJob.findByIdAndUpdate(req.params.id, {

          title: req.body.title,
          experience: req.body.experience,
          jobLocation: req.body.jobLocation,
          jobType: req.body.jobType,
          jobDescription: req.body.jobDescription,
          updatedAt: Date.now(),
      });
      
      res.redirect(`/edit-job/${req.params.id}`);

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
        jobDescription: req.body.jobDescription,
      };
     
      const data = await postJob.findOne({_id: req.params.id });

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
    getEditJob,
    createJob,
    getAdmin,
    getGuestList
}