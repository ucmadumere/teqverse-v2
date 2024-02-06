const Postjob = require('../models/postJob');




// Define the jobdetail function
const jobdetail = async (req, res) => {
  try {
    const locals = {
      title: "TeqVerse - Job Detail",
      description: "Job Detail"
    };

    let slug = req.params.id;

    const jobId = req.params.id; // Replace with your actual way of getting the job ID
    const data = await Postjob.findById({_id: slug});
    const job = await Postjob.findById(jobId).exec();
    

    res.render('jobdetails', {
      locals,
      data,
      job,
      currentRoute: `/jobdetails/${slug}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = jobdetail;