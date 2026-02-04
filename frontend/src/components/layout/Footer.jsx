import React from 'react'
import { FaBriefcase } from "react-icons/fa";
import './footer.css'

const Footer = () => {
  return (
    <footer className="footer">
  <hr className="footer-hr" />

  <div className="footer-content">
    <div className="footer-logo">
      <FaBriefcase className="footer-icon" />
      <span>Job Portal</span>
    </div>

    <p className="footer-text">
      © 2026 Job Portal. Built with MERN Stack.
    </p>
  </div>
</footer>
  )
}

export default Footer
