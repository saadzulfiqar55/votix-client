import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPanel() {
  const [candidates, setCandidates] = useState([]);
  const [formData, setFormData] = useState({ name: "", party: "", symbol: "", constituency: "" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCandidates = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/elections/admin/candidates", { headers });
      setCandidates(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch candidates");
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/elections/candidates", formData, { headers });
      setFormData({ name: "", party: "", symbol: "", constituency: "" });
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding candidate");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/elections/candidates/${id}`, { headers });
      fetchCandidates();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting candidate");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-slate-100 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">⚙️ Admin Dashboard</h1>

      {/* Add Candidate Form */}
      <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl mb-8 space-y-4">
        <h2 className="text-xl font-semibold">Add New Candidate</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-3 bg-slate-700 rounded-lg text-white"
            required
          />
          <input
            type="text"
            placeholder="Party"
            value={formData.party}
            onChange={(e) => setFormData({ ...formData, party: e.target.value })}
            className="p-3 bg-slate-700 rounded-lg text-white"
            required
          />
          <input
            type="text"
            placeholder="Symbol (emoji or text)"
            value={formData.symbol}
            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
            className="p-3 bg-slate-700 rounded-lg text-white"
            required
          />
          <input
            type="text"
            placeholder="Constituency (e.g. NA-1)"
            value={formData.constituency}
            onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
            className="p-3 bg-slate-700 rounded-lg text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition"
        >
          {loading ? "Saving..." : "Add Candidate"}
        </button>
      </form>

      {/* Manage Candidates Table */}
      <div className="bg-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Manage Candidates</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="p-3">Symbol</th>
              <th className="p-3">Name</th>
              <th className="p-3">Party</th>
              <th className="p-3">Constituency</th>
              <th className="p-3">Votes</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id} className="border-b border-slate-700/50">
                <td className="p-3">{c.symbol}</td>
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.party}</td>
                <td className="p-3">{c.constituency}</td>
                <td className="p-3 font-mono">{c.votes}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="px-3 py-1 bg-red-600/80 hover:bg-red-500 rounded text-sm transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}