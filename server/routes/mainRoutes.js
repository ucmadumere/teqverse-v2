const express = require('express');
const router = express.Router();
const Postjob = require('../models/postJob');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const verifyPassword = require('../../utilities/passwordUtils');
const verifyToken = require('../../utilities/verifyToken');
const bcrypt = require('bcrypt')


// Routes

router.get('/', (req, res) => {
    res.render('index');
});


/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN IN                                              **/
/**--------------------------------------------------------------------------------------------------- **/


router.get('/login', (req, res) => {
  res.render('login'); // Assuming `req.User` is correctly populated
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    

    // Redirect to a dashboard or user profile page
    res.redirect('/'); 
    console.log(res)

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

  
  


/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN UP                                              **/
/**--------------------------------------------------------------------------------------------------- **/
router.get('/signup', (req, res) => {
    res.render('signup');
});
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

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
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

router.get('/blog', (req, res) => {
    res.render('blog');
});

/**--------------------------------------------------------------------------------------------------- **/
/**                                               JOB & DETAILS STARTS HERE                            **/
/**--------------------------------------------------------------------------------------------------- **/
// router.get('/joblist', async (req, res) => {
//     try {
//       const locals = {
//         title: 'TeqVerse',
//         description: 'Job List',
//       };
  
//       const page = parseInt(req.query.page) || 1;
//       const pageSize = 5; // Number of items per page
//       let query = {};
  
//       // Check if a search term is provided in the query parameters
//       const searchTerm = req.query.q;
//       if (searchTerm) {
//         // Use a case-insensitive regex to match the search term in title or body
//         query = {
//           $or: [
//             { title: { $regex: searchTerm, $options: 'i' } },
//             { body: { $regex: searchTerm, $options: 'i' } },
//           ],
//         };
//       }
  
//       const totalJobs = await Postjob.countDocuments(query);
//       const totalPages = Math.ceil(totalJobs / pageSize);
  
//       const jobs = await Postjob.find(query)
//         .skip((page - 1) * pageSize)
//         .limit(pageSize);
  
//       res.render('jobList', {
//         data: jobs,
//         locals,
//         page,
//         totalPages,
//         searchTerm,
//       });
      
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   });

router.get('/joblist', async (req, res) => {
  try {
    const locals = {
      title: 'TeqVerse',
      description: 'Job List',
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5; // Number of items per page
    let query = {};

    // Check if a search term is provided in the query parameters
    const searchTerm = req.query.q;
    if (searchTerm) {
      // Use a case-insensitive regex to match the search term in title or body
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { body: { $regex: searchTerm, $options: 'i' } },
        ],
      };
    }

    // Filter by location
    if (req.query.location) {
      query.jobLocation = req.query.location;
    }

    // Filter by experience
    if (req.query.experience) {
      query.experience = { $gte: parseInt(req.query.experience) };
    }

    // Filter by work type
    if (req.query.workType) {
      query.workType = req.query.workType;
    }

    // Filter by job type
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    const totalJobs = await Postjob.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / pageSize);

    const jobs = await Postjob.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.render('jobList', {
      data: jobs,
      locals,
      page,
      totalPages,
      searchTerm,
      location: req.query.location, // Pass location to template
      experience: req.query.experience, // Pass experience to template
      workType: req.query.workType, // Pass workType to template
      jobType: req.query.jobType, // Pass jobType to template
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Filter reset
router.get('/resetfilters', (req, res) => {
  // Redirect to the joblist route without any filter parameters
  res.redirect('/joblist');
});
        

router.get('/jobdetails', (req, res) => {


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

/**--------------------------------------------------------------------------------------------------- **/
/**                                               JOB & DETAILS ENDS HERE                                **/
/**--------------------------------------------------------------------------------------------------- **/


module.exports = router;
