const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


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

// Match user entered password to hashed password in database
adminUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// // Encrypt password using bcrypt
adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('adminUser', adminUserSchema);