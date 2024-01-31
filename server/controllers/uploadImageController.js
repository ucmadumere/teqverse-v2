const multer = require('multer');
const path = require('path');
const User = require('../models/userModel'); // Assuming you have a User model

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/profiles'); // Directory where the uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // File naming scheme
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profileImage'); // Name of the input field in the form

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check extension
  const mimetype = filetypes.test(file.mimetype); // Check mimetype

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images only! (jpeg, jpg, png, gif)');
  }
}

// Handle profile image upload

// Handle profile image upload
const uploadProfileImage = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
        res.render('upload-profile-image', {
          msg: err // Render the form view with an error message
        });
      } else {
        if (req.file == undefined) {
          res.render('upload-profile-image', {
            msg: 'Error: No File Selected!' // Render the form view with a no file selected error message
          });
        } else {
          // Save the file details (e.g., file path) to the user's profile in MongoDB
          User.findById(req.user.id, (err, user) => {
            if (err) throw err;
            user.profileImage = `uploads${req.file.filename}`;
            user.save((err) => {
              if (err) throw err;
              const imagePath = `uploads${req.file.filename}`;
              res.render('upload-profile-image', {
                msg: 'File Uploaded Successfully!',
                imagePath: imagePath // Pass the file path to the view for display
              });
            });
          });
        }
      }
    });
  };
  
  module.exports = {
    uploadProfileImage
  };
  




// const uploadProfileImage = (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       res.render('upload-profile-image', {
//         msg: err // Render the form view with an error message
//       });
//     } else {
//       if (req.file == undefined) {
//         res.render('upload-profile-image', {
//           msg: 'Error: No File Selected!' // Render the form view with a no file selected error message
//         });
//       } else {
//         // Save the file details (e.g., file path) to the user's profile in MongoDB
//         User.findById(req.user.id, (err, user) => {
//           if (err) throw err;
//           user.profileImage = `uploads/profiles/${req.file.filename}`;
//           user.save((err) => {
//             if (err) throw err;
//             res.redirect('/profile'); // Redirect to the user's profile page after successful upload
//           });
//         });
//       }
//     }
//   });
// };




module.exports = {
    uploadProfileImage
}