import api from "./apiCall";


/*
========================================
CREATE JOB
POST /api/jobs
========================================
*/
export const createJob = async (jobData) => {

  try {

    const response = await api.post("/jobs", jobData);

    return response.data;

  }
  catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to create job");

  }

};



/*
========================================
GET ALL JOBS (Public)
GET /api/jobs
========================================
*/
export const getAllJobs = async (filters = {}) => {
  try {

    const response = await api.get("/jobs", {
      params: filters
    });

    return response.data;

  } catch (error) {

    throw new Error("Failed to fetch jobs");

  }
};



/*
========================================
GET MY JOBS (Recruiter)
GET /api/jobs/recruiter/my-jobs
========================================
*/
export const getMyJobs = async () => {

  try {

    const response = await api.get("/jobs/recruiter/my-jobs");

    return response.data;

  }
  catch (error) {

    throw new Error("Failed to fetch your jobs");

  }

};



/*
========================================
GET SINGLE JOB
GET /api/jobs/:id
========================================
*/
export const getJobById = async (jobId) => {

  try {

    const response = await api.get(`/jobs/${jobId}`);

    return response.data;

  }
  catch (error) {

    throw new Error("Failed to fetch job");

  }

};



/*
========================================
UPDATE JOB
PUT /api/jobs/:id
========================================
*/
export const updateJob = async (jobId, jobData) => {

  try {

    const response = await api.put(`/jobs/${jobId}`, jobData);

    return response.data;

  }
  catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to update job");

  }

};



/*
========================================
DELETE JOB
DELETE /api/jobs/:id
========================================
*/
export const deleteJob = async (jobId) => {

  try {

    const response = await api.delete(`/jobs/${jobId}`);

    return response.data;

  }
  catch (error) {

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Failed to delete job");

  }

};
