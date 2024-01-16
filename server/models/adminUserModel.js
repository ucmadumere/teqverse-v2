const mongoose = require('mongoose');


const adminUserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Email cannot be blank']
    },
    password: {
      type: String,
      required: [true, 'Password cannot be blank']
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('adminUser', adminUserSchema);