import {
  HiOutlineUser,
  HiOutlineBuildingOffice,
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
  HiOutlinePlusCircle,
} from "react-icons/hi2";

const RecruiterDashboard = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Gradient Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-400 text-white px-8 py-10 shadow">

        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name}! 👋
        </h1>

        <p className="text-blue-100 mt-1">
          Manage your jobs, applications, and company profile
        </p>

      </div>


      <div className="p-8">

        {/* Top Stats Row */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatCard
            icon={<HiOutlineBriefcase size={24} />}
            title="Total Jobs"
            value="12"
            color="from-blue-500 to-indigo-500"
          />

          <StatCard
            icon={<HiOutlineClipboardDocumentList size={24} />}
            title="Applications"
            value="48"
            color="from-green-500 to-emerald-500"
          />

          <StatCard
            icon={<HiOutlineUser size={24} />}
            title="Candidates"
            value="32"
            color="from-purple-500 to-pink-500"
          />

          <StatCard
            icon={<HiOutlinePlusCircle size={24} />}
            title="Active Jobs"
            value="5"
            color="from-orange-500 to-red-500"
          />

        </div> */}


        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Profile Card */}
          <DashboardCard
            icon={<HiOutlineUser size={22} />}
            title="Profile Information"
            description="Your personal account details"
            button="Edit Profile"
          >

            <Info label="Name" value={user?.name} />
            <Info label="Email" value={user?.email} />
           

            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className="inline-block mt-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                {user?.role}
              </span>
            </div>

          </DashboardCard>


          {/* Company Card */}
          <DashboardCard
            icon={<HiOutlineBuildingOffice size={22} />}
            title="Company Profile"
            description="Manage your company information"
            button="Company Profile"
            to="/recruiter/company-profile"
          >
            <p className="text-gray-600 text-sm">
              Update company details, logo, and branding.
            </p>
          </DashboardCard>


          {/* Post Job */}
          <DashboardCard
            icon={<HiOutlineBriefcase size={22} />}
            title="Post a Job"
            description="Create new job listings"
            button="Post Job"
             to="/recruiter/post-job"
          >
            <p className="text-gray-600 text-sm">
              Post vacancies and attract the best candidates.
            </p>
          </DashboardCard>


          {/* My Jobs */}
          <DashboardCard
            icon={<HiOutlineBriefcase size={22} />}
            title="My Jobs"
            description="Manage job postings"
            button="View Jobs"
            to="/recruiter/my-jobs"
          >
            <p className="text-gray-600 text-sm">
              Edit, close, or update job listings.
            </p>
          </DashboardCard>


          {/* Applications */}
          <DashboardCard
            icon={<HiOutlineClipboardDocumentList size={22} />}
            title="Applications"
            description="Review candidate applications"
            button="View Applications"
             to="/recruiter/applications"
          >
            <p className="text-gray-600 text-sm">
              Track and manage incoming applications.
            </p>
          </DashboardCard>

        </div>

      </div>

    </div>
  );
};

export default RecruiterDashboard;



/* Reusable Components */


const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between">

    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>

    <div className={`p-3 rounded-lg text-white bg-gradient-to-r ${color}`}>
      {icon}
    </div>

  </div>
);



import { useNavigate } from "react-router-dom";

const DashboardCard = ({ icon, title, description, button, to, children }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">

      <div className="flex items-center gap-2 mb-2 text-gray-800">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      <p className="text-gray-500 text-sm mb-4">
        {description}
      </p>

      <div className="space-y-3 mb-4">
        {children}
      </div>

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
