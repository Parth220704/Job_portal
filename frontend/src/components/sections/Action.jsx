import React from 'react'
import { FaSearch, FaBriefcase, FaShieldAlt } from "react-icons/fa";
import './action.css'

const Action = () => {
  return (
    <div className="choose-wrapper">

      {/* Built for Everyone Section */}
      <div className="built-section">
        <h2 className="built-title">Built for Everyone</h2>
        <p className="built-subtitle">
          Whether you're looking for a job, hiring talent, or managing the
          platform, we've got you covered.
        </p>
      </div>

      {/* Cards Section */}
      <div className="choose-container">

        {/* Job Seekers */}
        <div className="choose-card card-green">
          <div className="choose-icon green">
            <FaSearch />
          </div>
          <h3>Job Seekers</h3>
          <ul>
            <li>Search and apply for jobs</li>
            <li>Upload resume (PDF)</li>
            <li>Track application status</li>
            <li>Get job recommendations</li>
            <li>Skill gap analysis</li>
          </ul>
          <button className="choose-btn green-btn">Start Job Search</button>
        </div>

        {/* Recruiters */}
        <div className="choose-card card-blue">
          <div className="choose-icon blue">
            <FaBriefcase />
          </div>
          <h3>Recruiters</h3>
          <ul>
            <li>Post job vacancies</li>
            <li>Review applications</li>
            <li>View candidate profiles</li>
            <li>Shortlist candidates</li>
            <li>Company profile</li>
          </ul>
          <button className="choose-btn blue-btn">Start Hiring</button>
        </div>

        {/* Administrators */}
        <div className="choose-card card-purple">
          <div className="choose-icon purple">
            <FaShieldAlt />
          </div>
          <h3>Administrators</h3>
          <ul>
            <li>Manage all users</li>
            <li>Approve recruiters</li>
            <li>Monitor platform</li>
            <li>View analytics</li>
            <li>Configure settings</li>
          </ul>
          <button className="choose-btn purple-btn">Admin Access</button>
        </div>

      </div>
    </div>
    
    
  )
}

export default Action
