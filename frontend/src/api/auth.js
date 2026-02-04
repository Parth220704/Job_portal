import api from "./apiCall";

// 🔹 LOGIN USER
export const loginUser = async (data) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    // Backend error (401, 403, 400, etc.)
    if (error.response && error.response.data?.message) {
      throw new Error(error.response.data.message);
    }

    // Network / server error
    throw new Error("Server is not responding. Please try again later.");
  }
};

// 🔹 REGISTER USER
export const registerUser = async (data) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    // Validation / backend error
    if (error.response && error.response.data) {
      // express-validator errors
      if (error.response.data.errors?.length) {
        throw new Error(error.response.data.errors[0].msg);
      }

      // normal backend message
      if (error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }

    // Network / server error
    throw new Error("Server is not responding. Please try again later.");
  }
};
