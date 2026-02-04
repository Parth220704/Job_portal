import React from 'react'
import { FaBolt, FaChartLine, FaUsers, FaCheckCircle } from "react-icons/fa";
import './choose.css'

const Choose = () => {
  return (
    <div className="why-section">
      <h2 className="why-title">Why Choose Our Platform?</h2>

      <div className="why-cards">
        <div className="why-card">
          <div className="icon blue">
            <FaBolt />
          </div>
          <h3>Smart Matching</h3>
          <p>AI-powered skill matching to find the perfect job or candidate.</p>
        </div>

        <div className="why-card">
          <div className="icon green">
            <FaChartLine />
          </div>
          <h3>Skill Gap Analysis</h3>
          <p>Identify missing skills and get personalized learning recommendations.</p>
        </div>

        <div className="why-card">
          <div className="icon indigo">
            <FaUsers />
          </div>
          <h3>Easy Applications</h3>
          <p>Simple one-click applications and resume management system.</p>
        </div>

        <div className="why-card">
          <div className="icon purple">
            <FaCheckCircle />
          </div>
          <h3>Priority Alerts</h3>
          <p>Get notified about expiring jobs and high-match opportunities.</p>
        </div>
      </div>
    </div>
  )
}

export default Choose
