import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getElections, getStationResults, reviewStationResult } from "../../api/elections";

const STATUS_COLORS = {
  DRAFT: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  SUBMITTED: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  APPROVED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  FINALIZED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  CORRECTION_REQUIRED: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function ResultReview() {
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getElections({});
        setElections(res.data.elections || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedElection) { setResults([]); return; }
    async function loadResults() {
      try {
        const allResults = [];
        for (const cid of user?.assignedConstituencies || []) {
          for (const seatType of ["MNA", "MPA"]) {
            try {
              const res = await getStationResults(selectedElection, cid, seatType);
              for (const r of res.data.results || []) {
                allResults.push({ ...r, electionId: selectedElection });
              }
            } catch (e) { /* skip */ }
          }
        }
        setResults(allResults);
      } catch (e) { console.error(e); }
    }
    loadResults();
  }, [selectedElection, user]);

  const handleReview = async (resultId, action) => {
    const reason = action === "return" ? prompt("Return reason (required):") : undefined;
    if (action === "return" && !reason) return;
    setReviewing(resultId);
    try {
      await reviewStationResult(resultId, action, reason);
      setResults(prev => prev.filter(r => r._id !== resultId));
    } catch (e) {
      alert(e.response?.data?.message || "Review failed");
    }
    setReviewing(null);
  };

  const filterByStatus = (status) => results.filter(r => r.status === status);
  const submitted = filterByStatus("SUBMITTED");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Review Station Results</h1>
        <p className="text-slate-400 mt-1">Approve or return polling station result submissions</p>
      </div>

      {/* Election Selector */}
      <div className="glass rounded-xl p-4">
        <label className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-2 block">Select Election</label>
        <select
          value={selectedElection || ""}
          onChange={(e) => setSelectedElection(e.target.value || null)}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white focus:outline-none focus:border-indigo-500/50"
        >
          <option value="">— Choose election —</option>
          {elections.map(e => (
            <option key={e.id} value={e.id}>{e.name} ({e.status.replace(/_/g, " ")})</option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {selectedElection && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass rounded-xl p-4">
            <div className="text-slate-400 text-xs">Pending Review</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{submitted.length}</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-slate-400 text-xs">Approved</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{filterByStatus("APPROVED").length}</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-slate-400 text-xs">Returned</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{filterByStatus("CORRECTION_REQUIRED").length}</div>
          </div>
          <div className="glass rounded-xl p-4">
            <div className="text-slate-400 text-xs">Finalized</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{filterByStatus("FINALIZED").length}</div>
          </div>
        </div>
      )}

      {/* Results to Review */}
      {selectedElection && submitted.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-400">⚠</span> Awaiting Your Review
          </h2>
          <div className="space-y-3">
            {submitted.map((r) => (
              <div key={r._id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/20">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-medium">
                      Station: {r.pollingStationId?.code || "N/A"} — {r.seatType}
                    </div>
                    <div className="text-slate-400 text-sm mt-1">
                      Total ballots: {r.totalBallots} | Rejected: {r.rejectedVotes}
                    </div>
                    <div className="text-slate-500 text-xs mt-1">
                      {r.results?.map((cr, i) => `#${i + 1}: ${cr.votes} votes`).join(" | ")}
                    </div>
                    <div className="text-slate-600 text-[10px] mt-1">
                      Submitted: {r.submittedAt ? new Date(r.submittedAt).toLocaleString() : "N/A"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(r._id, "approve")}
                      disabled={reviewing === r._id}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-all disabled:opacity-50"
                    >
                      {reviewing === r._id ? "..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleReview(r._id, "return")}
                      disabled={reviewing === r._id}
                      className="px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white text-sm rounded-lg transition-all disabled:opacity-50"
                    >
                      {reviewing === r._id ? "..." : "Return"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Results */}
      {selectedElection && results.length > 0 && (
        <div className="glass rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">All Station Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700/30">
                  <th className="text-left py-3 px-2">Station</th>
                  <th className="text-left py-3 px-2">Seat</th>
                  <th className="text-right py-3 px-2">Ballots</th>
                  <th className="text-right py-3 px-2">Rejected</th>
                  <th className="text-center py-3 px-2">Status</th>
                  <th className="text-center py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r._id} className="border-b border-slate-800/30 hover:bg-slate-800/20">
                    <td className="py-3 px-2 text-white">{r.pollingStationId?.code || "N/A"}</td>
                    <td className="py-3 px-2 text-slate-300">{r.seatType}</td>
                    <td className="py-3 px-2 text-right text-slate-300">{r.totalBallots}</td>
                    <td className="py-3 px-2 text-right text-red-400">{r.rejectedVotes}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${STATUS_COLORS[r.status]}`}>
                        {r.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {r.status === "SUBMITTED" && (
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => handleReview(r._id, "approve")}
                            className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-500 text-white text-[10px] rounded transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReview(r._id, "return")}
                            className="px-2 py-1 bg-red-600/80 hover:bg-red-500 text-white text-[10px] rounded transition-all"
                          >
                            Return
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedElection && results.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-slate-400 text-sm">No results submitted for this election yet.</p>
        </div>
      )}
    </div>
  );
}
