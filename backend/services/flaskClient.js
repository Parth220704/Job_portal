import axios from "axios";

const client = axios.create({
  baseURL: process.env.ML_SERVICE_URL || "http://127.0.0.1:8001",
  timeout: 45000
});

let hasShownMlWarning = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getBatchEmbeddings = async (texts = []) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const sanitizedTexts = texts.map((text) =>
    (text || "").toString().slice(0, 12000)
  );

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await client.post("/embed", {
        texts: sanitizedTexts
      });

      // reset warning flag if service recovers
      hasShownMlWarning = false;
      return response?.data?.embeddings || [];
    } catch (error) {
      if (attempt < 2) {
        await sleep(600);
        continue;
      }

      if (!hasShownMlWarning) {
        console.warn(
          "ML service not reachable, falling back to non-semantic scoring"
        );
        hasShownMlWarning = true;
      }

      return [];
    }
  }

  return [];
};
