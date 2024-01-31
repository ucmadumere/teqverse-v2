const Postjob = require('../models/postJob');




const joblist = async (req, res) => {
  try {
    const locals = {
      title: 'TeqVerse',
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
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = joblist;





























// const joblist = async (req, res) => {
//     try {
//       const locals = {
//         title: 'TeqVerse',
//         description: 'Job List',
//       };
  
//       const page = parseInt(req.query.page) || 1;
//       const pageSize = 5; // Number of items per page
//       let query = {};
  
//       // Check if a search term is provided in the query parameters
//       const searchTerm = req.query.q;
//       if (searchTerm) {
//         // Use a case-insensitive regex to match the search term in title or body
//         query = {
//           $or: [
//             { title: { $regex: searchTerm, $options: 'i' } },
//             { body: { $regex: searchTerm, $options: 'i' } },
//           ],
//         };
//       }
  
//       // Filter by location
//       if (req.query.location) {
//         query.jobLocation = req.query.location;
//       }
  
//       // Filter by experience
//       if (req.query.experience) {
//         query.experience = { $gte: parseInt(req.query.experience) };
//       }
  
//       // Filter by work type
//       if (req.query.workType) {
//         query.workType = req.query.workType;
//       }
  
//       // Filter by job type
//       if (req.query.jobType) {
//         query.jobType = req.query.jobType;
//       }
  
//       const totalJobs = await Postjob.countDocuments(query);
//       const totalPages = Math.ceil(totalJobs / pageSize);
  
//       const jobs = await Postjob.find(query)
//         .sort({ createdAt: -1 })
//         .skip((page - 1) * pageSize)
//         .limit(pageSize);
  
//       res.render('jobList', {
//         data: jobs,
//         locals,
//         page,
//         totalPages,
//         searchTerm,
//         location: req.query.location, // Pass location to template
//         experience: req.query.experience, // Pass experience to template
//         workType: req.query.workType, // Pass workType to template
//         jobType: req.query.jobType, // Pass jobType to template
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error');
//     }
//   });
  
//   // Filter reset
//   router.get('/resetfilters', (req, res) => {
//     // Redirect to the joblist route without any filter parameters
//     res.redirect('/joblist');
//   });
          
  
//   router.get('/jobdetails', (req, res) => {
//       res.render('jobdetails');
//   });

// }
