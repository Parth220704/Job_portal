import express from "express";

import {
  createCompany,
  getMyCompany,
  updateCompany,
  getCompanyById,
  getCompanyJobs
} from "../controllers/companyController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// create company
router.post("/", protect, createCompany);


// get recruiter company
router.get("/my-company", protect, getMyCompany);


// update company
router.put("/", protect, updateCompany);

//get jobs of a company (for job seeker)
router.get("/:id/jobs", getCompanyJobs);

// get company details (for job seeker)
router.get("/:id", protect, getCompanyById);




export default router;
