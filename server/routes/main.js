const express = require('express');
const  router = express.Router();

// Routes
router.get('/', (req,res) => {
    res.render('index');
});

router.get('/blog', (req,res) => {
    res.render('blog');
});

router.get('/joblist', (req,res) => {
    res.render('joblist');
});

router.get('/joblistingdetail', (req,res) => {
    res.render('joblistingdetail');
});

router.get('/about', (req,res) => {
    res.render('about');
});

router.get('/login', (req,res) => {
    res.render('login');
});




module.exports = router;
