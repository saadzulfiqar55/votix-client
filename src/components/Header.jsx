import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLink = (path, label, exact = false) => {
    const active = exact ? location.pathname === path : isActive(path);
    return (
      <Link
        to={path}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
          active
            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
            : "text-slate-400 hover:text-white hover:bg-slate-700/30"
        }`}
      >
        {label}
      </Link>
    );
  };

  const getRoleDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case "super_admin":
      case "election_admin":
        return "/admin";
      case "election_manager":
        return "/manager";
      case "polling_officer":
        return "/officer";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-slate-700/30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={user ? getRoleDashboard() : "/"} className="flex items-center gap-2 group">
            <span className="text-xl font-bold text-gradient">🗳 Votix</span>
          </Link>
        </div>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              {navLink(getRoleDashboard(), "Dashboard", true)}
              {user.role === "voter" && navLink("/vote", "Vote")}
              {navLink("/elections", "Elections")}
              {navLink("/results", "Results")}
              {(user.role === "super_admin" || user.role === "election_admin") && navLink("/admin", "Admin")}
              {user.role === "election_manager" && navLink("/manager", "Manager")}

              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700/30">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <span className="text-indigo-300 text-sm font-medium">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <div className="text-white text-sm font-medium leading-tight">{user.name}</div>
                  <div className="text-slate-500 text-[10px] leading-tight capitalize">{user.role?.replace(/_/g, " ")}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-xs transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              {navLink("/", "Home", true)}
              {location.pathname === "/login" ? (
                <Link to="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                  Register
                </Link>
              ) : location.pathname === "/register" ? (
                <Link to="/login" className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg text-sm font-medium transition-all border border-slate-600/30">
                  Login
                </Link>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-lg text-sm font-medium transition-all border border-slate-600/30">
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
