import {
  HiOutlineUser,
  HiOutlineBuildingOffice,
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";

const RecruiterDashboard = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Welcome Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Post jobs and manage applications
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="flex items-center gap-2 mb-2">
            <HiOutlineUser size={22} />
            <h2 className="text-xl font-semibold">
              Profile Information
            </h2>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Your account details
          </p>

          <div className="space-y-3">

            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            

            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <span className="inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                {user?.role}
              </span>
            </div>

          </div>

        </div>

        {/* Company Profile */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="flex items-center gap-2 mb-2">
            <HiOutlineBuildingOffice size={22} />
            <h2 className="text-xl font-semibold">
              Company Profile
            </h2>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Manage your company information
          </p>

          <p className="text-gray-600 mb-4">
            Set up and manage your company profile for job seekers.
          </p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Company Profile
          </button>

        </div>

        {/* Post Job */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="flex items-center gap-2 mb-2">
            <HiOutlineBriefcase size={22} />
            <h2 className="text-xl font-semibold">
              Post a Job
            </h2>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Create new job listings
          </p>

          <p className="text-gray-600 mb-4">
            Post job vacancies and find the right candidates.
          </p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Post Job
          </button>

        </div>

        {/* My Jobs */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <h2 className="text-xl font-semibold mb-1">
            My Jobs
          </h2>

          <p className="text-gray-500 text-sm mb-4">
            Manage posted jobs
          </p>

          <p className="text-gray-600 mb-4">
            View, edit, and manage your job postings.
          </p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            View Jobs
          </button>

        </div>

        {/* Applications */}
        <div className="bg-white rounded-xl shadow-sm border p-6">

          <div className="flex items-center gap-2 mb-2">
            <HiOutlineClipboardDocumentList size={22} />
            <h2 className="text-xl font-semibold">
              Applications
            </h2>
          </div>

          <p className="text-gray-500 text-sm mb-4">
            Review job applications
          </p>

          <p className="text-gray-600 mb-4">
            View and manage applications from job seekers.
          </p>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            View Applications
          </button>

        </div>

      </div>

    </div>
  );
};

export default RecruiterDashboard;
