import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  learningLink: {
    type: String,
    default: ""
  }

});

export default mongoose.model("Skill", skillSchema);