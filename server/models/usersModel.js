const mongoose = require('mongoose');
// const PasswordHasher = ('@fntools/password');
// const password = new PassordHasher(10);

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Firstname cannot be blank']
    },
    lastname: {
        type: String,
        required: [true, 'Lastname cannot be blank']
      },
    email: {
      type: String,
      required: true,
      unique: true,
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
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Encrypt password using bcrypt
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

module.exports = mongoose.model('User', userSchema);