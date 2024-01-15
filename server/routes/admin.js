const express = require('express');
const router = express.Router();
const Postjob = require('../models/postJob');
const User = require('../models/adminUserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/adminLogin';
const jwtSecret = process.env.JWT_SECRET;


/**
 * GET /
 * Admin - Login Page
*/

router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: "Admin Panel"
        }
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error)
    }

});

/**
 * POST /
 * Admin - Login Page
*/

router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error)
    }

});

/**
 * GET /
 * Dashboard
*/

router.get('/dashboard', async (req, res) => {

    res.render('admin/dashboard');
});

/**
 * POST /
 * Admin - Register
*/

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        username,
        password: hashedPassword
    })
    await user.save()

    res.redirect('admin/dashboard')


});




module.exports = router;