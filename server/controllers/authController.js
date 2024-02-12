const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { createJWT } = require('../utils/tokenUtils');
const userLayout = '../views/layouts/userLogin';
const crypto = require('crypto');



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
/**                                           RESET PASSWORD                                           **/
/**--------------------------------------------------------------------------------------------------- **/

const resetPassword = async (req, res) => {
    try {
        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Hash the reset token and set it to the user's resetToken field
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.redirect('reset-password?failure=No account with that email address exists.');
        }
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        // Send the reset token to the user's email
        // You can use a package like nodemailer to send the email
        // The email should contain a link to a page where the user can enter their new password
        // The link should include the reset token as a query parameter

        res.redirect('reset-password?success=An email has been sent to your email address with further instructions.');
    } catch (error) {
        console.error(error);
        res.status(500).render('error500', {
            errorCode: 500,
            errorMessage: 'Internal Server Error',
            errorDescription: 'The system encountered an error while trying to reset your password. Please try again.',
            layout: userLayout,
        });
    }
};

module.exports = {
    login,
    register,
    logout,
    resetPassword
}