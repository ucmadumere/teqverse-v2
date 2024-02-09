const User = require('../models/userModel')
const jwt = require('jsonwebtoken');




const updateUser = async (req, res, next) => {
    const { other_name, interest } = req.body;
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

        // Check if interest is a string or an array of strings
        let updatedInterest = '';
        if (Array.isArray(interest)) {
            // If interest is an array, join its elements into a single string
            updatedInterest = interest.join(', ');
        } else {
            // If interest is already a string, use it as is
            updatedInterest = interest;
        }

        // Update the user using the findByIdAndUpdate method
        const updatedUser = await User.findByIdAndUpdate(userId, {
            other_name: other_name,
            interest: updatedInterest
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




// const updateUser = async (req, res, next) => {
//     const { other_name, interest } = req.body;
//     const token = req.cookies.token;

//     if (!token) {
//         // If the token is missing, the user is not authenticated
//         // You may want to handle this case based on your application's requirements
//         res.status(401).send("Authentication required");
//         return;
//     }

//     try {
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//         const { userId } = decodedToken;

//         // Update the user using the findByIdAndUpdate method
//         const updatedUser = await User.findByIdAndUpdate(userId, {
//             other_name: other_name,
//             interest: interest
//         }, { new: true }); // Set { new: true } to return the updated user

//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.redirect('update-profile?success= User Details Updated Successfully...')
//     } catch (error) {
//         // Handle JWT verification errors or other internal server errors
//         res.status(500).json({ message: 'Internal server error', error });
//     }
// };






module.exports = updateUser;