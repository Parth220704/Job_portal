import express from "express";

import {
  getApplicantsByJob,
  updateApplicationStatus,
    applyForJob
} from "../controllers/applicationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// job seeker applies for job
router.post("/apply", protect, applyForJob);

// get applicants for a specific job (recruiter)
router.get("/job/:jobId", protect, getApplicantsByJob);


// update applicant status (shortlist / reject)
router.put("/status/:id", protect, updateApplicationStatus);


export default router;