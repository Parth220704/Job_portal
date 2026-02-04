import React from "react";
import './head.css';
import { useNavigate } from "react-router-dom";

function Head() {
  const navigate = useNavigate();

  return (
    <>
      <div className="hero">
        <h1 className="hero-title">
          Find Your Dream Job Or{" "}
          <span>
            <br></br>
          </span>
          Hire Top Talent
        </h1>

        <p className="hero-subtitle">
          A modern job portal connecting job seekers with recruiters.
          Intelligent matching, skill analysis, and career growth opportunities.
        </p>

        <div className="hero-actions">
          <div className="hero-btn job"  onClick={() => navigate("/login")} >🔍 I'm Looking for a Job</div>

          <div className="hero-btn hire"  onClick={() => navigate("/login")}>🏢 I'm Hiring</div>
        </div>
      </div>
    </>
  );
}

export default Head;
