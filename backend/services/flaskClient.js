import axios from "axios";

const client = axios.create({
  baseURL: process.env.ML_SERVICE_URL || "http://127.0.0.1:8001",
  timeout: 20000
});

export const getBatchEmbeddings = async (texts = []) => {
  if (!Array.isArray(texts) || texts.length === 0) {
    return [];
  }

  const sanitizedTexts = texts.map((text) =>
    (text || "").toString().slice(0, 12000)
  );

  try {
    const response = await client.post("/embed", {
      texts: sanitizedTexts
    });

    return response?.data?.embeddings || [];
  } catch (error) {
    console.warn("ML service not reachable, falling back to non-semantic scoring");
    return [];
  }
};
