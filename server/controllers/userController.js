const User = require('../models/userModel')
const jwt = require('jsonwebtoken');







const updateUser = async (req, res, next) => {
    const { other_name,gender, phone,date_of_birth, interest, city, state, country} = req.body;
    const token = req.cookies.token;

    if (!token) {
        // If the token is missing, the user is not authenticated
        // You may want to handle this case based on your application's requirements
        res.status(401).send("Authentication required");
        return;
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decodedToken;

        // Ensure interest is always an array of strings
        const updatedInterest = interest.split(',').map(interest => interest.trim());

        // Update the user using the findByIdAndUpdate method
        const updatedUser = await User.findByIdAndUpdate(userId, {
            other_name: other_name,
            interest: updatedInterest,
            gender, 
            phone,
            date_of_birth,
            city: city,
            state: state,
            country: country
        }, { new: true }); // Set { new: true } to return the updated user

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.redirect('update-profile?success= User Details Updated Successfully...')
    } catch (error) {
        // Handle JWT verification errors or other internal server errors
        res.status(500).json({ message: 'Internal server error', error });
    }
};




module.exports = updateUser;