const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const jwt = require('jsonwebtoken')




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



const fetchJobs = async (req, res, user) => {
  // Fetch user interests
  const token = req.cookies.token;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userId = decoded.userId;
  console.log(userId)

  const userInterestResponse = await User.findById(userId).select('interest').exec();
  let userInterest = userInterestResponse ? userInterestResponse.interest : [];

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
  };


const sendJobListings = async () => {
  try {
    const subscribedUsers = await User.find({ subscribed: true });
    console.log(subscribedUsers)

    for (const user of subscribedUsers) {
      // Subscribe user to jobs and get their interests
      await subscribeToJobs({ body: { email: user.email, interests: user.interests } });

      // Get job listings based on user interests
      const { recommendedJobs } = await joblist(user);

      // Send job notifications to the user
      await sendJobList(user, recommendedJobs);
    }

    console.log('Job listings sent to subscribed users.');
  } catch (error) {
    console.error('Error sending job listings:', error);
  }
};


// Schedule job to run every day at a specific time (e.g., 12:00 PM)
cron.schedule('* * * * *', sendJobListings);

module.exports = {
  subscribeToJobs,
};