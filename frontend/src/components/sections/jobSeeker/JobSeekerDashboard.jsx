import {
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineSparkles,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";

const JobSeekerDashboard = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white px-8 py-10 shadow">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}! 👋</h1>

        <p className="text-blue-100 mt-1">Search and apply for jobs</p>
      </div>

      <div className="p-8">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <DashboardCard
            icon={<HiOutlineUser size={22} />}
            title="Profile Information"
            description="Your account details"
          >
            <Info label="Full Name" value={user?.name} />
            <Info label="Email" value={user?.email} />

            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className="inline-block mt-1 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                Job Seeker
              </span>
            </div>
          </DashboardCard>

          {/* Find Jobs */}
          <DashboardCard
            icon={<HiOutlineBriefcase size={22} />}
            title="Find Jobs"
            description="Search for opportunities"
            button="Browse Jobs"
            to="/jobseeker/jobs"
          >
            <p className="text-gray-600 text-sm">
              Browse and apply for jobs that match your skills.
            </p>
          </DashboardCard>

          {/* Best Matches */}
          <DashboardCard
            icon={<HiOutlineSparkles size={22} />}
            title="Best Matches"
            description="Jobs matching your skills"
            button="View Matches"
            to="/jobseeker/matches"
          >
            <p className="text-gray-600 text-sm">
              See jobs that match your profile skills.
            </p>
          </DashboardCard>

          {/* My Applications */}
          <DashboardCard
            icon={<HiOutlineClipboardDocumentList size={22} />}
            title="My Applications"
            description="Track your applications"
            button="My Applications"
            to="/jobseeker/applications"
          >
            <p className="text-gray-600 text-sm">
              View the status of your job applications.
            </p>
          </DashboardCard>

          {/* My Profile */}
          <DashboardCard
            icon={<HiOutlineUser size={22} />}
            title="My Profile"
            description="Manage your skills & info"
            button="Edit Profile"
            to="/jobseeker/profile"
          >
            <p className="text-gray-600 text-sm">
              Update your profile and skills for better matches.
            </p>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;

import { useNavigate } from "react-router-dom";

const DashboardCard = ({ icon, title, description, button, to, children }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
      <div className="flex items-center gap-2 mb-2 text-gray-800">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <p className="text-gray-500 text-sm mb-4">{description}</p>

      <div className="space-y-3 mb-4">{children}</div>

      <button
        onClick={() => navigate(to)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
      >
        {button}
      </button>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);
