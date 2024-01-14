const express = require('express');
const  router = express.Router();
const Postjob = require('../models/postJob')

// Middleware to handle pagination
// app.use((req, res, next) => {
//     const page = parseInt(req.query.page) || 1; // Get the requested page or default to 1
//     const itemsPerPage = 10; // Set the number of items per page
  
//     const startIndex = (page - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
  
//     res.locals.pagination = {
//       currentPage: page,
//       totalPages: Math.ceil(data.length / itemsPerPage),
//     };
  
//     res.locals.data = data.slice(startIndex, endIndex);
  
//     next();
//   });

// Routes
router.get('/', (req,res) => {
    res.render('index');
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.get('/signup', (req,res) => {
    res.render('signup');
});


router.get('/blog', (req,res) => {
    res.render('blog');
});

router.get('/joblist', async (req,res) => {
    try {
        const locals = {
            title: "TeqVerse",
            description: "Job List"
          }

        let perPage = 5;
        let page = req.query.page || 1;

        const data = await Postjob.aggregate([ {$sort: { createdAt: -1}}])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Postjob.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        // const data = await Postjob.find();
        res.render('joblist', {data,
            locals,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            });
    } catch (error) {
        console.log(error)
    }
    
});

router.get('/jobdetails', (req,res) => {
    
    res.render('jobdetails');
});

/**
 * GET /
 * Job Listing Details :id
*/
router.get('/jobdetails/:id', async (req, res) => {
    try {
        const locals = {
            title: "TeqVerse",
            description: "Job Detail"
          }
      let slug = req.params.id;
  
      const data = await Postjob.findById({ _id: slug });
  
      res.render('jobdetails', { 
        locals,
        data,
        currentRoute: `/jobdetails/${slug}`
      });
    } catch (error) {
      console.log(error);
    }
  
  });

  /**
 * POST /
 * Post - searchTerm
*/
// router.post('/search', async (req, res) => {
//     try {
//       let searchTerm = req.body.searchTerm;
//       const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
  
//       const data = await Postjob.find({
//         $or: [
//           { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
//           { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
//         ]
//       });
  
//       res.render("search", {
//         data,
//         currentRoute: '/'
//       });
  
//     } catch (error) {
//       console.log(error);
//     }
  
//   });

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
