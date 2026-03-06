import express from "express";

import {
  createProfile,
  getMyProfile,
  updateProfile
} from "../controllers/jobSeekerProfileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


/* create profile */
router.post("/", protect, createProfile);


/* get logged user profile */
router.get("/me", protect, getMyProfile);


/* update profile */
router.put("/", protect, updateProfile);


export default router;