const Postjob = require('../models/postJob');




// Define the jobdetail function
const jobdetail = async (req, res) => {
  try {
    const locals = {
      title: "TeqVerse",
      description: "Job Detail"
    };

    let slug = req.params.id;

    const data = await Postjob.findById({_id: slug});

    res.render('jobdetails', {
      locals,
      data,
      currentRoute: `/jobdetails/${slug}`
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = jobdetail;