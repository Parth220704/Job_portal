import React, { useEffect, useState } from "react";
import { getApplicantsByJob, updateApplicationStatus } from "../../../api/application";
import { FaArrowLeft, FaUser, FaFileAlt, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";

function ApplicantsList({ job, goBack }) {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);


  const fetchApplicants = async () => {
    try {
      const res = await getApplicantsByJob(job._id);
      setApplicants(res.data.data);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to load applicants");
    }
  };

  const handleStatusChange = async (id, status) => {
    const previousApplicants = [...applicants];

    // Optimistic UI update for immediate feedback
    setApplicants((prev) =>
      prev.map((app) =>
        app._id === id ? { ...app, status } : app
      )
    );

    try {
      await updateApplicationStatus(id, status);
      toast.success(`Application ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);

      // Rollback if API fails
      setApplicants(previousApplicants);
      toast.error("Failed to update application status");
    }
  };

  const stats = {
    applied: applicants.filter(a => a.status === "applied").length,
    shortlisted: applicants.filter(a => a.status === "shortlisted").length,
    rejected: applicants.filter(a => a.status === "rejected").length
  };

  return (
    <div className="p-6">

      {/* Back Button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4 hover:text-black"
      >
        <FaArrowLeft /> Back to Jobs
      </button>

      {/* Header */}
      <h2 className="text-2xl font-bold mb-1">
        Applicants for "{job.title}"
      </h2>

      <p className="text-gray-500 mb-6">
        {applicants.length} application received
      </p>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">

        {Object.entries(stats).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-4 rounded-xl border text-center shadow-sm"
          >
            <h3 className="text-xl font-bold">{value}</h3>

            <p className="capitalize text-sm text-gray-500">
              {key}
            </p>
          </div>
        ))}

      </div>

      {/* Applicants List */}

      <div className="space-y-4">

        {applicants.map((app) => (
          <div
            key={app._id}
            className="bg-white border rounded-xl p-6 flex justify-between items-start shadow-sm"
          >

            {/* LEFT SIDE */}

            <div className="flex-1">

              {/* Name */}
              <div className="flex items-center gap-2 mb-3">
                <FaUser className="text-gray-500" />

                <h3 className="font-semibold text-lg">
                  {app.jobSeekerId?.name || "Unnamed User"}
                </h3>
              </div>

              {/* Summary */}

              <div className="mb-3">

                <p className="text-sm font-medium text-gray-600 mb-1">
                  Summary
                </p>

                <p className="bg-gray-100 p-3 rounded-md text-sm text-gray-700">
                  {app.profile?.summary || "No summary available"}
                </p>

              </div>

              {/* Resume */}

              <div className="flex items-center gap-2 text-blue-600 text-sm mb-2">
                <FaFileAlt />

                {app.profile?.resumeUrl ? (
                  <a
                    //href={app.profile.resumeUrl}
                    href={`http://localhost:5000/${app.profile.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-400">No resume uploaded</span>
                )}

              </div>

              {/* Applied Time */}

              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaClock />

                Applied {new Date(app.appliedAt).toDateString()}
              </div>

            </div>

            {/* RIGHT SIDE STATUS */}

            <div className="ml-6">

              <select
                value={app.status}
                onChange={(e) =>
                  handleStatusChange(app._id, e.target.value)
                }
                className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm"
              >
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default ApplicantsList;