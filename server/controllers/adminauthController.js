const express = require('express');
const postJob = require('../models/postJob');
const adminUser = require('../models/adminUserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createAdminJWT } = require('../utils/tokenUtils');
const adminLayout = '../views/layouts/adminLogin';





const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the superuser by email
    const superuser = await adminUser.findOne({ email });

    // If the superuser is not found or the password is incorrect, send an error response
    if (!superuser || !bcrypt.compareSync(password, superuser.password)) {
      return res.status(400).render('error400',
      { errorCode: 400,
        errorMessage: 'Page Unavailable',
        errorDescription: 'Sorry, You do not Have Required Permissions to Access this Page..',
        layout: adminLayout 
      });
    }

    const token = createAdminJWT({userId:superuser._id, role: superuser.role});
    const oneDay = 1000 * 60 * 60 *24

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now()+oneDay),
      secure: process.env.NODE_ENV === 'environment',
      path: '/'
    })
  
      // Redirect to a dashboard or user profile page
      res.redirect('dashboard2');

  } catch (error) {
    console.error(error);
    res.status(500).render('error500', {
        errorCode: 400,
        errorMessage: "Internal Server Error",
        errorDescription: "The system encountered an error while trying to get the User. Please check your credentials and try again",
        layout: adminLayout
    });
  }
};





const createSuperuser = async (req, res) => {
  try {
    // Get the username and password from the request body
    const { name, email, password } = req.body;

    // Check is an Admin user exist with the given detals
    const existingUser = await adminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).send('A user with the entered email already exists. Please log in.');
    }

    // Create a new user with the role of 'admin'
    const user = new adminUser({
         name, 
         email, 
         password, 
         role: 'superuser' 
    });

    // Save the user to the database
    await user.save();

    // Send a success response
    res.send('Superuser created successfully');

  } catch (error) {
    // Handle any errors
    res.status(500).send(error.message);
  }
};



const adminLogout = (req, res) => {
  res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
      domain: 'localhost',
      secure: process.env.NODE_ENV === 'production'
  });
  res.status(200).render('logout', {
    layout: adminLayout,
  })
};



module.exports = {
  createSuperuser,
  loginAdmin,
  adminLogout
};

