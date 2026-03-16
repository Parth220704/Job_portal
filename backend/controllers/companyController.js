import Company from "../models/Company.js";
import Job from "../models/Job.js";


// CREATE COMPANY
export const createCompany = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    // Check if recruiter already has company
    const existingCompany = await Company.findOne({ userId });
    if (existingCompany) {
      return res.status(400).json({
        message: "Recruiter already has a registered company"
      });

    }
    const company = await Company.create({
      userId,
      ...req.body
    });
    res.status(201).json({
      message: "Company created successfully",
      company
    });
  }
  catch (error) {

    res.status(500).json({
      message: "Failed to create company",
      error: error.message
    });
  }
};



// GET COMPANY OF LOGGED-IN RECRUITER
export const getMyCompany = async (req, res) => {

  try {

    const userId = req.user._id;

    const company = await Company.findOne({ userId });

    if (!company) {

      return res.status(404).json({
        message: "Company not found"
      });

    }

    res.json(company);

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to fetch company"
    });

  }

};



// UPDATE COMPANY
export const updateCompany = async (req, res) => {

  try {

    const userId = req.user._id;

    const company = await Company.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );

    if (!company) {

      return res.status(404).json({
        message: "Company not found"
      });

    }

    res.json({
      message: "Company updated",
      company
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Failed to update company"
    });

  }

};

export const getCompanyById = async (req, res) => {
  try {

    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found"
      });
    }

    res.status(200).json({
      message: "Company fetched successfully",
      data: company
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch company details",
      error: error.message
    });

  }
};

export const getCompanyJobs = async (req, res) => {
  try {
    const { id } = req.params;

    const jobs = await Job.find({
      companyId: id,
      status: "active"
    })
    .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Company jobs fetched successfully",
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch company jobs",
      error: error.message
    });
  }
};