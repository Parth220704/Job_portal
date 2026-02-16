import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getCurrentUser } from "../controllers/userController.js";

const router = express.Router();

// GET logged-in user
router.get("/me", protect, getCurrentUser);

export default router;
