import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: String,

  requiredSkills: [String],

  location: String,

  salary: String,

  minExperience: {
    type: Number,
    required: true,
    min: 0
  },

  maxExperience: {
    type: Number,
    required: true,
    min: 0
  },

  expiryDate: Date,

  priorityLevel: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active"
  }

},
{
  timestamps: true
});

export default mongoose.model("Job", jobSchema);
