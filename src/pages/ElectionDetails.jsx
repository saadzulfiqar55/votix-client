import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getElection, getReadiness, getCandidates } from "../api/elections";

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

export default function ElectionDetails() {
  const { id } = useParams();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getElection(id);
        setElection(res.data.election || res.data);
        const cRes = await getCandidates(id);
        setCandidates(cRes.data.candidates || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!election) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-400">Election not found.</p>
        <Link to="/elections" className="text-indigo-400 text-sm mt-2 inline-block">← Back to Elections</Link>
      </div>
    );
  }

  const statusIdx = STATUS_FLOW.indexOf(election.status);
  const mnaCandidates = candidates.filter(c => c.seatType === "MNA");
  const mpaCandidates = candidates.filter(c => c.seatType === "MPA");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <Link to="/elections" className="text-indigo-400 hover:text-indigo-300 text-sm mb-3 inline-block">← Back to Elections</Link>
          <h1 className="text-2xl font-bold text-white">{election.name}</h1>
          <div className="text-slate-400 mt-1">{election.type}</div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm border ${STATUS_COLORS[election.status]}`}>
          {election.status?.replace(/_/g, " ")}
        </span>
      </div>

      {/* Lifecycle Progress */}
      <div className="glass rounded-xl p-5">
        <h2 className="text-sm font-medium text-slate-400 mb-3">Election Lifecycle</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STATUS_FLOW.map((s, i) => (
            <span key={s} className="flex items-center gap-1 flex-shrink-0">
              <div className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                i === statusIdx
                  ? "bg-indigo-500/30 text-indigo-200 border-indigo-400/50 scale-105"
                  : i < statusIdx
                  ? "bg-emerald-500/10 text-emerald-400/70 border-emerald-500/20"
                  : "bg-slate-800/30 text-slate-600 border-slate-700/20"
              }`}>
                {s.replace(/_/g, " ")}
              </div>
              {i < STATUS_FLOW.length - 1 && <span className="text-slate-700 text-xs">→</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Dates */}
      {(election.startDate || election.endDate) && (
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-medium text-slate-400 mb-3">Schedule</h2>
          <div className="grid grid-cols-2 gap-4">
            {election.startDate && (
              <div>
                <div className="text-slate-500 text-xs">Start Date</div>
                <div className="text-white text-sm">{new Date(election.startDate).toLocaleString()}</div>
              </div>
            )}
            {election.endDate && (
              <div>
                <div className="text-slate-500 text-xs">End Date</div>
                <div className="text-white text-sm">{new Date(election.endDate).toLocaleString()}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Candidates by Seat Type */}
      <div className="space-y-4">
        {mnaCandidates.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center text-xs font-bold">MNA</span>
              National Assembly Candidates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mnaCandidates.map((c) => (
                <div key={c.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm">
                      {c.name?.[0] || "?"}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{c.name}</div>
                      <div className="text-slate-400 text-xs">{c.party} • {c.constituency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {mpaCandidates.length > 0 && (
          <div className="glass rounded-xl p-5">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xs font-bold">MPA</span>
              Provincial Assembly Candidates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mpaCandidates.map((c) => (
                <div key={c.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm">
                      {c.name?.[0] || "?"}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{c.name}</div>
                      <div className="text-slate-400 text-xs">{c.party} • {c.constituency}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {candidates.length === 0 && (
          <div className="glass rounded-xl p-8 text-center">
            <div className="text-3xl mb-2">👤</div>
            <p className="text-slate-400 text-sm">No candidates registered for this election.</p>
          </div>
        )}
      </div>
    </div>
  );
}
