import cosineSimilarity from "cosine-similarity";
import { getBatchEmbeddings } from "./flaskClient.js";

const normalizeSkill = (skill) =>
  (skill || "")
    .toString()
    .trim()
    .toLowerCase();

const uniqueNormalizedSkills = (skills = []) =>
  [...new Set((skills || []).map(normalizeSkill).filter(Boolean))];

const parseYearsFromText = (text = "") => {
  const yearRegex = /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)/gi;
  const values = [];

  let match;
  while ((match = yearRegex.exec(text)) !== null) {
    values.push(parseFloat(match[1]));
  }

  if (values.length === 0) return 0;

  return Math.max(...values);
};

export const extractSkillsFromText = (text = "", knownSkills = []) => {
  if (!text || !knownSkills.length) return [];

  const normalizedText = ` ${text.toLowerCase().replace(/[^a-z0-9+#\.\s]/g, " ")} `;

  return knownSkills
    .filter((skill) => {
      const normalized = normalizeSkill(skill);
      if (!normalized) return false;

      const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "i");
      return regex.test(normalizedText);
    })
    .map((skill) => skill.toString().trim());
};

export const getTotalExperienceYears = (profile = {}) => {
  const listYears = (profile?.experience || [])
    .map((entry) => Number(entry?.years || 0))
    .filter((value) => Number.isFinite(value) && value > 0)
    .reduce((sum, value) => sum + value, 0);

  const parsedYears = Number(profile?.parsedExperienceYears || 0);

  return Math.max(listYears, parsedYears, 0);
};

const experienceScore = (candidateYears, minExperience, maxExperience) => {
  const minExp = Number(minExperience || 0);
  const maxExp = Number(maxExperience || minExp);

  // If candidate has zero experience, be conservative
  if (candidateYears === 0) {
    // Entry-level jobs (minExp=0) still get decent score but not perfect
    if (minExp === 0) {
      return 0.7; // 70% - indicates suitable for entry level but unproven
    }
    // Job requires experience but candidate has none
    return 0.1; // 10% - poor match
  }

  // Perfect match: within range
  if (candidateYears >= minExp && candidateYears <= maxExp) {
    return 1;
  }

  // Below minimum (but has some experience)
  if (candidateYears < minExp) {
    return Math.max(0.3, candidateYears / minExp); // Min 30%
  }

  // Over-qualified
  if (candidateYears > maxExp) {
    return 0.95;
  }

  return 0;
};

const buildCandidateText = (profile = {}) => {
  const skills = [
    ...(profile?.skills || []),
    ...(profile?.parsedSkills || [])
  ].join(", ");

  const summary = profile?.summary || "";
  const experienceRoles = (profile?.experience || [])
    .map((entry) => `${entry?.role || ""} at ${entry?.companyName || ""}`)
    .join("; ");

  const resumeText = profile?.parsedResumeText || "";

  return `${summary}\nSkills: ${skills}\nExperience: ${experienceRoles}\n${resumeText}`;
};

const buildJobText = (job = {}) => {
  return `${job?.title || ""}\n${job?.description || ""}\nRequired Skills: ${(job?.requiredSkills || []).join(", ")}\nExperience: ${job?.minExperience || 0}-${job?.maxExperience || 0} years`;
};

export const enrichProfileFromResume = ({
  profile = {},
  resumeText = "",
  knownSkills = []
}) => {
  const extractedSkills = extractSkillsFromText(resumeText, knownSkills);
  const parsedExperienceYears = parseYearsFromText(resumeText);
  const uniqueParsedSkills = [...new Set((extractedSkills || []).map((skill) => skill?.trim()).filter(Boolean))];

  return {
    parsedSkills: uniqueParsedSkills,
    parsedExperienceYears,
    parsedResumeText: resumeText?.slice(0, 50000) || "",
    resumeParsedAt: new Date()
  };
};

export const scoreJobsForProfile = async ({ profile, jobs }) => {
  const candidateSkills = uniqueNormalizedSkills([
    ...(profile?.skills || []),
    ...(profile?.parsedSkills || [])
  ]);

  const candidateSkillSet = new Set(candidateSkills);
  const candidateYears = getTotalExperienceYears(profile);

  const candidateText = buildCandidateText(profile);
  const jobTexts = jobs.map((job) => buildJobText(job));

  const embeddings = await getBatchEmbeddings([candidateText, ...jobTexts]);
  const canUseEmbeddings = embeddings.length === jobs.length + 1;
  const candidateEmbedding = canUseEmbeddings ? embeddings[0] : null;

  const scored = jobs.map((job, index) => {
    const requiredSkills = uniqueNormalizedSkills(job.requiredSkills || []);

    const matchedSkills = requiredSkills.filter((skill) =>
      candidateSkillSet.has(skill)
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !candidateSkillSet.has(skill)
    );

    const exactSkillScore =
      requiredSkills.length === 0
        ? 0
        : matchedSkills.length / requiredSkills.length;

    let semanticScore = exactSkillScore;

    if (canUseEmbeddings && candidateEmbedding?.length) {
      const jobEmbedding = embeddings[index + 1];
      if (Array.isArray(jobEmbedding) && jobEmbedding.length === candidateEmbedding.length) {
        const raw = cosineSimilarity(candidateEmbedding, jobEmbedding);
        semanticScore = Math.max(0, Math.min(1, (raw + 1) / 2));
      }
    }

    const expScore = experienceScore(
      candidateYears,
      job.minExperience,
      job.maxExperience
    );

    const weighted =
      semanticScore * 0.6 +
      exactSkillScore * 0.3 +
      expScore * 0.1;

    const matchPercentage = Math.round(weighted * 100);

    return {
      job,
      matchedSkills,
      missingSkills,
      matchPercentage,
      scoreBreakdown: {
        semanticScore: Math.round(semanticScore * 100),
        skillScore: Math.round(exactSkillScore * 100),
        experienceScore: Math.round(expScore * 100)
      }
    };
  });

  return scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
};
