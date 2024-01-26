const express = require('express');
const postJob = require('../models/postJob');
const adminUser = require('../models/adminUserModel');

const adminLayout = '../views/layouts/adminLogin';



// /**
//  * 
//  * Check Login
// */
// const authMiddleware = (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     try {
//         const decoded = jwt.verify(token, jwtSecret);
//         req.userId = decoded.userId;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// }

const getAdmin = async (req, res) => {
    try {
        const locals = {
            title: "Admin Panel"
        }
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
        console.log(error)
    }
}

// const postAdmin = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const user = await adminUser.findOne({ username });

//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const token = jwt.sign({ userId: user._id }, jwtSecret);
//         res.cookie('token', token, { httpOnly: true });
//         res.redirect('/dashboard');

//     } catch (error) {
//         console.log(error)
//     }
// }

// const getDashboard = async (req, res) => {
//     try {
//         const locals = {
//             title: 'Dashboard'
//         }

//         const data = await postJob.find();
//         res.render('admin/dashboard', {
//             locals,
//             data,
//             layout: adminLayout
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }

// const getAddJob = async (req, res) => {
//     try {
//         const locals = {
//             title: 'Add Post',
//         }

//         const data = await postJob.find();
//         res.render('admin/add-job', {
//             locals,
//             layout: adminLayout
//         });

//     } catch (error) {
//         console.log(error);
//     }
// }


const createJob = async (req, res) => {
  try {
    const {
      title,
      jobDescription,
      jobType,
      workType,
      jobLocation,
      experience,
      requirements,
    } = req.body;

    // Create a new postJob object
    const newPost = new postJob({
      title,
      jobDescription,
      jobType,
      workType,
      jobLocation,
      experience,
      requirements,
    });

    // Save the new postJob object to the database
    await newPost.save();

    // Redirect to the dashboard on successful creation
    res.redirect('/dashboard2');
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error creating job:', error);
    // Send an error response with detailed error message
    res.status(500).send('Failed to create job: ' + error.message);
  }
};



const getEditJob = async (req, res) => {
    try {

        const locals = {
            title: "Edit Post"
        };

        const data = await postJob.findOne({ _id: req.params.id });

        res.render('admin/edit-job', {
            locals,
            data,
            layout: adminLayout
        })

    } catch (error) {
        console.log(error);
    }
}



const updatejob = async (req, res) => {
    try {
        await postJob.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            jobType: req.body.jobType,
            workType: req.body.workType,
            jobLocation: req.body.jobLocation,
            experience: req.body.experience,
            requirements: req.body.requirements,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-job/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }
}


/**
 * GET /
 * Admin - Register
*/


/**
 * POST /
 * Admin - Register
*/

// const register = async (req, res) => {
//     try {
//         const { username, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);

//         try {
//             const user = await User.create({ username, password: hashedPassword });
//             res.status(201).json({ message: 'User Created', user });
//         } catch (error) {
//             if (error.code === 11000) {
//                 res.status(409).json({ message: 'User already in use' });
//             }
//             res.status(500).json({ message: 'Internal server error' })
//         }

//     } catch (error) {
//         console.log(error);
//     }
// };

const deletePost = async (req, res) => {
    try {
        await postJob.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
};

// const logout = (req, res) => {
//     res.clearCookie('token');
//     //res.json({ message: 'Logout successful.'});
//     // res.redirect('/');
//     res.render('admin/index', {
//         layout: adminLayout
//     });
// };


module.exports = {
    deletePost,
    updatejob,
    getEditJob,
    createJob,
    getAdmin,
}