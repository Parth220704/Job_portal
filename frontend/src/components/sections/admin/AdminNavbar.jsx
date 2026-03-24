import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineBriefcase,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineBuildingOffice
} from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    {
      name: "Dashboard",
      icon: <HiOutlineSquares2X2 size={18} />,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: <HiOutlineUsers size={18} />,
      path: "/admin/users",
    },
    {
      name: "Companies",
      icon: <HiOutlineBuildingOffice size={18} />,
      path: "/admin/companies",
    },
    {
      name: "Jobs",
      icon: <HiOutlineBriefcase size={18} />,
      path: "/admin/jobs",
    },
    {
      name: "Applications",
      icon: <HiOutlineDocumentText size={18} />,
      path: "/admin/applications",
    },
  ];

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">

      {/* Left - Logo */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-600 text-white">
          🛡️
        </div>

        <span className="text-xl font-semibold text-gray-800">
          Admin Panel
        </span>
      </div>

      {/* Center - Menu */}
      <div className="flex items-center gap-2">

        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition

              ${
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }
              `}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Role Badge */}
        <div className="flex items-center gap-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          <HiOutlineUserCircle size={16} />
          Admin
        </div>

        {/* Name */}
        <span className="text-gray-700 font-medium">
          {user?.name || "Admin"}
        </span>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="p-2 border rounded-lg hover:bg-gray-100 transition"
        >
          <FiLogOut size={18} />
        </button>

      </div>
    </nav>
  );
};

export default AdminNavbar;