import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },

  jobSeekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["applied", "shortlisted", "rejected"],
    default: "applied"
  },

  matchPercentage: Number,

  appliedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Application", applicationSchema);