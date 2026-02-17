import api from "./apiCall";


// GET MY COMPANY
export const getMyCompany = async () => {

  try {

    const response = await api.get("/company/my-company");

    // backend returns company directly
    return response.data;

  } catch (error) {

    if (error.response?.status === 404) {
      return null; // no company exists
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to fetch company");

  }

};



// CREATE COMPANY
export const createCompany = async (companyData) => {

  try {

    const response = await api.post("/company", companyData);

    // backend returns { message, company }
    return response.data.company;

  } catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to create company");

  }

};



// UPDATE COMPANY
export const updateCompany = async (companyData) => {

  try {

    const response = await api.put("/company", companyData);

    // backend returns { message, company }
    return response.data.company;

  } catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to update company");

  }

};
