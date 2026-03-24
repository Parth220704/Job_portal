import { useEffect, useState } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineUser,
  HiOutlineBriefcase,
  HiOutlineBuildingOffice,
} from "react-icons/hi2";
import { getAllApplications } from "../../../api/admin";

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getAllApplications();
      setApplications(res.data.applications);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔍 Search filter
  const filteredApps = applications.filter(
    (app) =>
      app.jobSeekerId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      app.jobId?.title?.toLowerCase().includes(search.toLowerCase()) ||
      app.jobId?.companyId?.companyName
        ?.toLowerCase()
        .includes(search.toLowerCase()),
  );

  // 🎨 Status color
  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "reviewed":
        return "bg-gray-200 text-gray-600";
      case "shortlisted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Applications</h1>
        <p className="text-gray-500 text-sm">
          Overview of all job applications on the platform
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-md border p-6">
        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Applications ({filteredApps.length})
          </h2>

          {/* Search */}
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed border-collapse">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="text-left py-3 w-[20%]">Applicant</th>
                <th className="w-[20%] text-left">Email</th>
                <th className="w-[18%] text-left">Job Title</th>
                <th className="w-[18%] text-left">Company</th>
                <th className="w-[12%] text-left">Status</th>
                <th className="w-[12%] text-left">Applied</th>
              </tr>
            </thead>

            <tbody>
              {filteredApps.map((app) => (
                <tr
                  key={app._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Applicant */}
                  <td className="py-4">
                    <div className="flex items-center gap-3 truncate">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <HiOutlineUser size={16} />
                      </div>
                      <span className="font-medium text-gray-800 truncate">
                        {app.jobSeekerId?.name || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="truncate text-gray-600">
                    {app.jobSeekerId?.email || "N/A"}
                  </td>

                  {/* Job Title */}
                  <td className="truncate">
                    <div className="flex items-center gap-2">
                      <HiOutlineBriefcase size={14} className="text-gray-400" />
                      <span className="truncate">
                        {app.jobId?.title || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="truncate">
                    <div className="flex items-center gap-2">
                      <HiOutlineBuildingOffice
                        size={14}
                        className="text-gray-400"
                      />
                      <span className="truncate">
                        {app.jobId?.companyId?.companyName || "N/A"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${getStatusStyle(
                        app.status,
                      )}`}
                    >
                      {app.status}
                    </span>
                  </td>

                  {/* Applied */}
                  <td className="text-gray-600">
                    {app.appliedAt
                      ? new Date(app.appliedAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
