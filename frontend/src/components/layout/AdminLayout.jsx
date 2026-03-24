import AdminNavbar from "../sections/admin/AdminNavbar";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Footer from "./Footer";

const RecruiterLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <AdminNavbar user={user} logout={logout} />

      <main className="bg-gray-50 min-h-screen p-6">
        <Outlet />
      </main>

      <Footer />
    </>
  );
};

export default RecruiterLayout;
