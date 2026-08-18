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

  const handleLogoClick = () => {
    if (user) {
      logout();
    }
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-slate-100 px-6 py-4 transition-all">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 text-2xl font-extrabold cursor-pointer tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent hover:opacity-90 transition"
          onClick={handleLogoClick}
        >
          <span className="text-xl">🗳️</span> Votix
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-4 text-sm font-medium">
          {/* User Logged In */}
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-slate-300">
                Hi, <strong className="text-white">{user.name || user.email}</strong>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
              >
                Logout
              </button>
            </div>
          )}

          {/* User NOT Logged In */}
          {!user && (
            <div className="flex items-center gap-3">
              {isHomePage && (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
                  >
                    Register
                  </Link>
                </>
              )}
              {isLoginPage && (
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
                >
                  Register
                </Link>
              )}
              {isRegisterPage && (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}