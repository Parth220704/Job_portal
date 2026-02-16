import express from "express";

import {
  getSkills,
  addSkill
} from "../controllers/skillController.js";

const router = express.Router();


// Public route for skill suggestions
router.get("/", getSkills);


// Admin route to add skill
router.post("/", addSkill);


export default router;
