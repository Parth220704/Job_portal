import { Link, useLocation, useNavigate  } from "react-router-dom";
import {
  HiOutlineSquares2X2,
  HiOutlineBuildingOffice,
  HiOutlineDocumentPlus,
  HiOutlineBriefcase,
  HiOutlineUsers,
} from "react-icons/hi2";

import { FiBriefcase, FiLogOut } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";

import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const RecruiterNavbar = () => {

  const navigate = useNavigate();


  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    {
      name: "Dashboard",
      icon: <HiOutlineSquares2X2 size={18} />,
      path: "/",
    },
    {
      name: "Company Profile",
      icon: <HiOutlineBuildingOffice size={18} />,
      path: "/recruiter/company-profile",
    },
    {
      name: "Post Job",
      icon: <HiOutlineDocumentPlus size={18} />,
      path: "/recruiter/post-job",
    },
    {
      name: "My Jobs",
      icon: <HiOutlineBriefcase size={18} />,
      path: "/recruiter/my-jobs",
    },
    {
      name: "Applicants",
      icon: <HiOutlineUsers size={18} />,
      path: "/recruiter/applications",
    },
  ];

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">

      {/* Left */}
      <div className="flex items-center gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white">
            <FiBriefcase size={20} />
          </div>

          <span className="text-xl font-semibold text-gray-800">
            CarrierBridge
          </span>
        </Link>

        {/* Menu */}
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

      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Role */}
        <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          <HiOutlineUserCircle size={16} />
          {user?.role || "Recruiter"}
        </div>

        {/* Name */}
        <span className="text-gray-700 font-medium">
          {user?.name || "User"}
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

export default RecruiterNavbar;
