const multer = require('multer');
const path = require('path');

const User = require('../models/userModel');




// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/profiles');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

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
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}




module.exports = {
  update
};