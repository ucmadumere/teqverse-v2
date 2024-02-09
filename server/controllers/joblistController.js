const Postjob = require('../models/postJob');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const joblist = async (req, res) => {
  try {
    const locals = {
      title: 'TeqVerse - Job List',
      description: 'Job List',
    };

    const page = parseInt(req.query.page) || 1;
    const pageSize = 5; // Number of items per page
    let query = {};

    // Check if a search term is provided in the query parameters
    const searchTerm = req.query.q;
    if (searchTerm) {
      // Use a case-insensitive regex to match the search term in title or body
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { body: { $regex: searchTerm, $options: 'i' } },
        ],
      };
    }

    if (req.query.jobLocation) {
      query.jobLocation = { $regex: req.query.jobLocation, $options: 'i' };
    }

    // Filter by experience
    if (req.query.experience) {
      query.experience = { $gte: parseInt(req.query.experience) };
    }

    // Filter by work type
    if (req.query.workType) {
      query.workType = req.query.workType;
    }

    // Filter by job type
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    const totalJobs = await Postjob.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / pageSize);

    const jobs = await Postjob.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

      // Get user's interest
      const userId = req.cookies.token ? jwt.verify(req.cookies.token, process.env.JWT_SECRET).userId : null;
      const userInterestResponse = await User.findById(userId).select('interest').exec();
      const userInterest = userInterestResponse ? userInterestResponse.interest : [];
      const allJobs = await Postjob.find().exec();
      const allJobsSkills = await Postjob.find().select('skills').exec();
      var userinterestnew= userInterest.split(",");
      userinterestnew= userinterestnew.map(el => el.trim());
      userinterestnew= userinterestnew.map(el => el.toLowerCase());
  console.log(userinterestnew)
  
  
  var recommendedJobs=[];
  userinterestnew.map(item=>{
  let allfound=allJobs.filter(element=>element.skills.includes(item.trim()));
  recommendedJobs=[...recommendedJobs,...allfound];
  
  })
  recommendedJobs = recommendedJobs.filter((recommendedJobs, index, self) => index === self.findIndex(i => i.title === recommendedJobs.title));

    res.render('jobList', {
      data: jobs,
      locals,
      page,
      totalPages,
      searchTerm,
      jobLocation: req.query.jobLocation,
      experience: req.query.experience,
      workType: req.query.workType,
      jobType: req.query.jobType,
      jobCategory: req.body.jobCategory,
      recommendedJobs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = joblist;
