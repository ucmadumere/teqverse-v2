// const User = require('../models/userModel');
// const nodemailer = require('nodemailer');

// const sendJobList = async (user, jobs) => {
//   const jobList = jobs.map(job => `- ${job.title} (${job.company})`).join('\n');

//   const message = `Here are some job listings that match your interests:\n\n${jobList}`;

//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       auth: {
//         user: process.env.SMTP_USERNAME,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });

//     const emailOptions = {
//       from: 'Teqverse support <noreply@teqverse.com.ng>',
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

//     // Check if the email is already subscribed (case-insensitive)
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       return res.status(400).json({ message: 'Email is already subscribed.' });
//     }

//     // Create a new user record (you might want to customize this based on your User model)
//     await User.create({ email });

//     // Send confirmation email
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       auth: {
//         user: process.env.SMTP_USERNAME,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });

//     const emailOptions = {
//       from: 'Teqverse support <noreply@teqverse.com.ng>',
//       to: email,
//       subject: 'Subscription Confirmation',
//       text: 'Thank you for subscribing to the latest jobs at TeqVerse.',
//     };

//     await transporter.sendMail(emailOptions);

//     // Assuming `jobs` is an array of job objects
//     // You should fetch relevant jobs based on user's interests or other criteria
//     const jobs = await fetchJobs(user);

//     // Send the list of jobs to the user
//     await sendJobList(user, jobs);

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

    // Check if the user exists (case-insensitive)
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user record
      user = await User.create({ email });
    } else if (user.subscribe) {
      return res.status(400).json({ message: 'Email is already subscribed.' });
    }

    // Update the user's subscription status
    user.subscribe = true;
    await user.save();

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

    // Assuming `jobs` is an array of job objects
    // You should fetch relevant jobs based on user's interests or other criteria
    // const jobs = await fetchJobs(user);

    // Send the list of jobs to the user
    // await sendJobList(user, jobs);

    res.status(200).json({ message: 'Successfully subscribed to latest jobs.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  subscribeToJobs,
};
