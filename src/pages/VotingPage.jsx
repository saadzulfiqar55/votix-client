import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getElections, getCandidates, castVote } from "../api/elections";

export default function VotingPage() {
  const { user } = useContext(AuthContext);
  const [activeElection, setActiveElection] = useState(null);
  const [mnaCandidates, setMnaCandidates] = useState([]);
  const [mpaCandidates, setMpaCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);
  const [error, setError] = useState(null);
  const [confirmVote, setConfirmVote] = useState(null);
  const [votedSeats, setVotedSeats] = useState({ MNA: false, MPA: false });
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getElections();
        const all = res.data.elections || [];
        const active = all.find((e) => e.status === "VOTING_OPEN");
        setActiveElection(active || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeElection || !user?.constituency?.code) return;
    getCandidates(activeElection.id, user.constituency.code)
      .then((res) => {
        const all = res.data.candidates || [];
        setMnaCandidates(all.filter((c) => c.seatType === "MNA"));
        setMpaCandidates(all.filter((c) => c.seatType === "MPA"));
      })
      .catch(() => {
        setMnaCandidates([]);
        setMpaCandidates([]);
      });
  }, [activeElection, user?.constituency?.code]);

  const handleVote = async (candidateId, seatType) => {
    setVotingId(candidateId);
    setError(null);
    setConfirmVote(null);
    try {
      await castVote(activeElection.id, candidateId, seatType);
      setVotedSeats((prev) => ({ ...prev, [seatType]: true }));
    } catch (err) {
      const msg = err.response?.data?.message || "Unable to record your vote.";
      setError(msg);
    } finally {
      setVotingId(null);
    }
  };

  const bothVoted = votedSeats.MNA && votedSeats.MPA;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400">Loading voting panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-gradient">Official Voting Panel</h1>
          <p className="text-slate-400 mt-1">
            Constituency: <span className="text-indigo-400 font-mono font-medium">{user?.constituency?.code || "Unassigned"}</span>
          </p>
          {activeElection && (
            <p className="text-slate-500 text-sm mt-1">{activeElection.name}</p>
          )}
        </div>

        {!activeElection && (
          <div className="glass rounded-2xl p-8 text-center animate-fade-in">
            <div className="text-5xl mb-4">🗳️</div>
            <p className="text-slate-300 font-medium text-lg">No active election is currently open</p>
            <p className="text-slate-500 text-sm mt-2">When an election starts, candidates for your constituency will appear here.</p>
            <button onClick={() => navigate("/dashboard")} className="mt-6 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition">
              ← Back to Dashboard
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2 animate-fade-in">
            <span>⚠️</span> {error}
          </div>
        )}

        {bothVoted && (
          <div className="glass rounded-2xl p-6 border border-emerald-500/20 animate-fade-in text-center">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-xl font-bold text-white mb-2">Both votes cast successfully!</h2>
            <p className="text-slate-400 mb-4">You have voted for both MNA and MPA seats in this election.</p>
            <button
              onClick={() => navigate("/vote/confirmation")}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium transition"
            >
              View Confirmation →
            </button>
          </div>
        )}

        {activeElection && mnaCandidates.length === 0 && mpaCandidates.length === 0 && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-300">No candidates found for your constituency in this election.</p>
          </div>
        )}

        {activeElection && mnaCandidates.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                <span className="text-lg">🏛️</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">National Assembly (MNA)</h2>
                <p className="text-slate-400 text-sm">Vote for your Member of National Assembly</p>
              </div>
              {votedSeats.MNA && (
                <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                  ✓ Voted
                </span>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mnaCandidates.map((c, i) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  index={i}
                  seatType="MNA"
                  voted={votedSeats.MNA}
                  votingId={votingId}
                  confirmVote={confirmVote}
                  setConfirmVote={setConfirmVote}
                  handleVote={handleVote}
                />
              ))}
            </div>
          </div>
        )}

        {activeElection && mpaCandidates.length > 0 && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <span className="text-lg">🏢</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Provincial Assembly (MPA)</h2>
                <p className="text-slate-400 text-sm">Vote for your Member of Provincial Assembly</p>
              </div>
              {votedSeats.MPA && (
                <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                  ✓ Voted
                </span>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mpaCandidates.map((c, i) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  index={i}
                  seatType="MPA"
                  voted={votedSeats.MPA}
                  votingId={votingId}
                  confirmVote={confirmVote}
                  setConfirmVote={setConfirmVote}
                  handleVote={handleVote}
                />
              ))}
            </div>
          </div>
        )}

        {activeElection && !bothVoted && (mnaCandidates.length > 0 || mpaCandidates.length > 0) && (
          <div className="text-center text-slate-500 text-sm">
            {!votedSeats.MNA && "Vote for MNA seat"}{!votedSeats.MNA && !votedSeats.MPA && " and "}{!votedSeats.MPA && "Vote for MPA seat"} to complete your ballot
          </div>
        )}
      </div>
    </div>
  );
}

function CandidateCard({ candidate: c, index: i, seatType, voted, votingId, confirmVote, setConfirmVote, handleVote }) {
  const isMNA = seatType === "MNA";
  const accentColor = isMNA ? "blue" : "purple";

  return (
    <div
      className="glass rounded-2xl p-6 text-center space-y-4 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 animate-fade-in disabled:opacity-50"
      style={{ animationDelay: `${i * 0.1}s`, opacity: voted ? 0.6 : 1 }}
    >
      <div className={`w-16 h-16 mx-auto rounded-2xl ${isMNA ? "bg-blue-500/15" : "bg-purple-500/15"} flex items-center justify-center text-3xl`}>
        {c.partySymbol || "🏛️"}
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{c.name}</h3>
        <p className={`${isMNA ? "text-blue-400" : "text-purple-400"} text-sm font-medium`}>{c.party}</p>
        <p className="text-slate-500 text-xs mt-1">{seatType} Seat</p>
      </div>

      {voted ? (
        <div className="py-2.5 rounded-xl bg-slate-800/50 text-slate-500 text-sm">
          Vote recorded
        </div>
      ) : confirmVote === c.id ? (
        <div className="space-y-2">
          <p className="text-xs text-amber-400">Confirm your vote? This cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleVote(c.id, seatType)}
              disabled={votingId !== null}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-sm disabled:opacity-50 transition"
            >
              {votingId === c.id ? "Casting…" : "Confirm"}
            </button>
            <button
              onClick={() => setConfirmVote(null)}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirmVote(c.id)}
          disabled={votingId !== null}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-50 shadow-lg shadow-indigo-600/15 transition-all hover:shadow-indigo-500/25"
        >
          Cast Vote
        </button>
      )}
    </div>
  );
}
