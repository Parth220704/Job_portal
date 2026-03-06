import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import userRoutes from "../routes/userRoutes.js";
import skillRoutes from "../routes/skillRoutes.js";
import companyRoutes from "../routes/companyRoutes.js";
import jobRoutes from "../routes/jobRoutes.js";
import applicationRoutes from "../routes/applicationRoutes.js";
import jobSeekerProfileRoutes from "../routes/jobSeekerProfileRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobseeker-profile", jobSeekerProfileRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running...");
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});