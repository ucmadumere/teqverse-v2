const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const cron = require('node-cron');




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

// Schedule job to run every day at a specific time (e.g., 12:00 PM)
cron.schedule('0 0 12 * * *', async () => {
  try {
    // Fetch all subscribed users
    const subscribedUsers = await User.find({ subscribed: true });

    // Iterate through subscribed users
    for (const user of subscribedUsers) {
      // Assuming `fetchJobs` is a function that fetches relevant jobs based on user's interests
      const jobs = await fetchJobs(user);

      // Send the list of jobs to the user
      await sendJobList(user, jobs);

      console.log(user, jobs)
    }

    console.log('Job listings sent to subscribed users.');
  } catch (error) {
    console.error('Error sending job listings:', error);
  }
});



module.exports = {
  subscribeToJobs,
};
