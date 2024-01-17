const express = require('express');
const router = express.Router();
const postJob = require('../models/postJob');
const User = require('../models/adminUserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/adminLogin';
const jwtSecret = process.env.JWT_SECRET;


/**
 * 
 * Check Login
*/
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

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
 * Admin - Check Login
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
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error)
    }

});

/**
 * GET /
 * Admin Dashboard
*/
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard'
        }

        const data = await postJob.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});

/**
* GET /
* Admin - Create New Job Post
*/
router.get('/add-job', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
        }

        const data = await postJob.find();
        res.render('admin/add-job', {
            locals,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});

/**
* POST /
* Admin - Create New Job Post
*/
router.post('/add-job', authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        try {
            const newPost = new postJob({
                title: req.body.title,
                body: req.body.body,
                jobType: req.body.jobType,
                jobLocation: req.body.jobLocation,
                experience: req.body.experience,
            });

            await postJob.create(newPost);
            res.redirect('/dashboard');
        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Edit Post
*/
router.get('/edit-job/:id', authMiddleware, async (req, res) => {
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
  
  });

/**
 * PUT /
 * Admin - Edit Post
*/
router.put('/edit-job/:id', authMiddleware, async (req, res) => {
    try {
  
      await postJob.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      });
  
      res.redirect(`/edit-job/${req.params.id}`);
  
    } catch (error) {
      console.log(error);
    }
  
  });


/**
 * GET /
 * Admin - Register
*/
// router.get('/register', async (req, res) => {

//     res.render('admin/register', { locals, layout: adminLayout });
// });

/**
 * POST /
 * Admin - Register
*/

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User Created', user });
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: 'User already in use' });
            }
            res.status(500).json({ message: 'Internal server error' })
        }

    } catch (error) {
        console.log(error);
    }
});

/**
 * DELETE /
 * Admin - Delete Post
*/
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
      await postJob.deleteOne( { _id: req.params.id } );
      res.redirect('/dashboard');
    } catch (error) {
      console.log(error);
    }
  
  });

  /**
 * GET /
 * Admin Logout
*/
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    // res.redirect('/');
    res.render('admin/index', {
        layout: adminLayout
    });
  });





module.exports = router;