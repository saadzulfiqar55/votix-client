import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function VotingPanel() {
  const { user } = useContext(AuthContext);
  const [constituency, setConstituency] = useState(user?.constituency || "");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    if (!constituency) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/elections/candidates/${constituency}`,
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

  useEffect(() => {
    if (constituency) fetchCandidates();
  }, [constituency]);

  const handleVote = async (id) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/elections/vote",
        { candidateId: id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting vote");
    }
  };

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <div className="flex items-center justify-center flex-col gap-5 pt-10">
        <h1 className="text-2xl font-bold mb-4">Voting Panel</h1>
        <p>Your Constituency:</p>
        <input
          value={constituency}
          onChange={(e) => setConstituency(e.target.value)}
          placeholder="NA-1"
          className="border p-2 mb-3"
        />
        <button
          onClick={fetchCandidates}
          disabled={!constituency}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Load Candidates
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : (
          candidates.length > 0 && (
            <div className="mt-4 space-y-4">
              <h2 className="text-xl font-semibold">Candidates</h2>
              <ul className="list-disc list-inside">
                {candidates.map((c) => (
                  <li
                    key={c._id}
                    className="flex justify-between items-center py-1"
                  >
                    <span>
                      {c.name} ({c.party}) — <em>{c.symbol}</em>
                    </span>
                    <button
                      onClick={() => handleVote(c._id)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Vote
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </div>
  );
}
