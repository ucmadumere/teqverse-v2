const express = require('express');
const  router = express.Router();
const Postjob = require('../models/postJob');
const User = require('../models/usersModel');

const adminLayout = '../views/layouts/adminLogin'


/**
 * GET /
 * Admin - Login Page
*/

router.get('/admin', async (req,res) => {
    try {
        const locals = {
            title: "Admin Panel"
        }
        res.render('admin/index', {locals,layout: adminLayout });
    } catch (error) {
        console.log(error)
    }
    
});

/**
 * POST /
 * Admin - Login Page
*/

router.post('/admin', async (req,res) => {
    try {
        const {username, password} = req.body;
        console.log(req.body);



        res.redirect('/admin');
    } catch (error) {
        console.log(error)
    }
    
});

/**
 * POST /
 * Admin - Register
*/

router.post('/register', async (req,res) => {
    try {
        const {username, password} = req.body;
        console.log(req.body);



        res.redirect('/admin');
    } catch (error) {
        console.log(error)
    }
    
});




module.exports = router;