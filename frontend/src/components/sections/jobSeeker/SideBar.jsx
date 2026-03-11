import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineSparkles,
  HiOutlineClipboardDocumentList,
  HiOutlineUser
} from "react-icons/hi2";

import { NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r">

      {/* Navigation Title */}
      <div className="px-6 pt-6 pb-4 text-gray-400 text-sm font-semibold">
        NAVIGATION
      </div>

      <nav className="flex flex-col gap-1 px-3">

        <SidebarItem
          icon={<HiOutlineHome size={20} />}
          label="Dashboard"
          to="/"
        />

        <SidebarItem
          icon={<HiOutlineBriefcase size={20} />}
          label="Browse Jobs"
          to="/jobseeker/jobs"
        />

        <SidebarItem
          icon={<HiOutlineSparkles size={20} />}
          label="Best Matches"
          to="/jobseeker/matches"
        />

        <SidebarItem
          icon={<HiOutlineClipboardDocumentList size={20} />}
          label="My Applications"
          to="/jobseeker/applications"
        />

        <SidebarItem
          icon={<HiOutlineUser size={20} />}
          label="My Profile"
          to="/jobseeker/profile"
        />

      </nav>

    </div>
  );
};

export default SideBar;

const SidebarItem = ({ icon, label, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
        ${
          isActive
            ? "bg-green-100 text-green-700"
            : "text-gray-600 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};