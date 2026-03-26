import fs from "fs/promises";
import path from "path";
import pdf from "pdf-parse";

export const extractResumeText = async (resumePath) => {
  if (!resumePath) return "";

  const ext = path.extname(resumePath).toLowerCase();

  if (ext === ".pdf") {
    const dataBuffer = await fs.readFile(resumePath);
    const parsed = await pdf(dataBuffer);
    return (parsed?.text || "").trim();
  }

  return "";
};
