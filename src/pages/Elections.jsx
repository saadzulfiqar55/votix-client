import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

const TYPE_ICONS = {
  GENERAL: "🗳",
  BY_ELECTION: "📋",
  MUNICIPAL: "🏛",
};

export default function Elections() {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

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

  const handleSelect = (id) => {
    setSelectedId(id);
    localStorage.setItem("selectedElection", id);
  };

  const filtered = filter === "all" ? elections :
    filter === "active" ? elections.filter(e => ["VOTING_OPEN", "VOTING_CLOSED", "COUNTING"].includes(e.status)) :
    filter === "upcoming" ? elections.filter(e => ["DRAFT", "CONFIGURATION", "NOMINATION", "CANDIDATES_FINALIZED", "READY"].includes(e.status)) :
    filter === "past" ? elections.filter(e => ["PUBLISHED", "FINALIZED"].includes(e.status)) :
    elections;

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
          <h1 className="text-2xl font-bold text-white">Elections</h1>
          <p className="text-slate-400 mt-1">Browse and select elections</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", "active", "upcoming", "past"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
              filter === f ? "bg-indigo-600 text-white" : "bg-slate-700/50 text-slate-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Selected Election Indicator */}
      {selectedId && (
        <div className="glass rounded-xl p-4 flex items-center justify-between border-indigo-500/30">
          <div className="text-sm">
            <span className="text-indigo-400 font-medium">Selected: </span>
             <span className="text-white">{elections.find(e => e.id === selectedId)?.name}</span>
          </div>
          <div className="flex gap-2">
            <Link to="/results" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-all">
              View Results →
            </Link>
            <button onClick={() => { setSelectedId(null); localStorage.removeItem("selectedElection"); }} className="px-3 py-1.5 bg-slate-700/50 text-slate-400 text-xs rounded-lg hover:text-white transition-all">
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Election Cards */}
      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🗳</div>
          <p className="text-slate-400">No elections found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((election) => {
              const isSelected = selectedId === election.id;
            const statusIdx = STATUS_FLOW.indexOf(election.status);
            return (
                <Link
                  key={election.id}
                  to={`/elections/${election.id}`}
                  onClick={() => handleSelect(election.id)}
                className={`block glass rounded-xl p-5 transition-all hover:border-indigo-500/30 ${
                  isSelected ? "ring-2 ring-indigo-500/50 border-indigo-500/30" : "border-transparent"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{TYPE_ICONS[election.type] || "🗳"}</span>
                      <div>
                        <h3 className="text-white font-semibold">{election.name}</h3>
                        <div className="text-slate-400 text-sm">{election.type} • {election.constituencies?.length || 0} constituencies</div>
                      </div>
                    </div>
                    {election.startDate && election.endDate && (
                      <div className="text-slate-500 text-xs mt-2 ml-11">
                        {new Date(election.startDate).toLocaleDateString()} — {new Date(election.endDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${STATUS_COLORS[election.status]}`}>
                      {election.status.replace(/_/g, " ")}
                    </span>
                    {/* Lifecycle Progress */}
                    <div className="flex gap-1 mt-1">
                      {STATUS_FLOW.slice(0, 11).map((s, i) => (
                        <div
                          key={s}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            i <= statusIdx ? "bg-indigo-500" : "bg-slate-700"
                          }`}
                          title={s}
                        />
                      ))}
                    </div>
                    {isSelected && <span className="text-indigo-400 text-[10px]">✓ Selected for results</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
