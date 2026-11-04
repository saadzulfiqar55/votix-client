import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getElections, deleteElection, transitionElection, openVoting, closeVoting, publishElection, getReadiness } from "../../api/elections";

const STATUS_FLOW = ["DRAFT", "CONFIGURATION", "NOMINATION", "CANDIDATES_FINALIZED", "READY", "VOTING_OPEN", "VOTING_CLOSED", "COUNTING", "RESULTS_VERIFICATION", "FINALIZED", "PUBLISHED"];

const STATUS_COLORS = {
  DRAFT: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  CONFIGURATION: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  NOMINATION: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  CANDIDATES_FINALIZED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  READY: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  VOTING_OPEN: "bg-green-500/20 text-green-300 border-green-500/30",
  VOTING_CLOSED: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  COUNTING: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  RESULTS_VERIFICATION: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  FINALIZED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  PUBLISHED: "bg-green-500/20 text-green-300 border-green-500/30",
  DELETED: "bg-red-500/20 text-red-300 border-red-500/30",
};

function getNextTransitions(status) {
  const idx = STATUS_FLOW.indexOf(status);
  if (idx === -1) return [];
  return STATUS_FLOW.slice(idx + 1, idx + 3);
}

export default function ElectionsManagement() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [readiness, setReadiness] = useState({});

  useEffect(() => { loadElections(); }, []);

  const loadElections = async () => {
    setLoading(true);
    try {
      const res = await getElections({});
      setElections(res.data.elections || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const doTransition = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await transitionElection(id, newStatus);
      await loadElections();
    } catch (e) { alert(e.response?.data?.message || "Transition failed"); }
    setActionLoading(null);
  };

  const doDelete = async (id) => {
    if (!confirm("Delete this election?")) return;
    setActionLoading(id);
    try {
      await deleteElection(id);
      await loadElections();
    } catch (e) { alert(e.response?.data?.message || "Delete failed"); }
    setActionLoading(null);
  };

  const checkReadiness = async (id) => {
    try {
      const res = await getReadiness(id);
      setReadiness(prev => ({ ...prev, [id]: res.data }));
    } catch (e) {
      setReadiness(prev => ({ ...prev, [id]: { error: e.response?.data?.message || "Check failed" } }));
    }
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
        <h1 className="text-2xl font-bold text-white">Elections Management</h1>
        <Link to="/admin/elections/new" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
          + New Election
        </Link>
      </div>

      {/* Lifecycle Legend */}
      <div className="glass rounded-xl p-4">
        <div className="text-slate-400 text-xs mb-2 font-medium uppercase tracking-wider">Election Lifecycle</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FLOW.map((s, i) => (
            <span key={s} className="flex items-center gap-1">
              <span className={`px-2 py-0.5 rounded text-[10px] border ${STATUS_COLORS[s]}`}>
                {s.replace(/_/g, " ")}
              </span>
              {i < STATUS_FLOW.length - 1 && <span className="text-slate-600 text-xs">→</span>}
            </span>
          ))}
        </div>
      </div>

      {elections.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🗳</div>
          <p className="text-slate-400">No elections found.</p>
          <Link to="/admin/elections/new" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
            Create your first election →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {elections.map((election) => {
            const next = getNextTransitions(election.status);
            const r = readiness[election.id];
            return (
              <div key={election.id} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-semibold">{election.name}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border ${STATUS_COLORS[election.status]}`}>
                        {election.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="text-slate-400 text-sm mt-1">
                      {election.type} • {election.constituencies?.length || 0} constituencies
                    </div>
                    {election.startDate && election.endDate && (
                      <div className="text-slate-500 text-xs mt-1">
                        {new Date(election.startDate).toLocaleDateString()} — {new Date(election.endDate).toLocaleDateString()}
                      </div>
                    )}

                    {/* Readiness Info */}
                    {r && !r.error && (
                      <div className="mt-3 p-3 bg-slate-800/30 rounded-lg text-xs space-y-1">
                        <div className="text-slate-400 font-medium mb-1">Readiness Check</div>
                        {r.checks?.map((c, i) => (
                          <div key={i} className={`flex items-center gap-2 ${c.ok ? "text-emerald-400" : "text-red-400"}`}>
                            <span>{c.ok ? "✓" : "✗"}</span>
                            <span>{c.label}</span>
                          </div>
                        ))}
                        {r.ready !== undefined && (
                          <div className={`mt-2 font-medium ${r.ready ? "text-emerald-400" : "text-amber-400"}`}>
                            {r.ready ? "✓ Ready to open voting" : "✗ Not ready — fix issues above"}
                          </div>
                        )}
                      </div>
                    )}
                    {r?.error && (
                      <div className="mt-3 text-xs text-red-400">{r.error}</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/elections/${election.id}/candidates`} className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-xs rounded-lg transition-all border border-slate-600/20">
                        Candidates
                      </Link>
                      <Link to={`/admin/elections/${election.id}/edit`} className="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-xs rounded-lg transition-all border border-slate-600/20">
                        Edit
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      {election.status !== "PUBLISHED" && election.status !== "DELETED" && (
                        <>
                          {next.length > 0 && (
                            <button
                              onClick={() => doTransition(election.id, next[0])}
                              disabled={actionLoading === election.id}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-all disabled:opacity-50"
                            >
                              {actionLoading === election.id ? "..." : `→ ${next[0].replace(/_/g, " ")}`}
                            </button>
                          )}
                          {election.status === "READY" && (
                            <button
                              onClick={() => checkReadiness(election.id)}
                              className="px-3 py-1.5 bg-cyan-600/80 hover:bg-cyan-500 text-white text-xs rounded-lg transition-all"
                            >
                              Check Readiness
                            </button>
                          )}
                          <button
                            onClick={() => doDelete(election.id)}
                            disabled={actionLoading === election.id}
                            className="px-3 py-1.5 bg-red-600/50 hover:bg-red-500/50 text-red-300 text-xs rounded-lg transition-all border border-red-500/20 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
