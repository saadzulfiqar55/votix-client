import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getElections, getUsers, getConstituencies, getGlobalResults, getProvinces, getParties } from "../../api/elections";

const STAT_CARDS = [
  { key: "elections", label: "Total Elections", color: "indigo", icon: "🗳" },
  { key: "active", label: "Voting Open", color: "green", icon: "🟢" },
  { key: "counting", label: "In Counting", color: "orange", icon: "📊" },
  { key: "published", label: "Published", color: "emerald", icon: "✅" },
  { key: "voters", label: "Voters", color: "blue", icon: "👤" },
  { key: "admins", label: "Managers & Admins", color: "purple", icon: "🛡" },
  { key: "constituencies", label: "Constituencies", color: "cyan", icon: "📍" },
  { key: "provinces", label: "Provinces", color: "rose", icon: "🗺" },
];

function DashboardCard({ label, value, color, icon }) {
  const colors = {
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/20",
    green: "from-green-500/20 to-green-600/10 border-green-500/20",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/20",
    rose: "from-rose-500/20 to-rose-600/10 border-rose-500/20",
  };
  return (
    <div className={`rounded-xl p-5 bg-gradient-to-br ${colors[color]} border`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [eRes, uRes, cRes, gRes, pRes, ptRes] = await Promise.allSettled([
          getElections({}),
          getUsers(),
          getConstituencies(),
          getGlobalResults(),
          getProvinces(),
          getParties(),
        ]);

        const elections = eRes.status === "fulfilled" ? eRes.value.data.elections || [] : [];
        const users = uRes.status === "fulfilled" ? uRes.value.data.users || [] : [];

        setStats({
          elections: elections.length,
          active: elections.filter(e => e.status === "VOTING_OPEN").length,
          counting: elections.filter(e => ["COUNTING", "RESULTS_VERIFICATION"].includes(e.status)).length,
          published: elections.filter(e => e.status === "PUBLISHED").length,
          voters: users.filter(u => u.role === "voter").length,
          admins: users.filter(u => ["election_manager", "election_admin", "super_admin"].includes(u.role)).length,
          constituencies: cRes.status === "fulfilled" ? (cRes.value.data.constituencies || []).length : 0,
          provinces: pRes.status === "fulfilled" ? (pRes.value.data.provinces || []).length : 0,
        });
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">System overview and management</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STAT_CARDS.map((card) => (
          <DashboardCard key={card.key} label={card.label} value={stats[card.key] || 0} color={card.color} icon={card.icon} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/elections/new" className="glass rounded-xl p-5 hover:border-indigo-500/30 border border-transparent transition-all group">
          <div className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">Create Election</div>
          <div className="text-slate-400 text-sm mt-1">Set up a new election with lifecycle management</div>
        </Link>
        <Link to="/admin/elections" className="glass rounded-xl p-5 hover:border-green-500/30 border border-transparent transition-all group">
          <div className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors">Manage Elections</div>
          <div className="text-slate-400 text-sm mt-1">Transition elections through lifecycle stages</div>
        </Link>
        <Link to="/admin/results" className="glass rounded-xl p-5 hover:border-purple-500/30 border border-transparent transition-all group">
          <div className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">View Results</div>
          <div className="text-slate-400 text-sm mt-1">Constituency-wise results with margins</div>
        </Link>
        <Link to="/admin/voters" className="glass rounded-xl p-5 hover:border-cyan-500/30 border border-transparent transition-all group">
          <div className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">Voter Management</div>
          <div className="text-slate-400 text-sm mt-1">Manage voter registrations and assignments</div>
        </Link>
        <Link to="/admin/constituencies" className="glass rounded-xl p-5 hover:border-rose-500/30 border border-transparent transition-all group">
          <div className="text-lg font-semibold text-white group-hover:text-rose-300 transition-colors">Constituencies</div>
          <div className="text-slate-400 text-sm mt-1">Manage provinces, districts, and constituencies</div>
        </Link>
        <Link to="/admin/audit-logs" className="glass rounded-xl p-5 hover:border-amber-500/30 border border-transparent transition-all group">
          <div className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors">Audit Logs</div>
          <div className="text-slate-400 text-sm mt-1">View system activity and security logs</div>
        </Link>
      </div>
    </div>
  );
}
