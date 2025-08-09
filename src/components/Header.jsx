// src/components/Header.jsx
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const loc = useLocation();

  const isHomePage = loc.pathname === "/";
  const isLoginPage = loc.pathname === "/login";
  const isRegisterPage = loc.pathname === "/register";

  return (
    <header className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold cursor-pointer">🗳️ Votix</div>

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
