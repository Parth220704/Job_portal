import Job from "../models/Job.js";
import Company from "../models/Company.js";


// CREATE JOB
export const createJob = async (req, res) => {

  try {

    const recruiterId = req.user._id;

    // Check recruiter has company
    const company = await Company.findOne({ userId: recruiterId });

    if (!company) {

      return res.status(400).json({
        message: "Recruiter must create company first"
      });

    }

    const job = await Job.create({

      recruiterId,

      companyId: company._id,

      ...req.body

    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to create job",
      error: error.message
    });

  }

};



// GET ALL JOBS (Public)
export const getAllJobs = async (req, res) => {

  try {

    const jobs = await Job.find({ status: "active" })
      .populate("companyId", "companyName location")
      .sort({ createdAt: -1 });

    res.json(jobs);

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to fetch jobs"
    });

  }

};



// GET RECRUITER JOBS
export const getMyJobs = async (req, res) => {

  try {

    const recruiterId = req.user._id;

    const jobs = await Job.find({ recruiterId })
      .sort({ createdAt: -1 });

    res.json(jobs);

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to fetch recruiter jobs"
    });

  }

};



// GET SINGLE JOB
export const getJobById = async (req, res) => {

  try {

    const job = await Job.findById(req.params.id)
      .populate("companyId", "companyName location");

    if (!job) {

      return res.status(404).json({
        message: "Job not found"
      });

    }

    res.json(job);

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to fetch job"
    });

  }

};



// UPDATE JOB
export const updateJob = async (req, res) => {

  try {

    const recruiterId = req.user._id;

    const job = await Job.findOneAndUpdate(

      {
        _id: req.params.id,
        recruiterId
      },

      req.body,

      { new: true }

    );

    if (!job) {

      return res.status(404).json({
        message: "Job not found or unauthorized"
      });

    }

    res.json({
      message: "Job updated successfully",
      job
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to update job"
    });

  }

};



// DELETE JOB
export const deleteJob = async (req, res) => {

  try {

    const recruiterId = req.user._id;

    const job = await Job.findOneAndDelete({

      _id: req.params.id,

      recruiterId

    });

    if (!job) {

      return res.status(404).json({
        message: "Job not found or unauthorized"
      });

    }

    res.json({
      message: "Job deleted successfully"
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to delete job"
    });

  }

};
