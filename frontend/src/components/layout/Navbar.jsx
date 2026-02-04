import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import './navbar.css'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div>
        {!isLoggedIn ? (
          <>
            <div className="navbar">
              <div className="navbar-left">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="logo"
                  className="navbar-logo"
                />
                <div className="navbar-title">
                  <b>CarrierBridge</b>
                </div>
              </div>

              <div className="navbar-right">
                <div className="navbar-signin"   onClick={() => navigate("/login")} >Sign In</div>
                <div className="navbar-getstarted" onClick={() => navigate("/signup")}>Get Started</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/dashboard">Item 1</Link>
            <Link to="/dashboard">Item 2</Link>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
