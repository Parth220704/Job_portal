import express from "express";

import {
  createCompany,
  getMyCompany,
  updateCompany
} from "../controllers/companyController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// create company
router.post("/", protect, createCompany);


// get recruiter company
router.get("/my-company", protect, getMyCompany);


// update company
router.put("/", protect, updateCompany);


export default router;
