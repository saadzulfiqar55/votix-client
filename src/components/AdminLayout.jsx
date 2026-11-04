import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_LINKS = [
  { to: "/admin", label: "Dashboard", icon: "📊", exact: true },
  { to: "/admin/elections", label: "Elections", icon: "🗳" },
  { to: "/admin/constituencies", label: "Constituencies", icon: "📍" },
  { to: "/admin/voters", label: "Voters", icon: "👤" },
  { to: "/admin/results", label: "Results", icon: "🏆" },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: "📋" },
];

const MANAGER_LINKS = [
  { to: "/manager", label: "Dashboard", icon: "📊", exact: true },
  { to: "/manager/review", label: "Review Results", icon: "🔍" },
  { to: "/admin/elections", label: "Elections", icon: "🗳" },
  { to: "/admin/results", label: "Results", icon: "🏆" },
];

const OFFICER_LINKS = [
  { to: "/officer", label: "Dashboard", icon: "📊", exact: true },
  { to: "/results", label: "Results", icon: "🏆" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path, exact) => {
    return exact ? location.pathname === path : location.pathname.startsWith(path) && location.pathname !== path;
  };

  const links = user?.role === "election_manager" ? MANAGER_LINKS :
                user?.role === "polling_officer" ? OFFICER_LINKS :
                ADMIN_LINKS;

  const branding = user?.role === "election_manager" ? "Manager Panel" :
                   user?.role === "polling_officer" ? "Officer Panel" :
                   "Admin Panel";

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 glass-strong border-r border-slate-700/30 flex flex-col p-4 flex-shrink-0">
        <div className="mb-6">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-medium">{branding}</div>
          <div className="text-white text-sm mt-1 truncate">{user?.email}</div>
          <div className="text-slate-600 text-[10px] mt-0.5 capitalize">{user?.role?.replace(/_/g, " ")}</div>
        </div>

        <nav className="flex-1 space-y-1">
          {links.map((link) => {
            const active = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  active
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/30 border border-transparent"
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-700/30 mt-4">
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-xs px-3 py-2 rounded-lg transition-all mb-2">
            <span>←</span>
            <span>Back to Site</span>
          </Link>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-2 text-slate-500 hover:text-red-400 text-xs px-3 py-2 rounded-lg transition-all hover:bg-red-500/10"
          >
            <span>⏻</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
