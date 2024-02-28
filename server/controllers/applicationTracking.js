const PremiumJob = require('./path/to/your/PremiumJobModel');



// Function to find job by ID
const findJobById = async (jobId) => {
  const job = await PremiumJob.findById(jobId);
  if (!job) throw new Error('Job not found');
  return job;
};

// Function to find application status for a user
const findApplicationStatus = (job, userId) => {
  const applicationStatus = job.applicationsStatus.find(
    (application) => String(application.user) === userId
  );
  if (!applicationStatus) throw new Error('User has not applied for this job');
  return applicationStatus;
};

// Function to update application status
const updateApplicationStatus = async (jobId, userId, newStatus) => {
  try {
    const job = await findJobById(jobId);
    const applicationStatus = findApplicationStatus(job, userId);
    applicationStatus.status = newStatus;
    await job.save();
    return 'Application status updated successfully';
  } catch (error) {
    console.error(error);
    return 'Failed to update application status';
  }
};