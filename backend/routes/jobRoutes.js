import express from "express";

import {
  createJob,
  getAllJobs,
  getMyJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// public
router.get("/", getAllJobs);

router.get("/:id", getJobById);


// recruiter only
router.post("/", protect, createJob);

router.get("/recruiter/my-jobs", protect, getMyJobs);

router.put("/:id", protect, updateJob);

router.delete("/:id", protect, deleteJob);


export default router;
