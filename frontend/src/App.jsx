import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/sections/Dashboard";
import RecruiterLayout from './components/layout/RecruiterLayout';
import Applications from './components/sections/recruiter/Applications';
import CompanyProfile from './components/sections/recruiter/CompanyProfile';
import MyJobs from './components/sections/recruiter/MyJobs';
import PostJob from './components/sections/recruiter/PostJob';

import JobSeekerLayout from './components/layout/JobSeekerLayout';

import JobSeekerDashboard from './components/sections/jobSeeker/JobSeekerDashboard';
import BrowseJobs from './components/sections/jobSeeker/BrowseJobs';
import MatchJobs from './components/sections/jobSeeker/MatchJobs';
import JSApplications from './components/sections/jobSeeker/Applications';
import Profile from './components/sections/jobSeeker/Profile';

import './App.css'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/recruiter" element={<RecruiterLayout />}>
          <Route path="applications" element={<Applications />} />
          <Route path="company-profile" element={<CompanyProfile />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
        </Route>

        <Route path="/jobseeker" element={<JobSeekerLayout />}>
          <Route path="dashboard" element={<JobSeekerDashboard />} />

          <Route path="jobs" element={<BrowseJobs />} />

          <Route path="matches" element={<MatchJobs />} />

          <Route path="applications" element={<JSApplications />} />

          <Route path="profile" element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App