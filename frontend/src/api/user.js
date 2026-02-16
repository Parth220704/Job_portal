import api from "./apiCall";

// 🔹 GET CURRENT LOGGED-IN USER
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to fetch user details");
  }
};
