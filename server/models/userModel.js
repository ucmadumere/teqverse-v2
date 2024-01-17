    const mongoose = require('mongoose');
    const bcrypt = require('bcrypt');
    const validateEmail = require('../../validators/emailValidator')
    const validatePassword = require('../../validators/passwordValidator')


    // const PasswordHasher = ('@fntools/password');
    // const saltRounds = new PasswordHasher(10);


    const userSchema = mongoose.Schema(
    {
        name: {
        type: String,
        required: [true, 'Firstname cannot be blank']
        },

        email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator:validateEmail,
            message: 'Invalid Email Format, Please check and try Again...',
        }
        },
        password: {
        type: String,
        required: [true, 'Password cannot be blank'],
        validate: {
            validator:validatePassword,
            message: 'Password must contain at Least one of (A-Z, a-z, (!@#$-_%^&*) and must be at least 8)...',
        }
        },
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


    

    module.exports = mongoose.model('User', userSchema);