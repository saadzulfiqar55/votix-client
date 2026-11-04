import React, { useEffect, useState } from "react";
import { getElections, getElectionResults } from "../../api/elections";

export default function AdminResults() {
  const [elections, setElections] = useState([]);
  const [selected, setSelected] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    getElections().then((r) => {
      setElections(r.data.elections.filter((e) => e.status === "PUBLISHED" || e.status === "FINALIZED"));
    });
  }, []);

  const load = async (id) => {
    if (!id) { setResults(null); setSelected(""); return; }
    setSelected(id);
    setLoading(true); setErr(null); setResults(null);
    try {
      const r = await getElectionResults(id);
      setResults(r.data);
    } catch (e) { setErr(e.response?.data?.message || e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gradient">Results</h1>
        <p className="text-slate-400 text-sm mt-1">View detailed results for published elections</p>
      </div>

      <select
        value={selected}
        onChange={(e) => load(e.target.value)}
        className="px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/60 transition min-w-[300px]"
      >
        <option value="">Select a published election</option>
        {elections.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>

      {elections.length === 0 && !loading && (
        <div className="glass rounded-2xl p-8 text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-slate-300 font-medium">No published elections yet</p>
          <p className="text-slate-500 text-sm mt-1">Results will appear here once elections are published</p>
        </div>
      )}

      {err && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
          <span>⚠️</span> {err}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-800/30 animate-pulse" />
            ))}
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid sm:grid-cols-3 gap-4">
            <ResultCard icon="👥" label="Registered" value={results.totals.registeredVoters} color="blue" />
            <ResultCard icon="🗳️" label="Votes Cast" value={results.totals.votesCast} color="emerald" />
            <ResultCard icon="📊" label="Turnout" value={`${results.totals.turnoutPercentage}%`} color="indigo" />
          </div>

          {/* Constituency-wise Results */}
          {results.constituencyResults && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Constituency Results</h2>
              <div className="space-y-6">
                {Object.entries(results.constituencyResults).map(([constCode, seats]) => (
                  <div key={constCode} className="glass rounded-2xl p-6 space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                        <span className="text-lg">📍</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{constCode}</h3>
                        <p className="text-slate-400 text-sm">Constituency Results</p>
                      </div>
                    </div>

                    {/* MNA Seat */}
                    {seats.MNA.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-xs font-semibold">MNA</span>
                          <span className="text-slate-500 text-xs">National Assembly Seat</span>
                        </div>
                        <div className="space-y-2">
                          {seats.MNA.map((c, i) => (
                            <CandidateResult key={c.id} candidate={c} rank={i + 1} seatType="MNA" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* MPA Seat */}
                    {seats.MPA.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-400 text-xs font-semibold">MPA</span>
                          <span className="text-slate-500 text-xs">Provincial Assembly Seat</span>
                        </div>
                        <div className="space-y-2">
                          {seats.MPA.map((c, i) => (
                            <CandidateResult key={c.id} candidate={c} rank={i + 1} seatType="MPA" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Party-wise Results */}
          {results.parties && results.parties.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">Party-wise Results</h2>
              <div className="space-y-3">
                {results.parties.map((p, i) => {
                  const pct = results.totals.votesCast > 0 ? (p.votes / results.totals.votesCast) * 100 : 0;
                  return (
                    <div key={p.party} className="glass rounded-xl p-4 hover:border-slate-600 transition">
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-500 w-5">#{i + 1}</span>
                          <span className="font-medium text-white">{p.party}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-indigo-400 font-bold font-mono">{p.votes}</span>
                          <span className="text-slate-500 text-xs">({pct.toFixed(1)}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full animate-progress"
                          style={{
                            width: `${pct}%`,
                            background: i === 0 ? "linear-gradient(90deg, #f59e0b, #f97316)" : i === 1 ? "linear-gradient(90deg, #94a3b8, #64748b)" : "linear-gradient(90deg, #6366f1, #3b82f6)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Winners */}
          <div className="grid sm:grid-cols-2 gap-4">
            {results.mnaWinner && (
              <div className="glass rounded-2xl p-6 border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">MNA Winner</span>
                    <h3 className="text-lg font-bold text-white">{results.mnaWinner.name}</h3>
                    <p className="text-slate-400 text-sm">{results.mnaWinner.party} — {results.mnaWinner.votes} votes</p>
                    {results.mnaWinner.constituency && (
                      <p className="text-slate-500 text-xs">{results.mnaWinner.constituency.code}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {results.mpaWinner && (
              <div className="glass rounded-2xl p-6 border border-purple-500/20">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">MPA Winner</span>
                    <h3 className="text-lg font-bold text-white">{results.mpaWinner.name}</h3>
                    <p className="text-slate-400 text-sm">{results.mpaWinner.party} — {results.mpaWinner.votes} votes</p>
                    {results.mpaWinner.constituency && (
                      <p className="text-slate-500 text-xs">{results.mpaWinner.constituency.code}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateResult({ candidate: c, rank, seatType }) {
  const isMNA = seatType === "MNA";
  const isLeading = c.isLeading;
  const maxVotes = c.votes + c.margin;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${isLeading ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-slate-800/30"}`}>
      <span className={`text-xs font-bold w-6 text-center ${isLeading ? "text-emerald-400" : "text-slate-500"}`}>
        #{rank}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isLeading ? "text-emerald-400" : "text-white"}`}>{c.name}</span>
          {isLeading && <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Leading</span>}
        </div>
        <span className="text-slate-500 text-xs">{c.party}</span>
      </div>
      <div className="text-right">
        <div className={`font-bold font-mono ${isLeading ? "text-emerald-400" : "text-indigo-400"}`}>{c.votes}</div>
        <div className="text-slate-500 text-xs">
          {c.margin > 0 ? (
            <span className="text-amber-400">-{c.margin} behind</span>
          ) : (
            <span className="text-emerald-400">Leading</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultCard({ icon, label, value, color }) {
  const colors = {
    blue: "from-blue-500/12 to-blue-500/4 border-blue-500/15",
    emerald: "from-emerald-500/12 to-emerald-500/4 border-emerald-500/15",
    indigo: "from-indigo-500/12 to-indigo-500/4 border-indigo-500/15",
  };
  const textColors = {
    blue: "text-blue-400",
    emerald: "text-emerald-400",
    indigo: "text-indigo-400",
  };
  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${colors[color]} border text-center`}>
      <div className="text-xl mb-2">{icon}</div>
      <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${textColors[color]}`}>{value}</div>
    </div>
  );
}
