import { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice,
} from "react-icons/hi2";
import { FiFileText } from "react-icons/fi";

import {
  getAllRecruiters,
  getAllJobSeekers,
  getAllJobs,
  getAllApplications,
  getAllCompanies,
} from "../../../api/admin";

const Dashboard = () => {
  const [data, setData] = useState({
    recruiters: [],
    jobseekers: [],
    jobs: [],
    applications: [],
    companies: [],
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        recruitersRes,
        jobseekersRes,
        jobsRes,
        applicationsRes,
        companiesRes,
      ] = await Promise.all([
        getAllRecruiters(),
        getAllJobSeekers(),
        getAllJobs(),
        getAllApplications(),
        getAllCompanies(),
      ]);

      setData({
        recruiters: recruitersRes.data.recruiters,
        jobseekers: jobseekersRes.data.jobseekers,
        jobs: jobsRes.data.jobs,
        applications: applicationsRes.data.applications,
        companies: companiesRes.data.data,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 🔢 Calculations
  const totalUsers = data.recruiters.length + data.jobseekers.length;

  const recentJobs = [...data.jobs]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentApplications = [...data.applications]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const recentCompanies = [...data.companies]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Platform overview and insights</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Users"
          value={totalUsers}
          icon={<HiOutlineUsers />}
          bg="bg-blue-50"
        />

        <Card
          title="Jobs"
          value={data.jobs.length}
          icon={<HiOutlineBriefcase />}
          bg="bg-green-50"
        />

        <Card
          title="Applications"
          value={data.applications.length}
          icon={<FiFileText />}
          bg="bg-purple-50"
        />

        <Card
          title="Companies"
          value={data.companies.length}
          icon={<HiOutlineBuildingOffice />}
          bg="bg-blue-50"
        />
      </div>

      {/* Middle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">User Distribution</h3>

          <Bar
            label="Job Seekers"
            value={data.jobseekers.length}
            percent={(data.jobseekers.length / totalUsers) * 100}
            color="bg-green-400"
          />

          <Bar
            label="Recruiters"
            value={data.recruiters.length}
            percent={(data.recruiters.length / totalUsers) * 100}
            color="bg-blue-500"
          />
        </div>

        {/* Recent Jobs */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">Recent Jobs</h3>

          {recentJobs.map((job) => (
            <div
              key={job._id}
              className="flex justify-between items-center py-3 border-b"
            >
              {/* Left */}
              <div>
                <p className="text-sm font-medium text-gray-800">{job.title}</p>
                <p className="text-xs text-gray-500">
                  {job.companyId?.companyName || "N/A"}
                </p>
              </div>

              {/* Right (Status) */}
              <span
                className={`px-3 py-1 text-xs rounded-full font-medium
      ${
        job.status === "active"
          ? "bg-green-100 text-green-600"
          : "bg-gray-200 text-gray-600"
      }`}
              >
                {job.status}
              </span>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">Recent Applications</h3>

          {recentApplications.map((app) => (
            <div key={app._id} className="py-2 border-b">
              <p className="text-sm font-medium">{app.jobSeekerId?.name}</p>
              <p className="text-xs text-gray-500">{app.jobId?.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Companies */}
      <div className="bg-white p-5 rounded-xl shadow border">
        <h3 className="font-semibold mb-4">Recent Companies</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentCompanies.map((c) => (
            <div
              key={c._id}
              className="border p-3 rounded-lg flex items-center gap-2"
            >
              <HiOutlineBuildingOffice />
              <div>
                <p className="text-sm font-medium">{c.companyName}</p>
                <p className="text-xs text-gray-500">{c.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// 🔹 Reusable Components

const Card = ({ title, value, icon, bg }) => (
  <div className={`${bg} p-5 rounded-xl shadow border`}>
    <div className="flex justify-between mb-2">
      <span className="text-sm text-gray-600">{title}</span>
      {icon}
    </div>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

const Bar = ({ label, value, percent, color }) => (
  <div className="mb-3">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="bg-gray-200 h-2 rounded mt-1">
      <div
        className={`${color} h-2 rounded`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);
