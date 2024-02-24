const User = require('../models/userModel');
const Postjob = require('../models/postJob');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const jwt = require('jsonwebtoken')
const getJobListingsTemplate = require('../utils/jobListEmailTemplate');
const subscribedTemplate = require('../utils/subscribedTemplate');




const subscribeToJobs = async (req, res) => {
  try {
    const { email, interests } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ email, subscribed: true, interests });
    } else if (!user.subscribed) {
      user.subscribed = true;
      user.interests = interests;
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

    const unsubscribeUrl = `${req.protocol}://${req.get('host')}/unsubscribe`;
    const subscribeTemplate = subscribedTemplate(user?.first_name, user?.last_name, unsubscribeUrl);
    
    const emailOptions = {
      from: '<notifications@teqverse.com.ng>',
      to: email,
      subject: 'Subscription Confirmation',
      html: subscribeTemplate,
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

    
    const emailTemplate = getJobListingsTemplate(user?.first_name, jobs);

    const emailOptions = {
      from: '<notifications@teqverse.com.ng>',
      to: user.email,
      subject: 'Recommended Jobs',
      html: emailTemplate
    };

    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.error('Error sending job list:', error);
  }
};


const sendJobListings = async () => {
  try {
    const subscribedUsers = await User.find({ subscribed: true });

    for (const user of subscribedUsers) {
      const jobs = await fetchJobs(user);
      if (jobs.length <= 4) {
        console.log(`Avalible jobs not Upto Five(5), Can not send bellow 5 jobs to a user email: ${user.email}`);
        continue;
      }

     // Check if the jobs have been sent before
    if (user.sentJobs && jobs.every(job => user.sentJobs.includes(String(job._id)))) {
      console.log(`No new jobs for user: ${user.email}`);
      continue;
    }


      await sendJobList(user, jobs);

      // Update the sentJobs field for the user
      user.sentJobs = jobs.map(job => job._id);
      await user.save();

    }

  } catch (error) {
    console.error('Error sending job listings:', error);
  }
};


// Schedule job to run every day at a specific time (e.g., 12:00 PM)
cron.schedule('9 00 * * *', sendJobListings);

// UNSUBSCRIBE FUNCTION
const unsubscribeToJobs = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is already unsubscribed
    if (!user.subscribed) {
      return res.status(200).json({ message: 'User is already unsubscribed.' });
    }

    // Update the subscribed field to false
    user.subscribed = false;
    await user.save();

    res.status(200).json({ message: 'Successfully unsubscribed.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = {
  unsubscribeToJobs,
  subscribeToJobs,
  sendJobList,
};
