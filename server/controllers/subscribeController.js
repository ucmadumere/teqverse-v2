const User = require('../models/userModel');
const Postjob = require('../models/postJob');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const jwt = require('jsonwebtoken');

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

const fetchJobs = async (req, user) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const userInterestResponse = await User.findById(userId).select('interest').exec();
    let userInterest = userInterestResponse ? userInterestResponse.interest : [];

    if (Array.isArray(userInterest)) {
      userInterest = userInterest.join(' ');
    }
    const userInterests = userInterest.split(' ').map(interest => interest.trim().toLowerCase());

    const recommendedJobs = await Postjob.find({
      skills: {
        $elemMatch: {
          $in: userInterests,
        },
      },
    }).collation({ locale: 'en', strength: 2 }).exec();

    return recommendedJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
};

const sendJobListings = async (req) => {
  try {
    const subscribedUsers = await User.find({ subscribed: true });

    for (const user of subscribedUsers) {
      const jobs = await fetchJobs(req, user);
      await sendJobList(user, jobs);
      console.log(user, jobs);
    }

    console.log('Job listings sent to subscribed users.');
  } catch (error) {
    console.error('Error sending job listings:', error);
  }
};

// Schedule job to run every day at a specific time (e.g., 12:00 PM)
cron.schedule('* * * * *', () => sendJobListings(req));

module.exports = {
  subscribeToJobs,
};
