const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validateEmail = require('../../validators/emailValidator')
const validatePassword = require('../../validators/passwordValidator')


const adminUserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name Field cannot be blank']
    },
    email: {
      type: String,
      required: [true, 'Email Field cannot be blank'],
      unique: true,
      validate: {
        validator:validateEmail,
        message: 'Invalid Email Format, Please check and try Again...',
      },
    },
    role: {
      type: String,
      enum: ['user','admin', 'superuser'],
      default: 'superuser'
    },

    password: {
      type: String,
      required: [true, 'Password Field cannot be blank'],
      validate: {
          validator:validatePassword,
          message: 'Password must contain at Least one of (A-Z, a-z, (!@#$-_%^&*) and must be at least 8)...',
      },
    },
  },
  {
    timestamps: true,
  }
);


adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
      return next();
  }

  try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
  } catch (error) {
      return next(error);
  }
});

// Custom validator for password comparison
adminUserSchema.path('password').validate({
  validator: function (value) {
    return value.length >= 8; // Add any additional password complexity checks here
  },
  message: 'Password must be at least 8 characters long',
});

module.exports = mongoose.model('adminUser', adminUserSchema);