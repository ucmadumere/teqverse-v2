const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Review = require('../models/review');
const adminLayout = '../views/layouts/adminLogin';
// GET

const getUserReview = async (req, res) => {
    try {
        // Retrieve the JWT token from the request cookies
        const token = req.cookies.token;

        if (!token) {
            // If the token is missing, the user is not authenticated
            res.status(401).send('Authentication required');
            return;
        }

        // Verify the JWT token to extract user details
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        const user = await User.findById(userId).exec();
        if (!user) {
            // Handle case where user is not found
            res.status(404).send('User not found');
            return;
        }

        // Fetch reviews made by the logged-in user
        const reviews = await Review.find({ user: userId }).sort({ createdAt: -1 });
        res.render('user-review', { layout: adminLayout, reviews });
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).send('Failed to fetch user reviews: ' + error.message);
    }

}

// POST
const postUserReview = async (req, res) => {
    try {
        const token = req.cookies.token; // Assuming the JWT token is stored in a cookie
        if (!token) {
            // Handle case where token is missing
            res.status(401).send('Authentication required');
            return;
        }

        // Verify the JWT token to extract user details
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decodedToken;

        // Assuming you have a way to retrieve user details from the database
        // You can use the userId to fetch the user's details from the database
        // Replace this with your actual code to retrieve user details
        const user = await User.findById(userId).exec();
        

        if (!user) {
            // Handle case where user is not found
            res.status(404).send('User not found');
            return;
        }

        // Check if the user has already submitted a review
        const existingReview = await Review.findOne({ user: userId });

        if (existingReview) {
            // User has already submitted a review
            res.redirect('user-review?failure=This User Has Already Created a Review')
            return;
        }
        // If not, proceed to create a new review
        const { title, techSpecialty, rating, comment } = req.body;


        let fullName = user.first_name;
        if (user.other_names) {
            fullName += ` ${user.other_names}`;
        }
        fullName += ` ${user.last_name}`;

        const newReview = new Review({
            user: user._id, // Assuming user._id is the correct field for the user's ID
            fullName,
            email: user.email, // Use the user's email
            title,
            techSpecialty,
            rating,
            comment,
        });

        await newReview.save();

        // Redirect to the user-review page or display a success message
        res.redirect('user-review?success=Review Ctreated Successfully')
    } catch (error) {
        // Handle errors
        console.error('Error creating review:', error);
        res.status(500).send('Failed to create review: ' + error.message);
    }
}



module.exports = {
    getUserReview,
    postUserReview
};