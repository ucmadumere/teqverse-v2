const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './public/upload/cv');
  },
  filename: function(request, file, callback) {
    callback(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = function (request, file, callback) {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'text/csv'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Only PDF, DOC, and ODT, docx, CSV files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 3 // 3MB limit
  },
});


module.exports = upload;
