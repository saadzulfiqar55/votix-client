import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch global results
  const fetchResults = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/elections/results", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleNextVoter = () => {
    logout();          // logout current user
    navigate("/");     // redirect to homepage/login
  };

  return (
    <div className="p-6 mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🌍 Global Election Results
      </h1>

      {loading ? (
        <p className="text-center">Loading results...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((party) => (
            <div key={party._id} className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <h3 className="text-lg font-semibold">{party._id}</h3>
              <p className="text-3xl font-bold text-blue-600">{party.totalVotes}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No votes yet.</p>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={handleNextVoter}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
        >
          Next Voter
        </button>
      </div>
    </div>
  );
}
