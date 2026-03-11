import Navbar from "./Navbar";
import JobSeekerSidebar from "../../components/sections/jobSeeker/SideBar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Footer from "./Footer";

const JobSeekerLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>

        <Navbar user={user} logout={logout} />
      {/* Sidebar + Content */}
      <div className="flex min-h-screen bg-gray-50">

        {/* Sidebar */}
        <JobSeekerSidebar />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>

      </div>

      <Footer />
    </>
  );
};

export default JobSeekerLayout;