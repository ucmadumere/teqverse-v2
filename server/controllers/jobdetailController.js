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

    let slug = req.params.id;

    const jobId = req.params.id;
    const data = await Postjob.findById({ _id: slug });
    const job = await Postjob.findById(jobId).exec();

   // Get user's interest
   const userId = req.cookies.token ? jwt.verify(req.cookies.token, process.env.JWT_SECRET).userId : null;
   const user = await User.findById(userId).exec();

   let recommendedJobs = [];
   if (user && user.interest) {
     // If user has specified interest, find jobs matching those interests
     recommendedJobs = await Postjob.find({ jobCategory: { $in: user.interest } })
       .limit(3)  // Limit to 3 recommended jobs
       .sort({ createdAt: -1 });
   }

   // Additionally, find jobs based on job skills
   if (data && data.skills) {
     const matchingJobs = await Postjob.find({ skills: { $in: data.skills } })
       .limit(3)  // Limit to 3 matching jobs
       .sort({ createdAt: -1 });

     // Merge the two arrays of jobs (recommendedJobs and matchingJobs)
     recommendedJobs = [...recommendedJobs, ...matchingJobs];
   }


    res.render('jobdetails', {
      locals,
      data,
      job,
      recommendedJobs,
      currentRoute: `/jobdetails/${slug}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = jobdetail;