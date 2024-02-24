const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Postjob = require('../models/postJob');

const recommendedJoblist = async (req, res) => {

    try {
      const locals = {
        title: 'TeqVerse - Recommended Jobs',
        description: 'Recommended Job List',
      };
      const userId = req.cookies.token ? jwt.verify(req.cookies.token, process.env.JWT_SECRET).userId : null;
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
  
      res.render('all-recommended-jobs', {
        locals,
        recommendedJobs
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }

  module.exports = recommendedJoblist;