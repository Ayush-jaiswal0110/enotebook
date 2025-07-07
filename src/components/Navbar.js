import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAdmin, setIsAdmin] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(true);
    navigate('/login');
  };

  useEffect(() => {
    // Fetch user info to check admin role
    const fetchUserRole = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/getuser", {
          method: "POST",
          headers: {
            "auth-token": localStorage.getItem("token"),
          },
        });
        const data = await res.json();
        setIsAdmin(data.isAdmin);
      } catch (error) {
        console.error("Failed to check admin:", error);
      }
    };

    if (localStorage.getItem("token")) {
      fetchUserRole();
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/">
          <button className="button" data-text="Awesome">
            <span className="actual-text">&nbsp;Enotebook&nbsp;</span>
            <span aria-hidden="true" className="hover-text">&nbsp;enotebook&nbsp;</span>
          </button>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === "/about" ? "active" : ""}`} to="/about">About</Link>
            </li>
            {localStorage.getItem('token') && (
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/kanban" ? "active" : ""}`} to="/kanban">Kanban Board</Link>
              </li>
            )}
            {localStorage.getItem("token") && isAdmin && (
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/activity-log" ? "active" : ""}`} to="/activity-log">
                  Activity Logs
                </Link>
              </li>
            )}
          </ul>

          {!localStorage.getItem('token') ? (
            <form className="d-flex" role="search">
              <Link className="custom-btn btn-1 mx-2" to="/login">Login</Link>
              <Link className="custom-btn btn-1 mx-2" to="/signup">SignUp</Link>
            </form>
          ) : (
            <button onClick={handleLogout} className="custom-btn btn-1 mx-2">Log-out</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
