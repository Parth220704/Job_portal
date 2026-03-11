import api from "./apiCall";

export const createProfile = async (data) => {
  try {

    const response = await api.post("/jobseeker-profile", data);

    return response.data;

  } catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to create profile");
  }
};

export const getMyProfile = async () => {
  try {

    const response = await api.get("/jobseeker-profile/me");

    return response.data;

  } catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to fetch profile");
  }
};

export const updateProfile = async (data) => {
  try {

    const response = await api.put("/jobseeker-profile", data);

    return response.data;

  } catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to update profile");
  }
};

export const getMyApplications = async () => {
  try {

    const response = await api.get("/jobseeker-profile/my");

    return response.data;

  } catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to fetch applications");
  }
};