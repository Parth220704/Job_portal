import api from "./apiCall";


// Get skill suggestions
export const getSkillSuggestions = async (search) => {

  try {

    const response = await api.get(`/skills?search=${search}`);

    return response.data;

  }
  catch (error) {

    console.error("Skill fetch error:", error);

    return [];

  }

};



// Add new skill (optional)
export const addSkill = async (name) => {

  try {

    const response = await api.post("/skills", { name });

    return response.data;

  }
  catch (error) {

    throw new Error(
      error.response?.data?.message || "Failed to add skill"
    );

  }

};
