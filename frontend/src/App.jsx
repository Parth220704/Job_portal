import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/sections/Dashboard";
import RecruiterLayout from "./components/layout/RecruiterLayout";
import Applications from "./components/sections/recruiter/Applications";
import CompanyProfile from "./components/sections/recruiter/CompanyProfile";
import MyJobs from "./components/sections/recruiter/MyJobs";
import PostJob from "./components/sections/recruiter/PostJob";

import JobSeekerLayout from "./components/layout/JobSeekerLayout";

import JobSeekerDashboard from "./components/sections/jobSeeker/JobSeekerDashboard";
import BrowseJobs from "./components/sections/jobSeeker/BrowseJobs";
import MatchJobs from "./components/sections/jobSeeker/MatchJobs";
import JSApplications from "./components/sections/jobSeeker/Applications";
import Profile from "./components/sections/jobSeeker/Profile";
import JobDetails from "./components/sections/jobSeeker/JobDetails";
import CompanyDetails from "./components/sections/jobSeeker/CompanyDetails";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./components/sections/admin/Dashboard";
import AdminUsers from "./components/sections/admin/ManageUsers";
import AdminCompanies from "./components/sections/admin/ManageCompany";
//import AdminCompanyDetails from './components/sections/admin/AdminCompanyDetails';
import AdminJobs from "./components/sections/admin/ManageJobs";
import AdminApplications from "./components/sections/admin/ManageApplications";

import { Toaster } from "react-hot-toast";

import "./App.css";
const App = () => {
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          //add admin routes here
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route path="applications" element={<Applications />} />
            <Route path="company-profile" element={<CompanyProfile />} />
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="post-job" element={<PostJob />} />
          </Route>
          <Route path="/jobseeker" element={<JobSeekerLayout />}>
            <Route path="dashboard" element={<JobSeekerDashboard />} />

            <Route path="jobs" element={<BrowseJobs />} />

            <Route path="jobs/:id" element={<JobDetails />} />

            <Route path="companies/:id" element={<CompanyDetails />} />

            <Route path="matches" element={<MatchJobs />} />

            <Route path="applications" element={<JSApplications />} />

            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />

            <Route path="users" element={<AdminUsers />} />

            <Route path="companies" element={<AdminCompanies />} />

            {/* <Route path="companies/:id" element={<AdminCompanyDetails />} /> */}

            <Route path="jobs" element={<AdminJobs />} />

            <Route path="applications" element={<AdminApplications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
