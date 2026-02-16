import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  }
});

// // Index for fast search
// skillSchema.index({ name: 1 });

export default mongoose.model("Skill", skillSchema);
