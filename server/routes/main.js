const express = require('express');
const  router = express.Router();
const Postjob = require('../models/postJob')

// Routes
router.get('/', (req,res) => {
    res.render('index');
});

router.get('/login', (req,res) => {
    res.render('login');
});


router.get('/blog', (req,res) => {
    res.render('blog');
});

router.get('/joblist', async (req,res) => {
    try {
        // let perPage = 5;
        // let page = req.query.page || 1;

        // const data = await Post.aggregate([ {$sort: { createdAt: -1}}])
        // .skip(perPage * page - perPage)
        // .limit(perPage)
        // .exec();

        // const count = await Post.count();
        // const nextPage = parseInt(page) + 1;
        // const hasNextPage = nextPage <= Math.ceil(count / perPage);

        const data = await Postjob.find();
        res.render('joblist', {data});
    } catch (error) {
        console.log(error)
    }
    
});

router.get('/joblistingdetail', (req,res) => {
    res.render('joblistingdetail');
});

router.get('/about', (req,res) => {
    res.render('about');
});




// function insertPostData (){
//     Postjob.insertMany([
//         {
//             title: "React Developer ",
//             body: "Sitting mistake towards his few country ask. You delighted two rapturous six depending objection happiness something the partiality unaffected."
//         },
//         {
//             title: "React Developer ",
//             body: "Sitting mistake towards his few country ask. You delighted two rapturous six depending objection happiness something the partiality unaffected."
//         },
//         {
//             title: "React Developer ",
//             body: "Sitting mistake towards his few country ask. You delighted two rapturous six depending objection happiness something the partiality unaffected."
//         },
//         {
//             title: "React Developer ",
//             body: "Sitting mistake towards his few country ask. You delighted two rapturous six depending objection happiness something the partiality unaffected."
//         },
//         {
//             title: "React Developer ",
//             body: "Sitting mistake towards his few country ask. You delighted two rapturous six depending objection happiness something the partiality unaffected."
//         },
//         {
//             title: "React Developer ",
//             body: "Sitting mistake towards his few country ask. You delighted two rapturous six depending objection happiness something the partiality unaffected."
//         }
//     ])
// }
// insertPostData();


module.exports = router;
