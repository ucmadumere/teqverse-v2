const User = require('../models/userModel');
const nodemailer = require('nodemailer');

const sendJobList = async (user, jobs) => {
  const jobList = jobs.map(job => `- ${job.title} (${job.company})`).join('\n');

  const message = `Here are some job listings that match your interests:\n\n${jobList}`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST2,
      port: process.env.SMTP_PORT2,
      auth: {
        user: process.env.SMTP_USERNAME2,
        pass: process.env.SMTP_PASSWORD2,
      },
    });

    const emailOptions = {
      from: '<notifications@teqverse.com.ng>',
      to: user.email,
      subject: 'Job listings based on your interests',
      text: message,
    };

    await transporter.sendMail(emailOptions);

    console.log('Job list sent to user email');
  } catch (error) {
    console.error('Error sending job list to user email:', error);
  }
};



const subscribeToJobs = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user record with subscribe set to true
      user = await User.create({ email, subscribed: true });
    } else if (!user.subscribed) {
      // Update the user's subscription status to true
      user.subscribed = true;
      await user.save();
    } else {
      // User is already subscribed
      return res.status(400).json({ message: 'Email is already subscribed.' });
    }

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST2,
      port: process.env.SMTP_PORT2,
      auth: {
        user: process.env.SMTP_USERNAME2,
        pass: process.env.SMTP_PASSWORD2,
      },
    });

    const emailOptions = {
      from: '<notifications@teqverse.com.ng>',
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

