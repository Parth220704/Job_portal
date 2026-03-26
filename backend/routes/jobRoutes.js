import express from "express";

import {
  createJob,
  getAllJobs,
  getMatchedJobsForMe,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// public
router.get("/", getAllJobs);

// recruiter only
router.post("/", protect, createJob);

router.get("/recruiter/my-jobs", protect, getMyJobs);

// job seeker
router.get("/matches/me", protect, getMatchedJobsForMe);

router.get("/:id", protect, getJobById);

router.put("/:id", protect, updateJob);

router.delete("/:id", protect, deleteJob);


export default router;
