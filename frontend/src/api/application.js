import api from "./apiCall";

export const getApplicantsByJob = (jobId) =>
  api.get(`/applications/job/${jobId}`);

export const updateApplicationStatus = (id, status) =>
  api.put(`/applications/status/${id}`, { status });

export const applyForJob = (jobId) =>
  api.post("/applications/apply", { jobId });