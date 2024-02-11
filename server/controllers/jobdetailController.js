const Postjob = require('../models/postJob');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Define the jobdetail function
const jobdetail = async (req, res) => {
  try {
    const locals = {
      title: "TeqVerse - Job Detail",
      description: "Job Detail"
    };

    const jobId = req.params.id;
    const data = await Postjob.findById({ _id: jobId });
    const job = await Postjob.findById(jobId).exec();

 // Get user's interest
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
     $in: userInterests
   }
 }).collation({ locale: 'en', strength: 2 }).exec(); // Use collation for case-insensitive match


    res.render('jobdetails', {
      locals,
      data,
      job,
      recommendedJobs,
      currentRoute: `/jobdetails/${jobId}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = jobdetail;



// if (Array.isArray(userInterest) && userInterest.length > 0) {
//   allJobs.map(item => {
//     let allfound = allJobs.filter(element => element.allJobs && element.allJobs.includes(item));
//     recommendedJobs = [...recommendedJobs, ...allfound];
//   });

//   recommendedJobs = recommendedJobs.filter((recommendedJobs, index, self) => index === self.findIndex(i => i.title === recommendedJobs.title));
// }