import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["admin", "recruiter", "jobseeker"],
    required: true
  },

  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  }
}, { timestamps: true });

/**
 * 🔥 COMPOUND INDEX FOR FAST LOGIN
 * Used by: User.findOne({ email, role })
 */
userSchema.index(
  { email: 1, role: 1 },
  { unique: true }
);

export default mongoose.model("User", userSchema);
