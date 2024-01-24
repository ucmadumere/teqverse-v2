const express = require('express');
const postJob = require('../models/postJob');
const adminUser = require('../models/adminUserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/adminLogin';
const jwtSecret = process.env.JWT_SECRET;





const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the superuser by email
    const superuser = await adminUser.findOne({ email });

    // If the superuser is not found or the password is incorrect, send an error response
    if (!superuser || !bcrypt.compareSync(password, superuser.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const adminAcessToken = jwt.sign (
      { userId: superuser._id,},
      process.env.JWT_SECRET,
      { expiresIn: 2 * 60 * 1000 }
    
    );

       // Set the token in a cookie
       res.cookie('jwt', adminAcessToken, {
        httpOnly: true,
        maxAge: 2 * 60 * 1000, // 20 hours in milliseconds
        secure: true, // Set to true if using HTTPS
        sameSite: 'None'
      });
  
      // Redirect to a dashboard or user profile page
      res.redirect('dashboard2');

  } catch (error) {
    console.error(error);
    res.status(500).render('error500', {
        errorCode: 400,
        errorMessage: "Internal Server Error",
        errorDescription: "The system encountered an error while trying to get the User. Please check your credentials and try again",
        layout: userLayout,
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
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    // res.redirect('/');
    res.render('admin/sigin', {
        layout: adminLayout
    });
};


module.exports = {
  createSuperuser,
  loginAdmin,
  adminLogout
};

