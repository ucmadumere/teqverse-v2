const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');
const validatePassword = require('../../validators/passwordValidator');

   


    // const PasswordHasher = ('@fntools/password');
    // const saltRounds = new PasswordHasher(10);


    const userSchema = mongoose.Schema(
    {
        first_name: {
        type: String,
        required: [true, 'Name Field cannot be blank']
        },
        
        last_name: {
            type: String,
            required: [true, 'Name Field cannot be blank']
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
        default: ''
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
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

  
    // for comparing password
    // userSchema.statics.login = async function(email, password){
    //     const user = await this.findOne({email});

    //     if (user) {
    //         const auth = await bcrypt.compare(password, user.password)

    //         if (auth) {
    //             return user
    //         }
    //         throw Error("incorrect Password")
    //     }
    //     throw Error("Sorry, the user does not exist..")
    // }


     const User = mongoose.model('User', userSchema);

    module.exports = User;