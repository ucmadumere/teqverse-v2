const express = require('express');
const  router = express.Router();
const Postjob = require('../models/postJob');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const verifyPassword = require('../../utilities/passwordUtils');
const verifyToken = require('../../utilities/verifyToken');


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
router.get('/login', (req, res) => {
    res.render('login'); 
});

router.post('/login', verifyToken, async (req, res) => {
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
        const token = jwt.sign({ userId: user._id },  process.env.JWT_SECRET, { expiresIn: '1h' });

        // Send the token back to the client
        res.status(200).json({ token });
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

// function insertPostData () {
//   Postjob.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js",
//       jobType: "hybrid",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening'],

//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments...",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 5,
//       requirements: ['Reading', 'Gardening']
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']

//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']

//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan.",
//       jobType: "onsite",
//       jobLocation: "Abuja",
//       experience: 2,
//       requirements: ['Reading', 'Gardening']
//     },
//   ])
// }

// insertPostData();


module.exports = router;
