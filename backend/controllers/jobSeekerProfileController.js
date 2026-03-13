import JobSeekerProfile from "../models/JobSeeker.js";
import fs from "fs";


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

    const jobSeekerId = req.user._id;

    const applications = await Application.find({ jobSeekerId })
      .populate({
        path: "jobId",
        select: "title location salary requiredSkills companyId"
      })
      .populate({
        path: "recruiterId",
        select: "name email"
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({
      count: applications.length,
      data: applications
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message
    });

  }
};