import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiBriefcase, FiLogOut } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
      
      {!isLoggedIn ? (

        // NOT LOGGED IN NAVBAR
        <div className="flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center gap-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="logo"
              className="h-10 w-10"
            />
            <h1 className="text-xl font-semibold text-gray-800">
              CarrierBridge
            </h1>
          </div>

          {/* Right */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>

        </div>

      ) : (

        // LOGGED IN NAVBAR
        <div className="flex justify-between items-center">

          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white">
              <FiBriefcase size={22} />
            </div>

            <h1 className="text-xl font-semibold text-gray-800">
              Job Portal
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">

            {/* Role Badge */}
            <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <HiOutlineUserCircle size={18} />
              {user?.role || "Recruiter"}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <FiLogOut size={18} />
              Logout
            </button>

          </div>

        </div>

      )}

    </nav>
  );
};

export default Navbar;