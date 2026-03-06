import React, { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { getMyJobs } from "../../../api/job";
import ApplicantsList from "./ApplicantsList";
import { useLocation } from "react-router-dom";

function Applications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await getMyJobs();
    setJobs(res);
  };
  useEffect(() => {
  const storedJob = sessionStorage.getItem("selectedJob");

  if (storedJob) {
    setSelectedJob(JSON.parse(storedJob));
    sessionStorage.removeItem("selectedJob");
  } else {
    fetchJobs();
  }
}, []);

  return (
    <div className="p-6">

      {!selectedJob && (
        <>
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
            <FaUsers /> All Applicants
          </h2>

          <p className="text-gray-500 mb-6">
            Select a job to view its applicants
          </p>

          <div className="grid grid-cols-3 gap-6">

            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>

                <p className="text-gray-500 text-sm mt-1">
                  {job.location}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills?.map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedJob(job)}
                  className="mt-5 w-full border rounded-lg py-2 hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                  <FaUsers /> View Applicants
                </button>
              </div>
            ))}

          </div>
        </>
      )}

      {selectedJob && (
        <ApplicantsList
          job={selectedJob}
          goBack={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}

export default Applications;