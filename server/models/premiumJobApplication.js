const mongoose = require('mongoose');
const {isEmail} = require('validator');

const Schema = mongoose.Schema;


const PremiumJobSchema = new Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'postJob',
    require: true
  },    
   first_name: {
    type: String,
    required: [true, 'This feild is Required']
   },

   other_names: {
    type: String
   },

   last_name: {
    type: String,
    required: [true, 'This feild is Required']
   },

   contact_address: {
    type: String
   },

   email: {
    type: String,
    required: [true, 'This feild is Required'],
    validate: [isEmail, 'Please Enter a Valid Email']
   },

   phone_no: {
    type: String,
    required: [true, 'This feild is Required']
   },

   dateOfBirth: {
    type: Date,
    required: [true, 'This feild is Required']
   },

   gender: {
    type: String,
    enum: ['Male', 'Female', 'Others'],
    required: [true, 'This feild is Required']
   },

   genderSpecify: {
    type: String,
    required: true
   },

   additionalInfo: {
    type: String,
    required: [false, 'This feild is Required']
   },

  coverLetter: {
    type: String,
    required: [false, 'Cover letter is required']
  },

  applicationsStatus: [
    {
      status: {
        type: String,
        enum: ['Submitted', 'Processing', 'On Hold', 'Approved', 'Rejected'],
        default: 'Submitted', // Default status when a new application is created
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  submittedCv: { 
    type: Boolean, 
    default: false 
  },

   createdAt: {
    type: Date,
    default: Date.now
},



});


PremiumJobSchema.pre('save', function (next) {
    // Sanitize the phone number (example: remove all non-numeric characters)
    this.phone_no = this.phone_no.replace(/\D/g, '');
    next();
  });
  

module.exports = mongoose.model('premiumJob', PremiumJobSchema);