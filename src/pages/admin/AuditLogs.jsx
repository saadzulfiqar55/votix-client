import { useEffect, useState } from "react";
import { getAuditLogs } from "../../api/auth";

const ACTION_COLORS = {
  REGISTER: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  LOGIN: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  LOGOUT: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  VOTE_CAST: "bg-green-500/20 text-green-300 border-green-500/30",
  CREATE_ELECTION: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  UPDATE_ELECTION: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  TRANSITION_ELECTION: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  OPEN_VOTING: "bg-green-500/20 text-green-300 border-green-500/30",
  CLOSE_VOTING: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  PUBLISH_ELECTION: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  DELETE_ELECTION: "bg-red-500/20 text-red-300 border-red-500/30",
  SUBMIT_STATION_RESULT: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  APPROVE_STATION_RESULT: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  RETURN_STATION_RESULT: "bg-red-500/20 text-red-300 border-red-500/30",
  FINALIZE_CONSTITUENCY_RESULT: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  IMPORT_VOTERS: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  CREATE_USER: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  UPDATE_USER: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  DELETE_USER: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAuditLogs()
      .then((r) => setLogs(r.data.logs || []))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? logs : logs.filter(l => l.action?.includes(filter));

  const getActionColor = (action) => {
    for (const [key, color] of Object.entries(ACTION_COLORS)) {
      if (action?.includes(key)) return color;
    }
    return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
          <p className="text-slate-400 mt-1">System activity and security trail</p>
        </div>
        <div className="text-slate-500 text-sm">{logs.length} entries</div>
      </div>

      {err && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{err}</div>
      )}

      {/* Quick Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "LOGIN", "VOTE", "ELECTION", "RESULT"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${
              filter === f ? "bg-indigo-600 text-white" : "bg-slate-700/50 text-slate-400 hover:text-white"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {/* Log Table */}
      <div className="glass rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-slate-400 text-sm">No audit entries found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700/30">
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Time</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Actor</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Action</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Target</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">Details</th>
                  <th className="text-left py-3 px-4 text-xs uppercase tracking-wider">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log._id || log.id} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-white text-sm">{log.actorEmail || "—"}</div>
                      <div className="text-slate-500 text-[10px] capitalize">{log.actorRole?.replace(/_/g, " ") || "—"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${getActionColor(log.action)}`}>
                        {log.action?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-sm">{log.targetType || "—"}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs max-w-[200px] truncate">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs">{log.ip || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
