// src/components/ResultsPage.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch global results
  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/elections/results", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load real-time election results.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleNextVoter = () => {
    logout();
    navigate("/");
  };

  // Calculate total votes cast across all parties
  const totalVotesCast = results.reduce((acc, party) => acc + party.totalVotes, 0);

  // Identify leading party
  const sortedResults = [...results].sort((a, b) => b.totalVotes - a.totalVotes);
  const leadingParty = sortedResults[0];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Ambient Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>📊</span> Global Election Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Live aggregate breakdown of votes cast by political party
            </p>
          </div>

          <button
            onClick={handleNextVoter}
            className="px-5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-500 active:bg-rose-700 text-white font-medium text-sm transition shadow-lg shadow-rose-600/20 flex items-center gap-2"
          >
            <span>🚪</span> Next Voter / Logout
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Metrics Bar */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Ballots Cast</p>
                <p className="text-3xl font-extrabold text-indigo-400 font-mono mt-1">{totalVotesCast}</p>
              </div>
              <div className="text-3xl p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">🗳️</div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Leading Party</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">
                  {leadingParty ? leadingParty._id || "Independent" : "N/A"}
                </p>
              </div>
              <div className="text-3xl p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">👑</div>
            </div>
          </div>
        )}

        {/* Main Results Breakdown */}
        <section className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🏛️</span> Party Vote Distribution
            </h2>
            <span className="text-xs text-slate-400">Updates dynamically as votes are cast</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800">
              Fetching real-time results...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((party) => {
                const percentage = totalVotesCast > 0 
                  ? ((party.totalVotes / totalVotesCast) * 100).toFixed(1) 
                  : 0;

                return (
                  <div
                    key={party._id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-3 hover:border-indigo-500/40 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-200">{party._id || "Independent"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-mono font-bold text-indigo-400">{party.totalVotes}</span>
                        <span className="text-xs text-slate-400 ml-2">({percentage}%)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800 text-sm">
              No votes have been submitted yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}