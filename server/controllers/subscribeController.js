const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const jwt = require('jsonwebtoken')
Postjob = require('../models/postJob')




const subscribeToJobs = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, subscribed: true });
    } else if (!user.subscribed) {
      user.subscribed = true;
      await user.save();
    } else {
      return res.status(400).json({ message: 'Email is already subscribed.' });
    }

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



const fetchJobs = async (user) => {
  try {
    // Fetch user interests
    let userInterest = user.interest


    // Split user interests and convert to lowercase
    if (Array.isArray(userInterest)) {
      userInterest = userInterest.join(' ');
    }
    const userInterests = userInterest.split(' ').map(interest => interest.trim().toLowerCase());

    // Find recommended jobs
    const recommendedJobs = await Postjob.find({
      skills: {
        $elemMatch: {
          $in: userInterests
        }
      }
    }).collation({ locale: 'en', strength: 2 }).exec();

    return recommendedJobs;
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


const sendJobList = async (user, jobs) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST2,
      port: process.env.SMTP_PORT2,
      auth: {
        user: process.env.SMTP_USERNAME2,
        pass: process.env.SMTP_PASSWORD2,
      },
    });

    let jobList = '';
    for (const job of jobs) {
      jobList += `${job.title} - ${job.description}\n`;
    }

    const emailOptions = {
      from: '<notifications@teqverse.com.ng>',
      to: user.email,
      subject: 'Recommended Jobs',
      text: `Here are some jobs you might be interested in:\n${jobList}`,
    };

    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.error('Error sending job list:', error);
  }
};


const sendJobListings = async () => {
  try {
    const subscribedUsers = await User.find({ subscribed: true });
    console.log(subscribedUsers)

    for (const user of subscribedUsers) {
      const jobs = await fetchJobs(user);
      await sendJobList(user, jobs);
      console.log(user, jobs)
    }

    console.log('Job listings sent to subscribed users.');
  } catch (error) {
    console.error('Error sending job listings:', error);
  }
};

// Schedule job to run every day at a specific time (e.g., 12:00 PM)
cron.schedule('15 16 * * *', sendJobListings);

module.exports = {
  subscribeToJobs,
  sendJobList,
};
