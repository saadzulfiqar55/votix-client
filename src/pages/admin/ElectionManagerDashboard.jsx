import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getElections, getConstituencyResults, getStationResults, reviewStationResult } from "../../api/elections";

const STATUS_COLORS = {
  DRAFT: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  CONFIGURATION: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  NOMINATION: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  CANDIDATES_FINALIZED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  READY: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  VOTING_OPEN: "bg-green-500/20 text-green-300 border-green-500/30 animate-pulse",
  VOTING_CLOSED: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  COUNTING: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  RESULTS_VERIFICATION: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  FINALIZED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  PUBLISHED: "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function ElectionManagerDashboard() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [stationResults, setStationResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const eRes = await getElections({});
      setElections(eRes.data.elections || []);

      const pendingResults = [];
      for (const election of eRes.data.elections || []) {
        if (["COUNTING", "RESULTS_VERIFICATION"].includes(election.status)) {
          for (const cid of user?.assignedConstituencies || []) {
            try {
              const rRes = await getStationResults(election.id, cid);
              for (const r of rRes.data.results || []) {
                if (r.status === "SUBMITTED") pendingResults.push({ ...r, electionName: election.name, electionId: election.id });
              }
            } catch (e) { /* skip */ }
          }
        }
      }
      setStationResults(pendingResults);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleReview = async (resultId, action) => {
    setReviewing(resultId);
    try {
      await reviewStationResult(resultId, action, action === "return" ? returnReason : undefined);
      setStationResults(prev => prev.filter(r => r._id !== resultId));
      setReturnReason("");
    } catch (e) {
      alert(e.response?.data?.message || "Review failed");
    }
    setReviewing(null);
  };

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
          <h1 className="text-2xl font-bold text-white">Election Manager Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Managing {user?.assignedConstituencies?.length || 0} constituencies
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="text-slate-400 text-sm">Assigned Elections</div>
          <div className="text-2xl font-bold text-white mt-1">{elections.length}</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-slate-400 text-sm">Open for Voting</div>
          <div className="text-2xl font-bold text-green-400 mt-1">
            {elections.filter(e => e.status === "VOTING_OPEN").length}
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-slate-400 text-sm">Pending Review</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stationResults.length}</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-slate-400 text-sm">Constituencies</div>
          <div className="text-2xl font-bold text-white mt-1">{user?.assignedConstituencies?.length || 0}</div>
        </div>
      </div>

      {/* Pending Station Results to Review */}
      {stationResults.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">⚠</span> Results Pending Review
          </h2>
          <div className="space-y-3">
            {stationResults.map((r) => (
              <div key={r._id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium">{r.electionName}</div>
                    <div className="text-slate-400 text-sm">
                      Station: {r.pollingStationId?.code || "N/A"} — {r.seatType}
                    </div>
                    <div className="text-slate-500 text-xs mt-1">
                      Total ballots: {r.totalBallots} | Rejected: {r.rejectedVotes}
                    </div>
                    <div className="text-slate-500 text-xs">
                      Results: {r.results?.map(cr => `${cr.votes} votes`).join(", ")}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(r._id, "approve")}
                      disabled={reviewing === r._id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-all disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Return reason:");
                        if (reason) handleReview(r._id, "return");
                      }}
                      disabled={reviewing === r._id}
                      className="px-3 py-1.5 bg-red-600/80 hover:bg-red-500 text-white text-sm rounded-lg transition-all disabled:opacity-50"
                    >
                      Return
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Elections List */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-indigo-400">🏛</span> Elections
        </h2>
        {elections.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-slate-400 text-sm">No elections assigned yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {elections.map((election) => (
              <Link
                key={election.id}
                to={`/admin/elections/${election.id}/candidates`}
                className="block p-4 bg-slate-800/30 rounded-lg border border-slate-700/20 hover:border-indigo-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-medium">{election.name}</div>
                    <div className="text-slate-400 text-sm">{election.type}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs border ${STATUS_COLORS[election.status] || "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}>
                    {election.status.replace(/_/g, " ")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
