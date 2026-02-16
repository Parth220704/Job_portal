import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    // Link to recruiter user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true  
    },

    // Basic company details
    companyName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    // 🔹 Industry dropdown (ENUM)
    industry: {
      type: String,
      enum: [
        "IT / Software",
        "Finance / Banking",
        "Healthcare",
        "Education",
        "Manufacturing",
        "Retail",
        "E-commerce",
        "Telecom",
        "Construction",
        "Automobile",
        "Media & Entertainment",
        "Logistics",
        "Hospitality",
        "Real Estate",
        "Other"
      ],
      required: true
    },

    // Company size dropdown
    companySize: {
      type: String,
      enum: [
        "1-10",
        "11-50",
        "51-200",
        "201-500",
        "501-1000",
        "1000+"
      ]
    },

    // Founded year
    foundedYear: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },

    // Location & contact
    location: {
      type: String,
      trim: true
    },

    website: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true
    },

    phone: {
      type: String
    },

    // Media
    logoUrl: {
      type: String
    },

    // Social links
    linkedin: {
      type: String
    },

    twitter: {
      type: String
    },

    // Admin controls
    verified: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt
  }
);

export default mongoose.model("Company", companySchema);