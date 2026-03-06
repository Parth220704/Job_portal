import JobSeekerProfile from "../models/JobSeeker.js";


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

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        ...req.body,
        updatedAt: Date.now()
      },
      { new: true }
    );

    res.json({
      message: "Profile updated successfully",
      data: profile
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};