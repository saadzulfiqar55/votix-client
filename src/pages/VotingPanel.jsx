// src/components/VotingPanel.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function VotingPanel() {
  const { user } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [votingId, setVotingId] = useState(null); // track specific candidate being voted for
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch constituency candidates
  const fetchCandidates = async () => {
    if (!user?.constituency) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/elections/candidates/${user.constituency}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCandidates(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch constituency candidates.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch global results
  const fetchResults = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/elections/results",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Vote for a candidate
  const handleVote = async (id) => {
    setVotingId(id);
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/elections/vote",
        { candidateId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setHasVoted(true);
      alert(res.data.message || "Vote cast successfully!");
      navigate("/results");
    } catch (err) {
      const msg = err.response?.data?.message || "Error submitting vote.";
      setError(msg);
      if (msg.toLowerCase().includes("already voted")) {
        setHasVoted(true);
        setTimeout(() => navigate("/results"), 1500);
      }
    } finally {
      setVotingId(null);
    }
  };

  useEffect(() => {
    fetchCandidates();
    fetchResults();
  }, [user?.constituency]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-10 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Accent Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Page Header & Constituency Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>🗳️</span> Official Voting Panel
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Cast your vote securely for candidates in your registered constituency
            </p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 backdrop-blur-sm flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Constituency:</span>
            <span className="text-sm font-bold text-indigo-400 font-mono">
              {user?.constituency || "Unassigned"}
            </span>
          </div>
        </div>

        {/* Global Results Snapshot */}
        <section className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xl">
              🌍
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Global Election Overview</h2>
              <p className="text-xs text-slate-400">Live vote count aggregate by party across constituencies</p>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {results.map((party) => (
                <div
                  key={party._id}
                  className="p-5 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center space-y-1 hover:border-indigo-500/40 transition"
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {party._id || "Independent"}
                  </h3>
                  <p className="text-3xl font-extrabold text-indigo-400 font-mono">
                    {party.totalVotes}
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Votes Cast</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 bg-slate-900/30 rounded-2xl border border-slate-800 text-sm">
              No votes recorded globally yet.
            </div>
          )}
        </section>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Candidates Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>👤</span> Candidates for {user?.constituency || "Your Area"}
            </h2>
            <span className="text-xs text-slate-400">
              Select one candidate to cast your vote
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 bg-slate-800/30 rounded-3xl border border-slate-700/50">
              Fetching registered candidates for {user?.constituency}...
            </div>
          ) : candidates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {candidates.map((c) => (
                <div
                  key={c._id}
                  className="p-6 rounded-3xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:border-indigo-500/50 transition shadow-xl flex flex-col justify-between items-center text-center space-y-5 group"
                >
                  {/* Candidate Symbol */}
                  <div className="w-20 h-20 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                    {c.symbol || "🏛️"}
                  </div>

                  {/* Candidate Details */}
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {c.name}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/60 text-indigo-400 border border-slate-700/60">
                      {c.party || "Independent"}
                    </span>
                  </div>

                  {/* Vote CTA */}
                  <button
                    onClick={() => handleVote(c._id)}
                    disabled={votingId !== null || hasVoted}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition shadow-lg ${
                      hasVoted
                        ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                        : votingId === c._id
                        ? "bg-indigo-700 text-white cursor-wait"
                        : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-indigo-600/25"
                    }`}
                  >
                    {hasVoted
                      ? "Already Voted"
                      : votingId === c._id
                      ? "Submitting Vote..."
                      : "Cast Vote"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-slate-800/30 rounded-3xl border border-slate-700/50 space-y-2">
              <p className="text-lg font-medium text-slate-300">No candidates available</p>
              <p className="text-sm">
                There are no candidates registered for constituency{" "}
                <strong className="text-indigo-400">{user?.constituency}</strong> yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}