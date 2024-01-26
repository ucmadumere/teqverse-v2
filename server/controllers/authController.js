const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');
const { createJWT } = require('../utils/tokenUtils');
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

    const token = createJWT({userId:user._id, role: user.role});
    const oneDay = 1000 * 60 * 60 *24

    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now()+oneDay),
      secure: process.env.NODE_ENV === 'environment',
      path: '/'
    })

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
      const { first_name, last_name, email, password, password2} = req.body;
  
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
        first_name, 
        last_name,
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
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
        domain: 'localhost',
        secure: process.env.NODE_ENV === 'production'
    });
    res.status(200).render('logout', {
      layout: userLayout,
    })
};

  

module.exports = {
    login,
    register,
    logout
}



