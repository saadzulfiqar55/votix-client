// src/components/Header.jsx
import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const loc = useLocation();
  const navigate = useNavigate();

  const isHomePage = loc.pathname === "/";
  const isLoginPage = loc.pathname === "/login";
  const isRegisterPage = loc.pathname === "/register";

  // ✅ Handle logo click
  const handleLogoClick = () => {
    if (user) {
      logout(); // clears user + token
    }
    navigate("/"); // redirect to homepage
  };

  return (
    <header className="bg-black text-white px-6 py-5 flex justify-between items-center">
      {/* Logo - clickable */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={handleLogoClick}
      >
        🗳️ Votix
      </div>

      <div className="flex items-center gap-4">
        {/* If user is logged in */}
        {user && (
          <>
            <span>Hi, {user.name || user.email}</span>
            <button
              onClick={logout}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

        {/* If user is NOT logged in */}
        {!user && (
          <>
            {isHomePage && (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </>
            )}
            {isLoginPage && (
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            )}
            {isRegisterPage && (
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            )}
          </>
        )}
      </div>
    </header>
  );
}
