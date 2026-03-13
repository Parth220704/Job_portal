import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  HiOutlineMapPin,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineGlobeAlt,
  HiOutlineBriefcase,
  HiArrowLeft,
} from "react-icons/hi2";

import { getCompanyById, getCompanyJobs } from "../../../api/company";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadCompany();
    loadJobs();
  }, []);

  const loadCompany = async () => {
    const data = await getCompanyById(id);

    setCompany(data);
  };

  const loadJobs = async () => {
    const data = await getCompanyJobs(id);

    setJobs(data);
  };

  if (!company) return null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-4">
        <a
          href="/jobseeker/jobs"
          className="text-green-600 flex items-center gap-1"
        >
          <HiArrowLeft />
          Back to Browse Jobs
        </a>
      </div>

      {/* Company Card */}

      <div className="bg-white border rounded-xl p-6 shadow-sm mb-8">
        <div className="flex gap-5">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-lg">
            <HiOutlineBriefcase size={28} className="text-green-600" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">{company.companyName}</h1>

            <p className="text-gray-500">{company.industry}</p>

            <p className="text-gray-600 mt-2">{company.description}</p>

            <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <HiOutlineMapPin />
                {company.location}
              </span>

              <span className="flex items-center gap-1">
                <HiOutlineUsers />
                {company.companySize} employees
              </span>

              <span className="flex items-center gap-1">
                <HiOutlineCalendar />
                Founded {company.foundedYear}
              </span>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  className="flex items-center gap-1 text-green-600"
                >
                  <HiOutlineGlobeAlt />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Open Jobs */}

      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <HiOutlineBriefcase />
          Open Positions
          <span className="text-gray-500 text-sm">({jobs.length})</span>
        </h2>

        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              onClick={() => navigate(`/jobseeker/jobs/${job._id}`)}
              key={job._id}
              className="border rounded-lg p-4 flex justify-between items-center hover:shadow-sm transition cursor-pointer hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold hover:text-green-600">
                  {job.title}
                </h3>

                <p className="text-sm text-gray-500">
                  <span className="mr-3">📍 {job.location}</span>

                  <span>
                    {job.minExperience}-{job.maxExperience} yrs
                  </span>
                </p>
              </div>

              <span className="text-sm border px-3 py-1 rounded-full">
                Full-Time
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
