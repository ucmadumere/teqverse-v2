const premiumJob = require('../models/premiumJobApplication')
const adminLayout = "../views/layouts/adminLogin";


const getUpdateStatusForm = async (req, res) => {
    try {
      const jobId = req.params.id;
      console.log("Received jobId:", jobId);

  
      // Find the job application by ID
      const jobApplication = await premiumJob.findById(jobId);
  
      if (!jobApplication) {
        return res.status(404).json({ message: "Job application not found" });
      }
  
      res.render('admin/updateJobStatus', { jobApplication });
    } catch (error) {
      console.error("Error rendering form:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  

  



const updateStatus = async (req, res) => {
    try {
      const jobId = req.params.id;
      const newStatus = req.body.status; // Get the new status from the form
  
      // Find the job application by ID
      const jobApplication = await premiumJob.findById(jobId);
  
      if (!jobApplication) {
        return res.redirect('/all-application?failure=Job Application not Found..');
      }
  
      // Update the status of the job application
      jobApplication.applicationsStatus.push({
        status: newStatus,
        date: new Date(),
      });
  
      // Save the updated job application
      await jobApplication.save();
  
      return res.redirect('/all-application?success=Job Status has been Updated Successfully..');
    } catch (error) {
      console.error("Error updating status:", error);
      return res.redirect('/all-application?failure=Internal Server Error..');
    }
  };



const viewAllAppliedJobs = async (req, res) => {
    try {
        // Find all job applications and populate the 'user' and 'job' fields
        const jobApplications = await premiumJob.find().populate('user', 'first_name other_name last_name').populate('job', 'title');
        
        // Render the EJS template with the list of job applications
        res.render('admin/allappliedjobs', { jobApplications: jobApplications, layout: adminLayout });
    } catch (error) {
        console.error("Error retrieving job applications:", error);
        return res.status(500).send("Internal server error");
    }
};




  
  module.exports = {
    getUpdateStatusForm,
    updateStatus,
    viewAllAppliedJobs,
  };