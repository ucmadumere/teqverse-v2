const express = require('express');
const  router = express.Router();
const Postjob = require('../models/postJob');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const verifyPassword = require('../../utilities/passwordUtils');
const verifyToken = require('../../utilities/verifyToken');
const bcrypt = require('bcrypt')


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


/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN IN                                              **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/login',  (req, res) => {
    res.render('login', { user:req.User });
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Validate the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log(token)
      
      res.json('/');

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  



/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN UP                                              **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/signup', (req,res) => {
    res.render('signup');
}); 
 router.post('/signup', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('A User with the entered Email already exists. Please Log in..');
        }

        const newUser = new User({
            name,
            email,
            password,
        });

        await newUser.save();

        res.redirect('/login');
    }catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
 });


router.get('/blog', (req,res) => {
    res.render('blog');
});



// router.get('/joblist', async (req,res) => {
//     try {
//         const locals = {
//             title: "TeqVerse",
//             description: "Job List"
//           }

//         let perPage = 5;
//         let page = req.query.page || 1;

//         const data = await Postjob.aggregate([ {$sort: { createdAt: -1}}])
//         .skip(perPage * page - perPage)
//         .limit(perPage)
//         .exec();

//         const count = await Postjob.countDocuments({});
//         const nextPage = parseInt(page) + 1;
//         const hasNextPage = nextPage <= Math.ceil(count / perPage);

//         // const data = await Postjob.find();
//         res.render('jobList', {data,
//             locals,
//             current: page,
//             nextPage: hasNextPage ? nextPage : null,
//             });


router.get('/joblist', async (req, res) => {
  try {
    const locals = {
      title: 'TeqVerse',
      description: 'Job List',
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5; // Number of items per page

    const totalJobs = await Postjob.countDocuments();
    const totalPages = Math.ceil(totalJobs / pageSize);

    const jobs = await Postjob.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.render('joblist', {
      data: jobs,
      locals,
      page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
  
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
    

module.exports = router;
