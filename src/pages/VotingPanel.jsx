import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function VotingPanel() {
  const { user } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    console.log("Logged user:", user);
  }, [user]);

  // ✅ Fetch constituency candidates
  const fetchCandidates = async () => {
    if (!user?.constituency) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/elections/candidates/${user.constituency}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching candidates");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch global results
  const fetchResults = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/elections/results",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Vote for a candidate
  const handleVote = async (id) => {
    setVoting(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/elections/vote",
        { candidateId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
      fetchResults(); // refresh results after voting
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting vote");
    } finally {
      setVoting(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchCandidates();
    fetchResults();
  }, [user?.constituency]);

  return (
    <div className="p-6 mx-auto max-w-7xl">
      {/* Global Results */}
      <div className="bg-gray-100 p-6 rounded-2xl shadow mb-8">
        <h2 className="text-xl font-bold mb-4">🌍 Global Election Results</h2>
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {results.map((party) => (
              <div
                key={party._id}
                className="bg-white rounded-xl shadow p-4 text-center"
              >
                <h3 className="font-semibold text-lg">{party._id}</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {party.totalVotes}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No votes yet.</p>
        )}
      </div>

      {/* Constituency & Candidates */}
      <h1 className="text-2xl font-bold mb-4">🗳 Voting Panel</h1>
      <p className="mb-4">
        <strong>Your Constituency:</strong> {user?.constituency || "N/A"}
      </p>

      {loading ? (
        <p>Loading candidates...</p>
      ) : candidates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {candidates.map((c) => (
            <div
              key={c._id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl mb-4">
                {c.symbol || "🏳"}
              </div>
              <h3 className="text-lg font-bold">{c.name}</h3>
              <p className="text-gray-600">{c.party}</p>
              <button
                onClick={() => handleVote(c._id)}
                disabled={voting}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
              >
                {voting ? "Submitting..." : "Vote"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No candidates found for your constituency.</p>
      )}
    </div>
  );
}
