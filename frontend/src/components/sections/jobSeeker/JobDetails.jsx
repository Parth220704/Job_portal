import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../../../api/job";
import { applyForJob } from "../../../api/application";
import { getMyApplications } from "../../../api/profile";
import toast from "react-hot-toast";

import {
  HiOutlineBuildingOffice,
  HiOutlineMapPin,
  HiOutlineCurrencyDollar,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiArrowLeft
} from "react-icons/hi2";

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [profile, setProfile] = useState(null);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set()); // 👈 track applied
  const [applyingJobId, setApplyingJobId] = useState(null);   

  useEffect(() => {
    loadJob();
    loadMyApplications();
  }, []);

  const loadMyApplications = async () => {
    try {
      const res = await getMyApplications();
      const applications = res?.data || [];
      const ids = new Set(applications.map((app) => app.jobId?._id ?? app.jobId));
      setAppliedJobIds(ids);
    } catch {
      setAppliedJobIds(new Set());
    }
  };

  const loadJob = async () => {
    try {
      const data = await getJobById(id);

      setJob(data.job);
      setMatchedSkills(data.matchedSkills);
      setResources(data.resources);
      setMatchPercentage(data.matchPercentage);
      setProfile(data.profile);
    } catch (error) {
      toast.error(error.message || "Failed to load job details");
    }
  };

    // 👇 Handle apply click
  const handleApply = async (jobId) => {
    try {
      setApplyingJobId(jobId);
      await applyForJob(jobId);
      setAppliedJobIds((prev) => new Set([...prev, jobId])); // mark as applied locally
      toast.success("Application submitted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingJobId(null);
    }
  };

  if (!job) return null;

  const alreadyApplied = appliedJobIds.has(job._id);
  const isApplying = applyingJobId === job._id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <a
          href="/jobseeker/jobs"
          className="text-green-600 flex items-center gap-1"
        >
          <HiArrowLeft />
          Back to Browse Jobs
        </a>
      </div>
      {/* Job Header */}

      <div className="border rounded-xl p-6 mb-6 bg-white shadow-sm">
        {/* Job Title */}
        <h1 className="text-2xl font-semibold text-gray-800">{job.title}</h1>

        {/* Company */}
        <div className="flex items-center gap-2 text-green-600 mt-2">
          <HiOutlineBuildingOffice size={18} />
          <span className="font-medium">{job.companyId?.companyName}</span>
        </div>

        {/* Job Meta Info */}
        <div className="flex flex-wrap gap-6 text-gray-500 text-sm mt-4">
          <span className="flex items-center gap-1">
            <HiOutlineMapPin />
            {job.location}
          </span>

          <span className="flex items-center gap-1">
            <HiOutlineCurrencyDollar />
            {job.salary}
          </span>

          <span className="flex items-center gap-1">
            <HiOutlineBriefcase />
            {job.minExperience} - {job.maxExperience} years
          </span>

          <span className="flex items-center gap-1">
            <HiOutlineCalendar />
            Apply before {new Date(job.expiryDate).toLocaleDateString()}
          </span>
        </div>

        {/* Priority Badge */}
        {job.priorityLevel > 0 && (
          <div className="mt-4">
            <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
              Priority Job
            </span>
          </div>
        )}

        {/* Description */}
        <div className="mt-5">
          <h3 className="font-semibold text-gray-700 mb-2">Job Description</h3>

          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>
        <span className="text-sm text-gray-500 mt-4 block">
          Posted on {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Skill Match */}

      <div className="border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-2">Skill Match</h2>

        <p className="text-sm text-gray-500 mb-3">
          You match {matchedSkills.length} of {job.requiredSkills.length} skills
        </p>

        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full"
            style={{ width: `${matchPercentage}%` }}
          />
        </div>

        <p className="text-green-600 mt-2">{matchPercentage}% Match</p>
      </div>

      {/* Required Skills */}

      <div className="border rounded-xl p-6 mb-6">
        <h2 className="font-semibold mb-3">Required Skills</h2>

        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.map((skill, index) => {
            const matched = matchedSkills.includes(skill);

            return (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm
                ${matched ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </div>

      {/* Missing Skills Learning */}

      {resources.length > 0 && (
        <div className="border rounded-xl p-6 mb-6">
          <h2 className="font-semibold mb-4">Upskill — Learning Resources</h2>

          {resources.map((skill) => (
            <div key={skill._id} className="border rounded-lg p-4 mb-3">
              <p className="font-medium mb-2">{skill.name}</p>

              <a
                href={skill.learningLink}
                target="_blank"
                className="text-green-600 underline"
              >
                Learn {skill.name}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Apply Button */}

      {profile?.resumeUrl ? (
        alreadyApplied ? (
          <button
            disabled
            className="mt-4 w-auto bg-gray-100 text-gray-500 px-4 py-2 rounded-md text-sm cursor-not-allowed"
          >
            Applied
          </button>
        ) : (
          <button
            onClick={() => handleApply(job._id)}
            disabled={isApplying}
            className="mt-4 w-auto bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {isApplying ? "Applying..." : "Apply Job"}
          </button>
        )
      ) : (
        <button
          disabled
          className="mt-4 border border-red-500 text-red-500 px-4 py-2 rounded-md text-sm"
        >
          Upload Resume to Apply
        </button>
      )}
    </div>
  );
};

export default JobDetails;
