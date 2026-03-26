import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  years: {
    type: Number
  }
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    trim: true
  },
  institute: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  }
}, { _id: false });

const jobSeekerProfileSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  phone: {
    type: String,
    maxlength: 15
  },

  city: {
    type: String,
    maxlength: 100
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"]
  },

  DOB: {
    type: Date
  },

  summary: {
    type: String,
    maxlength: 500
  },

  skills: [String],

  experience: [experienceSchema],

  education: [educationSchema],

  resumeUrl: {
    type: String,
    maxlength: 255
  },
  resumeName: {
  type: String
},

  parsedSkills: [String],

  parsedExperienceYears: {
    type: Number,
    default: 0
  },

  parsedResumeText: {
    type: String,
    default: ""
  },

  resumeParsedAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("JobSeekerProfile", jobSeekerProfileSchema);