import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./components/sections/dashboard";
import RecruiterLayout from './components/layout/RecruiterLayout';
import Applications from './components/sections/recruiter/Applications';
import CompanyProfile from './components/sections/recruiter/CompanyProfile';
import MyJobs from './components/sections/recruiter/MyJobs';
import PostJob from './components/sections/recruiter/PostJob';

import './App.css'
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>



        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        <Route path='/recruiter' element={<RecruiterLayout />}>
          <Route path="applications" element={<Applications />} />
          <Route path="company-profile" element={<CompanyProfile />} />
          <Route path="my-jobs" element={<MyJobs />} />
          <Route path="post-job" element={<PostJob />} />
        </Route>
      </Routes>
    </BrowserRouter>
  
  )
}

export default App