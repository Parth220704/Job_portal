import express from "express";

import {
  createCompany,
  getMyCompany,
  updateCompany,
  getCompanyById
} from "../controllers/companyController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// create company
router.post("/", protect, createCompany);


// get recruiter company
router.get("/my-company", protect, getMyCompany);


// update company
router.put("/", protect, updateCompany);

// get company details (for job seeker)
router.get("/:id", protect, getCompanyById);


export default router;
