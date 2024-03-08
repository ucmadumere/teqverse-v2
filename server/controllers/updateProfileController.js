const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const path = require('path'); // Import the 'path' module
const stream = require('stream'); // Import the 'stream' module

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function decodeToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    res.locals.user = { userId: req.userId }; // Set the user object in locals
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}


// Set storage engine using multer and cloudinary
const storage = multer.memoryStorage();

// Init upload
const update = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB max file size
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

// Update user profile image
const updateProfileImage = async (req, res) => {
  try {
    // Use cloudinary.uploader.upload_stream to directly stream the Buffer to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream({
      folder: `profiles/${req.userId}`,
      public_id: `profile-${req.userId}-${Date.now()}`,
    }, (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to update profile image', error: error.message });
      }
    
      console.log(result); // Log the result object to the console
    
      // Update user profile image URL in the database
      User.findByIdAndUpdate(req.userId, { profileimage: result.secure_url }, { new: true })
        .then(() => res.redirect('update-profile?success=Profile Image Uploaded Successfully...'))
        .catch((err) => res.status(500).json({ message: 'Failed to update profile image in database', error: err.message }));
    });

    // If req.file is not present or does not have a buffer, handle the error
    if (!req.file || !req.file.buffer) {
      throw new Error('No file or buffer found');
    }

    // Stream the Buffer data to Cloudinary
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);
    bufferStream.pipe(uploadStream);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile image', error: err.message });
  }
};

module.exports = {
  update,
  decodeToken,
  updateProfileImage,
};
