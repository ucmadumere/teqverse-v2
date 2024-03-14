const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {isEmail} = require('validator');
// const { Country, State, City } = require('country-state-city');
const validatePassword = require('../../validators/passwordValidator');
const addressSchema = require('./addressSchema');




// const PasswordHasher = ('@fntools/password');
// const saltRounds = new PasswordHasher(10);


const userSchema = mongoose.Schema(
    {
        address: {
            type: addressSchema,
            required: false
        },

        first_name: {
            type: String,
            required: [true, 'Name Field cannot be blank']
        },

        last_name: {
            type: String,
            required: [true, 'Name Field cannot be blank']
        },

        other_name: {
            type: String,
        },

        date_of_birth:{
            type: Date,
        },

        email: {
            type: String,
            required: [true, 'Email Field cannot be blank'],
            unique: true,
            lowercase: true,
            validate: [isEmail, 'Please Enter a Valid Email']
        },

        profileimage: {
            type: String,
            default: 'avatar.jpg'
        },

        cv: {
            type: String,
            default: 'cv.pdf'
          },

        interest: {
            type: [String],
            default: [],
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
        },

        phone: {
            type: String,
        },

        country: {
            type: String,
            enum: ['Nigeria'],
        },
        city: {
            type: String,
        },
        state: {
            type: String,    
        },
        verified: { 
            type: Boolean, 
            default: false 
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        userCategory: {
            type: String,
            enum: ['Regular', 'Premium'],
            default: 'Regular'
        },
        subscribed: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: [true, 'Password cannot be blank'],
            validate: {
                validator: validatePassword,
                message: 'Password must contain at Least one of (A-Z, a-z, (!@#$-_%^&*) and must be at least 8)...',
            }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpires: Date
    },
    {
        timestamps: true,
    }
);


userSchema.pre('save', async function (next) {
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

userSchema.methods.createResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetToken = hashedToken;
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}



const User = mongoose.model('User', userSchema);

module.exports = User;

