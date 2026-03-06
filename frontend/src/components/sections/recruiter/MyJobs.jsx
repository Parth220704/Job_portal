import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyJobs, deleteJob } from "../../../api/job";

import {
  HiOutlineBriefcase,
  HiOutlinePlus,
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineTrash,
} from "react-icons/hi2";

const MyJobs = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  // Fetch jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getMyJobs();

      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await deleteJob(jobId);

      fetchJobs();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading jobs...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <HiOutlineBriefcase className="text-blue-600 text-2xl" />

          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              My Job Postings
            </h1>

            <p className="text-sm text-gray-500">
              {jobs.length} job{jobs.length !== 1 && "s"} posted
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/recruiter/post-job", { relative: "path" })}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <HiOutlinePlus />
          Post New Job
        </button>
      </div>

      {/* Empty state */}
      {jobs.length === 0 ? (
        <div className="bg-white border rounded-xl shadow p-12 text-center">
          <HiOutlineBriefcase className="mx-auto text-gray-400 text-5xl mb-4" />

          <h2 className="text-lg font-medium text-gray-700 mb-2">
            No jobs posted yet
          </h2>

          <p className="text-gray-500 mb-4">
            Start by creating your first job posting
          </p>

          <button
            onClick={() =>
              navigate("/recruiter/post-job", { relative: "path" })
            }
            className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <HiOutlinePlus />
            Post Your First Job
          </button>
        </div>
      ) : (
        /* Jobs Table */
        <div className="bg-white border rounded-xl shadow overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-600">
            <div>Job Title</div>

            <div>Experience</div>

            <div>Location</div>

            <div>Status</div>

            <div>Posted</div>

            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Job Rows */}
          {jobs.map((job) => (
            <div
              key={job._id}
              className="grid grid-cols-7 gap-4 px-6 py-4 border-t items-center"
            >
              {/* Title */}
              <div className="font-medium text-gray-800">{job.title}</div>

              {/* Experience */}
              <div className="text-gray-600">
                {job.minExperience} - {job.maxExperience} yrs
              </div>

              {/* Location */}
              <div className="flex items-center gap-1 text-gray-600">
                <HiOutlineMapPin className="text-gray-400" />

                {job.location || "Remote"}
              </div>

              {/* Status */}
              <div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  {job.status}
                </span>
              </div>

              {/* Date */}
              <div className="text-gray-500 text-sm">
                {new Date(job.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="col-span-2 flex justify-end gap-3">
                <button
                  onClick={() => {
                    sessionStorage.setItem("selectedJob", JSON.stringify(job));
                    navigate("/recruiter/applications");
                  }}
                  className="flex items-center gap-1 border px-3 py-1 rounded-lg hover:bg-gray-50"
                >
                  <HiOutlineUsers />
                  Applicants
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                >
                  <HiOutlineTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
