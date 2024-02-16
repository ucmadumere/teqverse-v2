const User = require('../models/userModel');
const nodemailer = require('nodemailer');

const subscribeToJobs = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email is already subscribed (case-insensitive)
    const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already subscribed.' });
    }

    // Create a new user record (you might want to customize this based on your User model)
    await User.create({ email });

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const emailOptions = {
      from: '<noreply@teqverse.com.ng>',
      to: email,
      subject: 'Subscription Confirmation',
      text: 'Thank you for subscribing to the latest jobs at TeqVerse.',
    };

    await transporter.sendMail(emailOptions);

    res.status(200).json({ message: 'Successfully subscribed to latest jobs.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  subscribeToJobs,
};
