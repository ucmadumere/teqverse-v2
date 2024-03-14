const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const fs = require('fs');



// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });


function decodeToken(req, res, next) {
  const token = req.cookies.token; // Assuming the JWT token is stored in a cookie named 'token'

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_secret_key' with your actual JWT secret key
    req.userId = decoded.userId; // Attach the user ID from the decoded token to the request object
    // console.log(decoded)
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}



// Set storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = `public/uploads/profiles/${req.userId}`;
//     fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `profile-${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// // Init upload
// const update = multer({
//   storage: storage,
//   limits: { fileSize: 10000000 }, // 10MB max file size
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single('image');


// // Check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images only!');
//     console.log('File upload error:', 'Invalid file type or extension');
//   }
// }


// Update user profile image
const updateProfileImage = async (req, res) => {
  try {
    // Upload image to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path, { folder: `profiles/${req.userId}` });
    // console.log('Cloudinary upload result:', result); // Log the result

    // Update user profile image URL in the database
    const user = await User.findByIdAndUpdate(req.userId, { profileimage: req.body.secure_url }, { new: true });

    // Redirect with success message
    // return res.redirect('update-profile?success=Profile Image Uploaded Successfully...');
    res.status(200).json({
      error: false, message: "Image Uploaded successfully"
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err); // Log any errors
    res.status(500).json({ message: 'Failed to update profile image', error: err.message });
  }
};



module.exports = {
  // update,
  decodeToken,
  updateProfileImage,
};





























// function decodeToken(req, res, next) {
//   const token = req.cookies.token; // Assuming the JWT token is stored in a cookie named 'token'

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_secret_key' with your actual JWT secret key
//     req.userId = decoded.userId; // Attach the user ID from the decoded token to the request object
//     // console.log(decoded)
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// }



// // Set storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const dir = `public/uploads/profiles/${req.userId}`;
//     fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
//     cb(null, dir);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `profile-${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// // Init upload
// const update = multer({
//   storage: storage,
//   limits: { fileSize: 10000000 }, // 10MB max file size
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// }).single('image');

// // Check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images only!');
//   }
// }

// // Update user profile image
// const updateProfileImage = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.userId, { profileimage: req.file.filename }, { new: true });
//     return res.redirect('update-profile?success=Profile Image Uploaded Successfully...');
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to update profile image', error: err.message });
//   }
// };

// module.exports = {
//   update,
//   decodeToken,
//   updateProfileImage,
// };