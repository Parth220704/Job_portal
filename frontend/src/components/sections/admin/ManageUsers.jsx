import { useEffect, useState } from "react";
import {
  HiOutlineUsers,
  HiOutlineMagnifyingGlass,
  HiOutlineUserCircle,
} from "react-icons/hi2";
import {
  getAllRecruiters,
  getAllJobSeekers,
  updateUserStatus,
} from "../../../api/admin";
import toast from "react-hot-toast";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const r = await getAllRecruiters();
      const j = await getAllJobSeekers();

      const recruiters = r.data.recruiters.map((u) => ({ ...u }));
      const jobseekers = j.data.jobseekers.map((u) => ({ ...u }));

      setUsers([...recruiters, ...jobseekers]);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔍 Search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.status.toLowerCase().includes(search.toLowerCase()),
  );

  // 🔥 Toggle
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    // optimistic UI
    setUsers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, status: newStatus } : user,
      ),
    );

    setLoadingId(id);

    try {
      await updateUserStatus(id, newStatus);

      toast.success(
        newStatus === "active"
          ? "User activated successfully"
          : "User blocked successfully",
      );
    } catch (error) {
      console.error(error);

      // revert
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: currentStatus } : user,
        ),
      );

      toast.error("Something went wrong");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HiOutlineUsers className="text-blue-500" />
          User Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage all users in your platform
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md border p-6">
        {/* Top */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Users ({filteredUsers.length})
          </h2>

          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search Users..."
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
                <th className="text-left py-3 w-[30%]">User</th>
                <th className="text-left w-[30%]">Email</th>
                <th className="text-left w-[15%]">Role</th>
                <th className="text-left w-[15%]">Status</th>
                <th className="text-left w-[10%]">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {/* User */}
                  <td className="py-4">
                    <div className="flex items-center gap-3 truncate">
                      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                        <HiOutlineUserCircle size={18} />
                      </div>
                      <span className="truncate font-medium text-gray-800">
                        {user.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="truncate text-gray-600">{user.email}</td>

                  {/* Role */}
                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium capitalize
                      ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-600"
                          : user.role === "recruiter"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium capitalize
                      ${
                        user.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* Toggle */}
                  <td>
                    <button
                      onClick={() => toggleStatus(user._id, user.status)}
                      disabled={loadingId === user._id}
                      className={`w-11 h-6 flex items-center rounded-full transition duration-300
                      ${
                        user.status === "active" ? "bg-blue-500" : "bg-gray-300"
                      }
                      ${
                        loadingId === user._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition duration-300
                        ${
                          user.status === "active"
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

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
