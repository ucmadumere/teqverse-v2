const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { createJWT } = require('../utils/tokenUtils');
const userLayout = '../views/layouts/userLogin';
const crypto = require('crypto');
const sendEmail = require('../utils/email');



/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN IN                                              **/
/**--------------------------------------------------------------------------------------------------- **/

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('login?failure=Incorrect Email or Password');

    };

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.redirect('login?failure=Incorrect Email or Password'); 
    }

    const token = createJWT({userId:user._id, role: user.role});
    const oneDay = 1000 * 60 * 60 *24

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now()+oneDay),
      secure: process.env.NODE_ENV === 'environment',
      path: '/'
    })

    res.redirect('/?success=logged in successfully');

  } catch (error) {
    console.error(error);
    res.status(500).render('error500', {
        errorCode: 400,
        errorMessage: "Internal Server Error",
        errorDescription: "The system encountered an error while trying to get the User. Please check your credentials and try again",
        layout: userLayout,

    }); //{ message: 'An error occurred during login' });
  }
};


/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN UP                                              **/
/**--------------------------------------------------------------------------------------------------- **/

// Define the register route handler
const register = async (req, res) => {
    try {
      const { first_name, last_name, email, password, password2} = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.redirect('login?failure= A User with this details already exists in the system. Please sign in')
      };

      if (password !== password2) {
        return res.redirect('signup?failure= Password Mismatch...')
      };
  
      const newUser = new User({
        first_name, 
        last_name,
        email,
        password,
      });
  
      await newUser.save();
  
      res.redirect('login?success=You have been successfully Registered');
    } catch (error) {
      console.error(error);
      res.status(500).render('error500', {
          errorCode: 500,
          errorMessage: 'Internal Server Error',
          errorDescription: 'The System Experienced Some Error while trying to Create your Account. Please Check you Details and try again...',
          layout: userLayout,
      });
    }
  };


const logout = (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        domain: 'localhost',
        secure: process.env.NODE_ENV === 'production'
    });
    res.redirect('/?success=logged Out successfully')

};
/**--------------------------------------------------------------------------------------------------- **/
/**                                           FORGOT PASSWORD                                           **/
/**--------------------------------------------------------------------------------------------------- **/
const forgotPassword = async (req, res, next) => {
  // GET USER BASED ON EMAIL
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    const error = new Error('We could not find the user with the given email');
    error.statusCode = 404;
    return next(error);
  }
  

  // GENERATE A RANDOM RESET TOKEN
  const resetToken =  user.createResetPasswordToken();

  await user.save({validateBeforeSave: false});

  // SEND THE TOKEN BACK TO THE USER EMAIL
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
  const message = `We have received a password reset request. Please use the link below to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password change request received',
      message: message
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset link sent to user email'
    })
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({validateBeforeSave: false});

    return next(error + 'There was an error sending password reset email. Please try again later', 500);
  }
  
};

/**--------------------------------------------------------------------------------------------------- **/
/**                                           RESET PASSWORD                                           **/
/**--------------------------------------------------------------------------------------------------- **/

const passwordReset = async (req, res, next) => {
  try {
    // IF THE USER EXISTS WITH TOKEN & TOKEN HAS NOT EXPIRED
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      const error = new Error('Token is invalid or has expired');
      error.statusCode = 400;
      throw error;
    }

    // RESETTING USER PASSWORD
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    // Send a response to the client
    res.status(200).json({
      status: 'success',
      message: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

/**--------------------------------------------------------------------------------------------------- **/
/**                                           UPDATE PASSWORD                                           **/
/**--------------------------------------------------------------------------------------------------- **/

// const updatePassword = async (req, res, next) => {
//   // GET CURRENT USER DATA FROM DATABASE
// }



module.exports = {
    login,
    register,
    logout,
    forgotPassword,
    passwordReset,
}