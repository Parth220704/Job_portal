import { useEffect, useState } from "react";
import {
  HiOutlineBuildingOffice,
  HiOutlineMagnifyingGlass,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { getAllCompanies, updateCompanyStatus } from "../../../api/admin";
import toast from "react-hot-toast";

const ManageCompany = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await getAllCompanies();

      // 🔥 normalize data (important)
      const normalized = res.data.data.map((c) => ({
        ...c,
        companyName: c.companyName || "",
        industry: c.industry || "N/A",
        location: c.location || "N/A",
        companySize: c.companySize || "N/A",
        status: c.status || "inactive",
      }));

      setCompanies(normalized);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔍 Safe Search
  const filteredCompanies = companies.filter(
    (c) =>
      (c.companyName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.industry || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.userId?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.status || "").toLowerCase().includes(search.toLowerCase()),
  );

  // 🔥 Toggle
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    setCompanies((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)),
    );

    setLoadingId(id);

    try {
      await updateCompanyStatus(id, newStatus);

      toast.success(
        newStatus === "active" ? "Company activated" : "Company deactivated",
      );
    } catch (error) {
      console.error(error);

      setCompanies((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: currentStatus } : c)),
      );

      toast.error("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HiOutlineBuildingOffice className="text-blue-500" />
          Company Management
        </h1>
        <p className="text-gray-500 text-sm">
          View and manage all registered companies
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border p-6">
        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            All Companies ({filteredCompanies.length})
          </h2>

          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Companies..."
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
                <th className="text-left py-3 w-[25%]">Company</th>
                <th className="w-[12%] text-left">Industry</th>
                <th className="w-[15%] text-left">Location</th>
                <th className="w-[10%] text-left">Employees</th>
                <th className="w-[12%] text-left">Owner</th>
                <th className="w-[12%] text-left">Created</th>
                <th className="w-[7%] text-left">Status</th>
                <th className="w-[7%] text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCompanies.map((c) => (
                <tr
                  key={c._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* Company */}
                  <td className="py-4">
                    <div className="flex items-center gap-3 truncate">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                        <HiOutlineBuildingOffice size={18} />
                      </div>

                      <div className="truncate">
                        <p className="font-medium text-gray-800 truncate">
                          {c.companyName}
                        </p>

                        {c.website && (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-blue-500 flex items-center gap-1"
                          >
                            <HiOutlineGlobeAlt size={12} />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Industry */}
                  <td className="truncate">
                    <span className="bg-gray-100 px-3 py-1 text-xs rounded-full">
                      {c.industry}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="truncate text-gray-600 flex items-center gap-1 mt-6">
                    <HiOutlineMapPin size={14} />
                    {c.location}
                  </td>

                  {/* Employees */}
                  <td className="truncate">{c.companySize}</td>

                  {/* Owner */}
                  <td className="truncate">{c.userId?.name || "N/A"}</td>

                  {/* Created */}
                  <td className="truncate">
                    {c.createdAt
                      ? new Date(c.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium capitalize
                      ${
                        c.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  {/* Toggle */}
                  <td>
                    <button
                      onClick={() => toggleStatus(c._id, c.status)}
                      disabled={loadingId === c._id}
                      className={`w-11 h-6 flex items-center rounded-full transition duration-300
                      ${c.status === "active" ? "bg-blue-500" : "bg-gray-300"}
                      ${
                        loadingId === c._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-300
                        ${
                          c.status === "active"
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

        {/* Empty */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No companies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCompany;
