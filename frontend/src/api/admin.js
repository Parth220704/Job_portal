import api from "./apiCall";


// ================= DASHBOARD =================
export const getAdminDashboard = () =>
  api.get("/admin/dashboard");


// ================= USERS =================

// Get all recruiters
export const getAllRecruiters = () =>
  api.get("/admin/recruiters");

// Get all job seekers
export const getAllJobSeekers = () =>
  api.get("/admin/jobseekers");

// Update user status (block / active)
export const updateUserStatus = (id, status) =>
  api.put(`/admin/user/${id}/status`, { status });


// ================= JOBS =================

// Get all jobs
export const getAllJobs = () =>
  api.get("/admin/jobs");

// Update job status (active / inactive / expired)
export const updateJobStatus = (id, status) =>
  api.put(`/admin/job/${id}/status`, { status });


// ================= APPLICATIONS =================

// Get all applications
export const getAllApplications = () =>
  api.get("/admin/applications");

// Get all companies
export const getAllCompanies = () =>
  api.get("/admin/companies");

// Update company status
export const updateCompanyStatus = (id, status) =>
  api.put(`/admin/company/${id}/status`, { status });