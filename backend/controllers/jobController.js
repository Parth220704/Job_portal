import Job from "../models/Job.js";
import Company from "../models/Company.js";
import Skill from "../models/Skills.js";
import JobSeekerProfile from "../models/JobSeeker.js";


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

    const { title, skill, location } = req.query;

    let filter = { status: "active" };

    // filter by job title
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // filter by skill
    if (skill) {
      filter.requiredSkills = { $in: [skill] };
    }

    // filter by location
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const jobs = await Job.find(filter)
      .populate("companyId", "companyName location")
      .sort({ createdAt: -1 });

    res.json({
      count: jobs.length,
      data: jobs
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message
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

    // Get logged in user profile
    const profile = await JobSeekerProfile.findOne({
      userId: req.user?._id
    });

    const userSkills = profile?.skills || [];
    const requiredSkills = job.requiredSkills || [];

    // normalize function
    const normalize = (skill) =>
      skill.toString().trim().toLowerCase();

    // convert user skills into normalized set
    const userSkillSet = new Set(userSkills.map(normalize));

    // matched skills
    const matchedSkills = requiredSkills.filter(skill =>
      userSkillSet.has(normalize(skill))
    );

    // missing skills
    const missingSkills = requiredSkills.filter(skill =>
      !userSkillSet.has(normalize(skill))
    );

    // learning resources from Skill collection
    const resources = await Skill.find({
      name: { $in: missingSkills }
    });

    // percentage calculation
    const matchPercentage =
      requiredSkills.length === 0
        ? 0
        : Math.round((matchedSkills.length / requiredSkills.length) * 100);

    res.json({
      job,
      matchedSkills,
      missingSkills,
      resources,
      matchPercentage,
      profile
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message
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
