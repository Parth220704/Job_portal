import cron from "node-cron";
import Job from "../models/Job.js";

export const startJobExpiryCron = () => {
  
  // Runs every day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("Running Job Expiry Cron...");

    try {
      const now = new Date();

      const result = await Job.updateMany(
        {
          expiryDate: { $lt: now },
          status: "active"
        },
        {
          status: "expired"
        }
      );

      console.log(`Expired Jobs Updated: ${result.modifiedCount}`);
    } catch (error) {
      console.error("Cron Error:", error.message);
    }
  });

};