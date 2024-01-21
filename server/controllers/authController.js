const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');



/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN IN                                              **/
/**--------------------------------------------------------------------------------------------------- **/

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }

    // Validate the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const accessToken = jwt.sign(
      { userId: user._id,
        name: user.name,
        email: user.email,
        role: user.isAdmin,
        created: user.createdAt,
        updated: user.updatedAt
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' });

    req.session.token = accessToken;

    // Redirect to a dashboard or user profile page
    res.redirect('/');
    console.log(accessToken);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred during login' });
  }
};


/**--------------------------------------------------------------------------------------------------- **/
/**                                               SIGN UP                                              **/
/**--------------------------------------------------------------------------------------------------- **/

// Define the register route handler
const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).send('A user with the entered email already exists. Please log in.');
      }
  
      const newUser = new User({
        name,
        email,
        password,
      });
  
      await newUser.save();
  
      res.redirect('/login');
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  };


const logout = (req, res) => {
    res.clearCookie('token');
    //res.json({ message: 'Logout successful.'});
    // res.redirect('/');
    res.render('/login', {
        layout: adminLayout
    });
};


module.exports = {
    login,
    register,
    logout
}