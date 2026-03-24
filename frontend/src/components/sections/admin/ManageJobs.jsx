import { useEffect, useState } from "react";
import {
  HiOutlineBriefcase,
  HiOutlineMagnifyingGlass,
  HiOutlineBuildingOffice,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { getAllJobs, updateJobStatus } from "../../../api/admin";
import toast from "react-hot-toast";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getAllJobs();

      // 🔥 normalize
      const normalized = res.data.jobs.map((j) => ({
        ...j,
        title: j.title || "",
        companyName: j.companyId?.companyName || "N/A",
        location: j.location || "N/A",
        salary: j.salary || "N/A",
        experience: `${j.minExperience ?? 0} - ${j.maxExperience ?? 0} yrs`,
        status: j.status || "inactive",
      }));

      setJobs(normalized);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔍 Search
  const filteredJobs = jobs.filter((j) =>
    (j.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (j.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
    (j.location || "").toLowerCase().includes(search.toLowerCase()) ||
    (j.status || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    setJobs((prev) =>
      prev.map((job) =>
        job._id === id ? { ...job, status: newStatus } : job
      )
    );

    setLoadingId(id);

    try {
      await updateJobStatus(id, newStatus);

      toast.success(
        newStatus === "active" ? "Job activated" : "Job deactivated"
      );
    } catch (error) {
      console.error(error);

      setJobs((prev) =>
        prev.map((job) =>
          job._id === id ? { ...job, status: currentStatus } : job
        )
      );

      toast.error("Failed to update job");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HiOutlineBriefcase className="text-blue-500" />
          Job Management
        </h1>
        <p className="text-gray-500 text-sm">
          View and moderate all job postings
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border p-6">
        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            All Jobs ({filteredJobs.length})
          </h2>

          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
  <table className="w-full text-sm table-fixed border-collapse">
    <thead>
      <tr className="text-gray-500 border-b">
        <th className="text-left py-3 w-[20%]">Title</th>
        <th className="w-[15%] text-left">Company</th>
        <th className="w-[15%] text-left">Location</th>
        <th className="w-[10%] text-left">Salary</th>
        <th className="w-[10%] text-left">Experience</th>
        <th className="w-[10%] text-left">Applicants</th>
        <th className="w-[10%] text-left">Posted</th>
        <th className="w-[5%] text-left">Status</th>
        <th className="w-[5%] text-left">Action</th>
      </tr>
    </thead>

    <tbody>
      {filteredJobs.map((job) => (
        <tr key={job._id} className="border-b hover:bg-gray-50">

          {/* Title */}
          <td className="py-4">
            <div className="flex items-center gap-3 truncate">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <HiOutlineBriefcase size={18} />
              </div>
              <span className="font-medium truncate">
                {job.title}
              </span>
            </div>
          </td>

          {/* Company */}
          <td className="truncate">
            {job.companyId?.companyName || "N/A"}
          </td>

          {/* Location */}
          <td className="truncate">
            {job.location || "N/A"}
          </td>

          {/* Salary */}
          <td>{job.salary || "N/A"}</td>

          {/* Experience */}
          <td>
            {job.minExperience ?? 0} - {job.maxExperience ?? 0} yrs
          </td>

          {/* Applicants 🔥 */}
          <td>
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
              {job.applicants || 0} Applied
            </span>
          </td>

          {/* Posted */}
          <td>
            {job.createdAt
              ? new Date(job.createdAt).toLocaleDateString()
              : "N/A"}
          </td>

          {/* Status */}
          <td>
            <span
              className={`px-2 py-1 text-xs rounded-full
              ${
                job.status === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {job.status}
            </span>
          </td>

          {/* Toggle */}
          <td>
            <button
              onClick={() =>
                toggleStatus(job._id, job.status)
              }
              disabled={loadingId === job._id}
              className={`w-10 h-5 flex items-center rounded-full
              ${
                job.status === "active"
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }
              ${
                loadingId === job._id
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transform
                ${
                  job.status === "active"
                    ? "translate-x-5"
                    : "translate-x-1"
                }`}
              />
            </button>
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

export default ManageJobs;