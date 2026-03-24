import express from "express";
import {
  getDashboard,
  getAllRecruiters,
  updateRecruiterStatus,
  updateUserStatus,
  getAllJobSeekers,
  getAllJobs,
  updateJobStatus,
  getAllApplications,
  getAllCompanies,
  updateCompanyStatus

} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protect, isAdmin, getDashboard);

// Recruiters
router.get("/recruiters", protect, isAdmin, getAllRecruiters);
router.put("/recruiter/:id/status", protect, isAdmin, updateRecruiterStatus);
router.put("/user/:id/status", protect, isAdmin, updateUserStatus);

// Job Seekers
router.get("/jobseekers", protect, isAdmin, getAllJobSeekers);

// Jobs
router.get("/jobs", protect, isAdmin, getAllJobs);
router.put("/job/:id/status", protect, isAdmin, updateJobStatus);

// Applications
router.get("/applications", protect, isAdmin, getAllApplications);

// ================= COMPANY ROUTES =================
router.get("/companies", protect, isAdmin, getAllCompanies);
router.put("/company/:id/status", protect, isAdmin, updateCompanyStatus);

export default router;