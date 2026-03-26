import Application from "../models/Application.js";
import Job from "../models/Job.js";
import JobSeekerProfile from "../models/JobSeeker.js";
import { sendEmail } from "../utils/sendEmail.js";
import { scoreJobsForProfile } from "../services/matchingService.js";


/*
  Apply for a Job (Job Seeker)
*/
export const applyForJob = async (req, res) => {
  try {

    const { jobId } = req.body;
    const jobSeekerId = req.user._id;

    const profile = await JobSeekerProfile.findOne({
      userId: jobSeekerId
    })

    if (!profile || !profile.resumeUrl) {
      return res.status(400).json({
        message: "Please upload resume before applying"
      })
    }

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job"
      });
    }

    // Create application
    const [scoredJob] = await scoreJobsForProfile({
      profile,
      jobs: [job]
    });

    const application = await Application.create({
      jobId,
      jobSeekerId,
      recruiterId: job.recruiterId,
      matchPercentage: scoredJob?.matchPercentage || 0
    });

    res.status(201).json({
      message: "Application submitted successfully",
      data: application
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};



/*
  Get Applicants for a Specific Job (Recruiter)
*/

export const getApplicantsByJob = async (req, res) => {
  try {

    const { jobId } = req.params;

    const applications = await Application.find({ jobId })
      .populate("jobSeekerId", "name email");

    // attach profile info
    const result = await Promise.all(
      applications.map(async (app) => {

        const profile = await JobSeekerProfile.findOne({
          userId: app.jobSeekerId._id
        });

        return {
          ...app.toObject(),
          profile
        };

      })
    );

    res.json({
      count: result.length,
      data: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



/*
  Update Application Status (Shortlist / Reject)
*/
export const updateApplicationStatus = async (req, res) => {
  try {

    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findById(id)
      .populate("jobId", "title")
      .populate("jobSeekerId", "name email");

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    application.status = status;
    await application.save();

    // 🔥 Send Email
    const userEmail = application.jobSeekerId.email;
    const userName = application.jobSeekerId.name;
    const jobTitle = application.jobId.title;

    let message = "";

    if (status === "shortlisted") {
      message = `Hi ${userName},\n\nCongratulations! 🎉\nYou have been shortlisted for the position: ${jobTitle}.\n\nBest of luck!\nCareerBridge Team`;
    } else if (status === "rejected") {
      message = `Hi ${userName},\n\nWe regret to inform you that your application for ${jobTitle} was not selected.\n\nKeep trying, best wishes!\nCareerBridge Team`;
    }

    await sendEmail(
      userEmail,
      "Application Status Update",
      message
    );

    res.status(200).json({
      message: "Application status updated and email sent",
      data: application
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update application status"
    });
  }
};