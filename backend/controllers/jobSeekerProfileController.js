import JobSeekerProfile from "../models/JobSeeker.js";
import fs from "fs";
import Application from "../models/Application.js";


/*
CREATE PROFILE
*/
export const createProfile = async (req, res) => {
  try {

    const userId = req.user._id;

    const existing = await JobSeekerProfile.findOne({ userId });

    if (existing) {
      return res.status(400).json({
        message: "Profile already exists"
      });
    }

    const profile = await JobSeekerProfile.create({
      userId,
      ...req.body
    });

    res.status(201).json({
      message: "Profile created successfully",
      data: profile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};



/*
GET LOGGED IN USER PROFILE
*/
export const getMyProfile = async (req, res) => {
  try {

    const profile = await JobSeekerProfile.findOne({
      userId: req.user._id
    }).populate("userId", "name email");

    res.json(profile);

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};



/*
UPDATE PROFILE
*/
export const updateProfile = async (req, res) => {
  try {

    let updateData = {
      phone: req.body.phone,
      city: req.body.city,
      gender: req.body.gender,
      DOB: req.body.DOB,
      summary: req.body.summary,
      skills: JSON.parse(req.body.skills || "[]"),
      education: JSON.parse(req.body.education || "[]"),
      experience: JSON.parse(req.body.experience || "[]"),
      updatedAt: Date.now()
    };

    // If resume uploaded
    if (req.file) {
      if (req.file) {
        updateData.resumeUrl = req.file.path;
        updateData.resumeName = req.file.originalname;
      }
    }
    if (req.body.removeResume === "true") {

      const profile = await JobSeekerProfile.findOne({ userId: req.user._id });

      if (profile?.resumeUrl) {
        fs.unlink(profile.resumeUrl, (err) => {
          if (err) console.log("Failed to delete resume file");
        });
      }

      updateData.resumeUrl = "";
      updateData.resumeName = "";
    }

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      data: profile
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getMyApplications = async (req, res) => {
  try {

    // 1️⃣ Check if user exists from protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found in request"
      });
    }

    // 2️⃣ Validate job seeker id
    const jobSeekerId = req.user._id;

    if (!jobSeekerId) {
      return res.status(400).json({
        success: false,
        message: "Job seeker ID is missing"
      });
    }

    console.log("Fetching applications for user:", jobSeekerId);

    // 3️⃣ Fetch applications
   const applications = await Application.find({ jobSeekerId })
  .populate({
    path: "jobId",
    select: "title location salary requiredSkills companyId",
    populate: {
      path: "companyId",
      model: "Company",
      select: "companyName"
    }
  })
  .populate({
    path: "recruiterId",
    select: "name email"
  })
  .sort({ appliedAt: -1 });
      

    // 4️⃣ Check if no applications found
    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this job seeker",
        count: 0,
        data: []
      });
    }

    // 5️⃣ Success response
    res.status(200).json({
      success: true,
      message: "Applications fetched successfully",
      count: applications.length,
      data: applications
    });

  } catch (error) {

    console.error("Error fetching applications:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching applications",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });

  }
};