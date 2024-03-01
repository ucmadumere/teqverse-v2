const premiumJob = require('../models/premiumJobApplication')



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
        return res.status(404).json({ message: "Job application not found" });
      }
  
      // Update the status of the job application
      jobApplication.applicationsStatus.push({
        status: newStatus,
        date: new Date(),
      });
  
      // Save the updated job application
      await jobApplication.save();
  
      res.status(200).json({ message: "Job application status updated successfully" });
    } catch (error) {
      console.error("Error updating status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  const viewApplicationStatus = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        // Find the job application by ID
        const jobApplication = await premiumJob.findById(jobId);
        
        if (!jobApplication) {
            return res.status(404).json({ message: "Job application not found" });
        }
        
        // Get the current status of the job application
        const currentStatus = jobApplication.applicationsStatus[jobApplication.applicationsStatus.length - 1];
        
        res.status(200).json({ message: "Job application status retrieved successfully", status: currentStatus });
    } catch (error) {
        console.error("Error retrieving status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
  
  module.exports = {
    getUpdateStatusForm,
    updateStatus,
    viewApplicationStatus,
  };