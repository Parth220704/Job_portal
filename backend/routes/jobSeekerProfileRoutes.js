import express from "express";

import {
  createProfile,
  getMyProfile,
  updateProfile,
  getMyApplications
} from "../controllers/jobSeekerProfileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


/* create profile */
router.post("/", protect, createProfile);


/* get logged user profile */
router.get("/me", protect, getMyProfile);


/* update profile */
router.put("/", protect, updateProfile);

// job seeker view applied jobs
router.get("/my", protect, getMyApplications);


export default router;