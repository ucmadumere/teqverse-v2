// const User = require('../models/userModel');
// const nodemailer = require('nodemailer');
// const sendJobEmail = require('../utils/latestJobNotification')

// const sendJobList = async (user, jobs) => {
//   const jobList = jobs.map(job => `- ${job.title} (${job.company})`).join('\n');

//   const message = `Here are some job listings that match your interests:\n\n${jobList}`;

//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST2,
//       port: process.env.SMTP_PORT2,
//       auth: {
//         user: process.env.SMTP_USERNAME2,
//         pass: process.env.SMTP_PASSWORD2,
//       },
//     });

//     const emailOptions = {
//       from: '<notifications@teqverse.com.ng>',
//       to: user.email,
//       subject: 'Job listings based on your interests',
//       text: message,
//     };

//     await transporter.sendMail(emailOptions);

//     console.log('Job list sent to user email');
//   } catch (error) {
//     console.error('Error sending job list to user email:', error);
//   }
// };



// const subscribeToJobs = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Find the user by email
//     let user = await User.findOne({ email });

//     if (!user) {
//       // Create a new user record with subscribe set to true
//       user = await User.create({ email, subscribed: true });
//     } else if (!user.subscribed) {
//       // Update the user's subscription status to true
//       user.subscribed = true;
//       await user.save();
//     } else {
//       // User is already subscribed
//       return res.status(400).json({ message: 'Email is already subscribed.' });
//     }

//     // Send confirmation email
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST2,
//       port: process.env.SMTP_PORT2,
//       auth: {
//         user: process.env.SMTP_USERNAME2,
//         pass: process.env.SMTP_PASSWORD2,
//       },
//     });

//     const emailOptions = {
//       from: '<notifications@teqverse.com.ng>',
//       to: email,
//       subject: 'Subscription Confirmation',
//       text: 'Thank you for subscribing to the latest jobs at TeqVerse.',
//     };

//     await transporter.sendMail(emailOptions);

//     res.status(200).json({ message: 'Successfully subscribed to latest jobs.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// module.exports = {
//   subscribeToJobs,
// };

const User = require('../models/userModel');
const Postjob = require('../models/postJob');
const nodemailer = require('nodemailer');
// const sendJobEmail = require('../utils/latestJobNotification');

const fetchJobsBasedOnInterests = async (userInterests, limit = 6) => {
  // Modify this function to fetch relevant jobs based on user interests
  // Limit the number of jobs fetched to the specified limit.
  // This is just a placeholder, replace it with your actual logic.

  // Sample implementation assuming 'Postjob' model has 'skills' field.
  return Postjob.find({
    skills: {
      $in: userInterests
    }
  })
    .collation({ locale: 'en', strength: 2 })
    .limit(limit) // Limit the number of jobs fetched
    .exec();
};

// const sendJobList = async (user) => {
//   try {
//     // Fetch user's interests
//     const userInterestResponse = await User.findById(user._id).select('interest').exec();
//     let userInterest = userInterestResponse ? userInterestResponse.interest : [];

//     // Split user interests and convert to lowercase
//     if (Array.isArray(userInterest)) {
//       userInterest = userInterest.join(' ');
//     }
//     const userInterests = userInterest.split(' ').map(interest => interest.trim().toLowerCase());

//     // Fetch relevant jobs based on user's interests (limit to 6 jobs)
//     const jobs = await fetchJobsBasedOnInterests(userInterests, 6);

//     // Limit the number of job notifications to send to the user
//     const maxJobNotifications = 6;
//     const jobsToSend = jobs.slice(0, maxJobNotifications);

//     // Send job email notification
//     await sendJobEmail(user, jobsToSend);

//     console.log(`Job list sent to user email. ${jobsToSend.length} jobs sent.`);
//   } catch (error) {
//     console.error('Error sending job list to user email:', error);
//   }
// };
const sendJobList = async (user) => {
  try {
    // Check if the user is subscribed
    if (!user.subscribed) {
      console.log('User is not subscribed. Skipping job notification.');
      return;
    }

    // Fetch user's interests
    const userInterestResponse = await User.findById(user._id).select('interest').exec();
    let userInterest = userInterestResponse ? userInterestResponse.interest : [];

    // Split user interests and convert to lowercase
    if (Array.isArray(userInterest)) {
      userInterest = userInterest.join(' ');
    }
    const userInterests = userInterest.split(' ').map(interest => interest.trim().toLowerCase());

    // Fetch relevant jobs based on user's interests
    const jobs = await fetchJobsBasedOnInterests(userInterests);

    // Limit the number of jobs to 6 or less
    const limitedJobs = jobs.slice(0, 6);

    // Send job email notification
    await sendJobEmail(user, limitedJobs);

    console.log('Job list sent to user email');
  } catch (error) {
    console.error('Error sending job list to user email:', error);
  }
};



const subscribeToJobs = async (req, res) => {
  try {
    const { email, interests } = req.body;

    // Find the user by email
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user record with subscribe set to true and save interests
      user = await User.create({ email, subscribed: true, interest: interests });
    } else if (!user.subscribed) {
      // Update the user's subscription status to true and save interests
      user.subscribed = true;
      user.interest = interests;
      await user.save();
    } else {
      // User is already subscribed, update interests if provided
      if (interests && interests.length > 0) {
        user.interest = interests;
        await user.save();
      }
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

    // Send job list based on interests
    await sendJobList(user);

    res.status(200).json({ message: 'Successfully subscribed to latest jobs.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  subscribeToJobs,
};
