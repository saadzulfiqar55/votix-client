import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getConstituencyResults } from "../api/elections";

const STATUS_COLORS = {
  CALCULATED: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  VERIFIED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  FINALIZED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  PUBLISHED: "bg-green-500/20 text-green-300 border-green-500/30",
};

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("constituency");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const stored = localStorage.getItem("selectedElection");
        if (stored) {
          const res = await getConstituencyResults(stored);
          setResults(res.data.results || []);
        } else {
          setError("No election selected. Go to Elections page to select one.");
        }
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load results");
      }
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

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="glass rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-slate-400">{error}</p>
          <Link to="/elections" className="text-indigo-400 hover:text-indigo-300 text-sm mt-3 inline-block">
            Browse Elections →
          </Link>
        </div>
      </div>
    );
  }

  const publishedResults = results.filter(r => ["PUBLISHED", "FINALIZED"].includes(r.status));
  const hasResults = publishedResults.length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Election Results</h1>
          <p className="text-slate-400 mt-1">Constituency-wise results with margins</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("constituency")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${view === "constituency" ? "bg-indigo-600 text-white" : "bg-slate-700/50 text-slate-400 hover:text-white"}`}
          >
            By Constituency
          </button>
          <button
            onClick={() => setView("seat")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${view === "seat" ? "bg-indigo-600 text-white" : "bg-slate-700/50 text-slate-400 hover:text-white"}`}
          >
            By Seat Type
          </button>
        </div>
      </div>

      {!hasResults && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-slate-400">No published results for this election yet.</p>
        </div>
      )}

      {/* Constituency View */}
      {hasResults && view === "constituency" && (
        <div className="space-y-4">
          {publishedResults.map((cr) => (
            <div key={cr._id} className="glass rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold">
                      {cr.constituencyId?.code || "N/A"} — {cr.constituencyId?.name || ""}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${STATUS_COLORS[cr.status] || STATUS_COLORS.CALCULATED}`}>
                      {cr.seatType}
                    </span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">
                    Turnout: {cr.turnoutPercentage}% • Total votes: {cr.totalVotes} / {cr.totalRegistered}
                  </div>
                </div>
                {cr.winner && (
                  <div className="text-right">
                    <div className="text-emerald-400 text-sm font-medium">🏆 Winner</div>
                    <div className="text-white text-sm">{cr.winner.candidateName}</div>
                    <div className="text-slate-400 text-xs">{cr.winner.party}</div>
                    <div className="text-slate-500 text-xs">Margin: {cr.winner.margin} votes</div>
                  </div>
                )}
              </div>

              {/* Candidate Results */}
              <div className="mt-4 space-y-2">
                {cr.results?.slice(0, 5).map((candidate, i) => (
                  <div key={candidate.candidateId || i} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      i === 0 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      i === 1 ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                      "bg-slate-500/20 text-slate-400 border border-slate-500/30"
                    }`}>
                      {candidate.position}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm truncate">{candidate.candidateName}</span>
                        <span className="text-slate-400 text-sm ml-2">{candidate.votes.toLocaleString()} votes</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            i === 0 ? "bg-emerald-500" :
                            i === 1 ? "bg-blue-500" :
                            "bg-slate-600"
                          }`}
                          style={{
                            width: `${cr.totalVotes > 0 ? (candidate.votes / cr.totalVotes * 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs ml-2">
                      {cr.totalVotes > 0 ? ((candidate.votes / cr.totalVotes) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seat Type View */}
      {hasResults && view === "seat" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["MNA", "MPA"].map(seatType => {
            const seatResults = publishedResults.filter(r => r.seatType === seatType);
            return (
              <div key={seatType} className="glass rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    seatType === "MNA" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                    "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  }`}>
                    {seatType}
                  </span>
                  {seatType === "MNA" ? "National Assembly" : "Provincial Assembly"}
                </h3>
                <div className="space-y-3">
                  {seatResults.map(cr => (
                    <div key={cr._id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white text-sm">{cr.constituencyId?.code || "N/A"}</div>
                          <div className="text-slate-500 text-xs">{cr.constituencyId?.name}</div>
                        </div>
                        {cr.winner && (
                          <div className="text-right">
                            <div className="text-emerald-400 text-xs font-medium">🏆 {cr.winner.candidateName}</div>
                            <div className="text-slate-500 text-[10px]">+{cr.winner.margin} margin</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
