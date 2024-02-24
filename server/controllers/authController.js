const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { createJWT } = require('../utils/tokenUtils');
const userLayout = '../views/layouts/userLogin';
const crypto = require('crypto');
const sendEmail = require('../utils/email');
const getResetPasswordTemplate = require('../utils/emailTemplate');
const nodemailer = require('nodemailer')
const getEmailVerificationTemplate = require('../utils/getEmailVerification')



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

    // Check if the user is verified
    if (!user.verified) {
      return res.redirect('login?failure=Your account has not been verified. Please check your email for a verification link');
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
    res.redirect('login?failure=Something Went Wrong, Please Check Your details and Try Again');
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

    // Create a verification token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Send verification email
    const transporter = nodemailer.createTransport({ 
      host: process.env.SMTP_HOST2,
      port: process.env.SMTP_PORT2,
      auth: {
        user: process.env.SMTP_USERNAME2,
        pass: process.env.SMTP_PASSWORD2,
      },
    });

    const emailContent = getEmailVerificationTemplate(first_name, token, req);

    const mailOptions = {
      from: '<notifications@teqverse.com.ng>',
      to: email,
      subject: 'Please verify your email',
      html: emailContent
    };
    await transporter.sendMail(mailOptions);

  
      res.redirect('login?success=You have been successfully Registered. Please Check your email to Verify Your Account So You can Login');
    } catch (error) {
      console.log(error)
      res.redirect('login?failure=Something Went Wrong, Please Check Your details and Try Again');

    }
  };


const logout = (req, res) => {
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        // domain: 'localhost',
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
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
  // const message = `We have received a password reset request. Please use the link below to reset your password\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes`
  const message = getResetPasswordTemplate(user?.first_name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password change request received',
      message: message
    });

    res.redirect('forgot-password?success=Password Reset Link Sent to User Mail, Please Check Your Email');
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({validateBeforeSave: false});

    res.redirect('forgot-password?failure=There was an error sending password reset email. Please try again later');
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
    res.redirect('/login?success=Your Password Has been Reset successfully..');
  
  } catch (error) {
    next(error);
  }
};

/**--------------------------------------------------------------------------------------------------- **/
/**                                           UPDATE PASSWORD                                          **/
/**--------------------------------------------------------------------------------------------------- **/

// const updatePassword = async (req, res, next) => {
//   // GET CURRENT USER DATA FROM DATABASE
// }

/**--------------------------------------------------------------------------------------------------- **/
/**                                        VERIFICATION TOKEN                                          **/
/**--------------------------------------------------------------------------------------------------- **/

const verifyToken = async (req, res) => {
try {
  const { token } = req.query;

  // Verify the token
  const { userId } = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user by ID and update the verified field
  const user = await User.findById(userId);
  user.verified = true;
  await user.save();

  // Redirect to the login page
  res.redirect('login?success=Your email has been verified. You can now log in.');
} catch (error) {
  res.redirect('login?failure=Invalid or expired verification link.');
};
};


module.exports = {
    login,
    register,
    logout,
    forgotPassword,
    passwordReset,
    verifyToken,
}