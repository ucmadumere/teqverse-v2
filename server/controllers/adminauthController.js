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
      { userId: superuser._id,
        name: superuser.name,
        email: superuser.email,
        role: superuser.role,
        created: superuser.createdAt,
        updated: superuser.updatedAt,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    
    );

    // If the credentials are correct, create a session or token to authenticate the superuser
    req.session.superusertoken = adminAcessToken; // Example: Using session for authentication
    console.log(adminAcessToken)

    // Send a success response
    // res.status(200).json({ message: 'Superuser logged in successfully', superuser });
    res.render('admin/dashboard', {
      layout: adminLayout
  });

  } catch (error) {
    // Handle any errors
    res.status(500).json({ error: error.message });
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

