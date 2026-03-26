import React, { useEffect, useState } from "react";
import { getMyApplications } from "../../../api/profile";
import { FaBriefcase, FaMapMarkerAlt, FaCalendarAlt, FaMoneyBillWave, FaUserTie } from "react-icons/fa";
import toast from "react-hot-toast";

function Applications() {

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
    
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load applications");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaBriefcase className="text-teal-500" />
          My Applications
        </h1>
        <p className="text-gray-500 text-sm">
          Track the status of your job applications
        </p>
      </div>

      {/* Applications List */}
      <div className="space-y-5">

        {applications.map((app) => (

          <div
            key={app._id}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >

            <div className="flex justify-between items-start">

              {/* LEFT SIDE */}
              <div>

                <h2 className="text-lg font-semibold text-gray-800">
                  {app.jobId.title}
                </h2>

                {/* Recruiter */}
                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                  <FaBriefcase />
                  {app.jobId?.companyId?.companyName}
                </p>

                {/* Location */}
                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt />
                  {app.jobId.location}
                </p>

                {/* Salary */}
                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
                  <FaMoneyBillWave />
                  {app.jobId.salary}
                </p>

                {/* Applied Date */}
                <p className="text-gray-400 text-sm flex items-center gap-2 mt-2">
                  <FaCalendarAlt />
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {app.jobId.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </div>

              {/* STATUS BADGE */}
              <div>
                <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full capitalize">
                  {app.status}
                </span>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Applications;