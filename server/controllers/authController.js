const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const userLayout = '../views/layouts/userLogin';



/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN IN                                              **/
/**--------------------------------------------------------------------------------------------------- **/

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).render( 'error400', { 
        errorCode: 400,
        errorMessage: 'Invalid Password',
        errorDescription: 'Sorry, Email or Password is Incorrect....',
        layout: userLayout,

    });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).render( 'error400', { 
          errorCode: 400,
          errorMessage: 'Invalid Password',
          errorDescription: 'Sorry, Email or Password is Incorrect....',
          layout: userLayout,
      });
    }


    const accessToken = jwt.sign(
      { userId: user._id}, 
      process.env.JWT_SECRET,
      { expiresIn: 2 * 60 * 1000 });

    // Set the token in a cookie
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      maxAge: 2 * 60 * 1000, // 20 hours in milliseconds
      secure: true, // Set to true if using HTTPS
      sameSite: 'None'
    });

    // Redirect to a dashboard or user profile page
    res.redirect('/');

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
      const { name, email, password, password2} = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).render('error400', {
            errorCode: 400, 
            errorMessage: 'Existing User',
            errorDescription: 'Sorry, A User with the entered email already exists. Please log in.',
            layout: userLayout,
        });
      };

      if (password !== password2) {
        return res.status(400).render('error400', {
            errorCode: 400,
            errorMessage: 'Password Missmatch...',
            errorDescription: 'Sorry, Password did not match...',
            layout: userLayout,
        });
      };
  
      const newUser = new User({
        name,
        email,
        password,
      });
  
      await newUser.save();
  
      res.redirect('/login');
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
  res.clearCookie('jwt', {
    path: '/',
    httpOnly: true,
    secure: false, // Set to false for HTTP
  });
  res.redirect('/logout');
};

  

  
  
  


module.exports = {
    login,
    register,
    logout
}



