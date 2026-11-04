import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getElections } from "../api/elections";

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
};

export default function VoterDashboard() {
  const { user } = useContext(AuthContext);
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getElections().then((r) => setElections(r.data.elections || [])).catch(() => setElections([])).finally(() => setLoading(false));
  }, []);

  const active = elections.find((e) => e.status === "VOTING_OPEN");
  const upcoming = elections.filter((e) => ["READY", "NOMINATION", "CONFIGURATION", "CANDIDATES_FINALIZED"].includes(e.status));
  const published = elections.filter((e) => e.status === "PUBLISHED");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-gradient">Voter Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Constituency: <span className="text-indigo-400 font-mono font-medium">{user?.constituency?.code || "—"}</span>
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-800/30 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Active Voting Banner */}
            {active && (
              <div className="animate-fade-in glass rounded-2xl p-6 border border-emerald-500/20 animate-pulse-glow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Live Now</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{active.name}</h2>
                    <p className="text-slate-400 text-sm mt-1">Cast your vote before the election ends</p>
                  </div>
                  <button
                    onClick={() => navigate("/vote")}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-medium shadow-lg shadow-emerald-600/20 transition-all hover:shadow-emerald-500/30 whitespace-nowrap"
                  >
                    Go to Voting Booth →
                  </button>
                </div>
              </div>
            )}

            {!active && (
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-slate-300 font-medium">No active election right now</p>
                <p className="text-slate-500 text-sm mt-1">Check back later for upcoming elections</p>
              </div>
            )}

            {/* All Elections */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white">All Elections</h2>
              {elections.length === 0 ? (
                <p className="text-slate-500 text-sm">No elections available yet.</p>
              ) : (
                elections.map((e, i) => (
                  <div
                     key={e.id}
                    className="glass rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-slate-600 transition animate-fade-in"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{e.name}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">{e.description || e.type || "No description"}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[e.status] || STATUS_COLORS.DRAFT}`}>
                        {e.status?.replace(/_/g, " ")}
                      </span>
                      <button
                        onClick={() => navigate(`/elections/${e.id}`)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
