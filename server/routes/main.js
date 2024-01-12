const express = require('express');
const  router = express.Router();

// Routes
router.get('/', (req,res) => {
    res.render('index');
});

router.get('/career', (req,res) => {
    res.render('career');
});

router.get('/about', (req,res) => {
    res.render('about');
});


module.exports = router;
