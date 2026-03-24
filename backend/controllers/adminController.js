import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";


// ================= DASHBOARD =================
export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const recruiters = await User.countDocuments({ role: "recruiter" });
    const jobseekers = await User.countDocuments({ role: "jobseeker" });
    const jobs = await Job.countDocuments();
    const applications = await Application.countDocuments();

    res.status(200).json({
      totalUsers,
      recruiters,
      jobseekers,
      jobs,
      applications
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard",
      error: error.message
    });
  }
};


// ================= RECRUITERS =================
export const getAllRecruiters = async (req, res) => {
  try {
    const recruiters = await User.find({ role: "recruiter" }).select("-password");

    res.status(200).json({
      count: recruiters.length,
      recruiters
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch recruiters",
      error: error.message
    });
  }
};

export const updateRecruiterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved / blocked

    const recruiter = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!recruiter) {
      return res.status(404).json({
        message: "Recruiter not found"
      });
    }

    res.status(200).json({
      message: "Recruiter status updated",
      recruiter
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update recruiter",
      error: error.message
    });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active / blocked

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Update user status
    user.status = status;
    await user.save();

    // 🔥 If recruiter → update company + jobs
    if (user.role === "recruiter") {
  try {
    await Company.updateMany(
      { userId: user._id },
      { status: status === "blocked" ? "inactive" : "active" }
    );

    await Job.updateMany(
      { recruiterId: user._id },
      { status: status === "blocked" ? "inactive" : "active" }
    );
  } catch (err) {
    console.error("Recruiter related update failed:", err.message);
  }
}

    res.status(200).json({
      message: "User and related data updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update user status",
      error: error.message
    });
  }
};


// ================= JOB SEEKERS =================
export const getAllJobSeekers = async (req, res) => {
  try {
    const jobseekers = await User.find({ role: "jobseeker" }).select("-password");

    res.status(200).json({
      count: jobseekers.length,
      jobseekers
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobseekers",
      error: error.message
    });
  }
};


// ================= JOBS =================
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName") // 🔥 important
      .lean(); // 🔥 required for spreading

    // 🔥 add applicant count
    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({
          jobId: job._id,
        });

        return {
          ...job,
          applicants: count,
        };
      })
    );

    res.status(200).json({
      count: jobsWithCount.length,
      jobs: jobsWithCount,
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

export const updateJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active / inactive / expired

    const job = await Job.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      });
    }

    res.status(200).json({
      message: "Job status updated",
      job
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update job status",
      error: error.message
    });
  }
};


// ================= APPLICATIONS =================
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: "jobId",
        select: "title companyId",
        populate: {
          path: "companyId",
          select: "companyName"
        }
      })
      .populate("jobSeekerId", "name email");

    res.status(200).json({
      count: applications.length,
      applications
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });
  }
};


export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .populate("userId", "name email status");

    res.status(200).json({
      count: companies.length,
      data: companies
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message
    });
  }
};

// ================= UPDATE COMPANY STATUS =================
export const updateCompanyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // active / inactive

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    // Update company status
    company.status = status;
    await company.save();

    // 🔥 Update all jobs of this company
    await Job.updateMany(
      { companyId: company._id },
      { status: status === "inactive" ? "inactive" : "active" }
    );

    res.status(200).json({
      message: "Company status updated successfully",
      data: company
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update company status",
      error: error.message
    });
  }
};