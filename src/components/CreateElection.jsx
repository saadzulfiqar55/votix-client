// src/components/CreateElection.jsx
import React, { useState } from 'react';
import { createElection } from '../api/elections'; // Ensure path is correct

export default function CreateElection({ onAdd }) {
  const [title, setTitle] = useState('');
  const [constituency, setConstituency] = useState('NA-1');
  const [candidates, setCandidates] = useState([
    { name: '', party: '', symbol: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle candidate array changes
  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, { name: '', party: '', symbol: '' }]);
  };

  const removeCandidateField = (index) => {
    if (candidates.length === 1) return;
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        title,
        constituency,
        candidates: candidates.filter((c) => c.name.trim() !== ''), // exclude empty entries
      };

      const res = await createElection(payload, token);
      onAdd(res.data);

      // Reset form
      setTitle('');
      setConstituency('NA-1');
      setCandidates([{ name: '', party: '', symbol: '' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-2xl">
          ➕
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Create New Election</h2>
          <p className="text-sm text-slate-400">Set up poll details and register competing candidates</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Election Title & Constituency */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Election Title
            </label>
            <input
              type="text"
              placeholder="e.g. National Assembly General Election"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Constituency
            </label>
            <div className="relative">
              <select
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`NA-${i + 1}`} className="bg-slate-800 text-white">
                    NA-{i + 1}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Candidates Input Section */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Candidates List
            </h3>
            <button
              type="button"
              onClick={addCandidateField}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition flex items-center gap-1"
            >
              <span>+ Add Candidate</span>
            </button>
          </div>

          <div className="space-y-3">
            {candidates.map((candidate, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-700/60 space-y-3 md:space-y-0 md:flex md:items-center md:gap-3 relative group"
              >
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(idx, 'name', e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="Party Name"
                  value={candidate.party}
                  onChange={(e) => handleCandidateChange(idx, 'party', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="Symbol / Emoji (e.g. 🏏)"
                  value={candidate.symbol}
                  onChange={(e) => handleCandidateChange(idx, 'symbol', e.target.value)}
                  className="w-full md:w-48 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />

                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidateField(idx)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    title="Remove Candidate"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publishing Election...' : 'Publish Election'}
        </button>
      </form>
    </div>
  );
}// src/components/CreateElection.jsx
import React, { useState } from 'react';
import { createElection } from '../api/elections'; // Ensure path is correct

export default function CreateElection({ onAdd }) {
  const [title, setTitle] = useState('');
  const [constituency, setConstituency] = useState('NA-1');
  const [candidates, setCandidates] = useState([
    { name: '', party: '', symbol: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle candidate array changes
  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, { name: '', party: '', symbol: '' }]);
  };

  const removeCandidateField = (index) => {
    if (candidates.length === 1) return;
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        title,
        constituency,
        candidates: candidates.filter((c) => c.name.trim() !== ''), // exclude empty entries
      };

      const res = await createElection(payload, token);
      onAdd(res.data);

      // Reset form
      setTitle('');
      setConstituency('NA-1');
      setCandidates([{ name: '', party: '', symbol: '' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-2xl">
          ➕
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Create New Election</h2>
          <p className="text-sm text-slate-400">Set up poll details and register competing candidates</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Election Title & Constituency */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Election Title
            </label>
            <input
              type="text"
              placeholder="e.g. National Assembly General Election"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Constituency
            </label>
            <div className="relative">
              <select
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`NA-${i + 1}`} className="bg-slate-800 text-white">
                    NA-{i + 1}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Candidates Input Section */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Candidates List
            </h3>
            <button
              type="button"
              onClick={addCandidateField}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition flex items-center gap-1"
            >
              <span>+ Add Candidate</span>
            </button>
          </div>

          <div className="space-y-3">
            {candidates.map((candidate, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-700/60 space-y-3 md:space-y-0 md:flex md:items-center md:gap-3 relative group"
              >
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(idx, 'name', e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="Party Name"
                  value={candidate.party}
                  onChange={(e) => handleCandidateChange(idx, 'party', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="Symbol / Emoji (e.g. 🏏)"
                  value={candidate.symbol}
                  onChange={(e) => handleCandidateChange(idx, 'symbol', e.target.value)}
                  className="w-full md:w-48 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />

                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidateField(idx)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    title="Remove Candidate"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publishing Election...' : 'Publish Election'}
        </button>
      </form>
    </div>
  );
}// src/components/CreateElection.jsx
import React, { useState } from 'react';
import { createElection } from '../api/elections'; // Ensure path is correct

export default function CreateElection({ onAdd }) {
  const [title, setTitle] = useState('');
  const [constituency, setConstituency] = useState('NA-1');
  const [candidates, setCandidates] = useState([
    { name: '', party: '', symbol: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle candidate array changes
  const handleCandidateChange = (index, field, value) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const addCandidateField = () => {
    setCandidates([...candidates, { name: '', party: '', symbol: '' }]);
  };

  const removeCandidateField = (index) => {
    if (candidates.length === 1) return;
    setCandidates(candidates.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        title,
        constituency,
        candidates: candidates.filter((c) => c.name.trim() !== ''), // exclude empty entries
      };

      const res = await createElection(payload, token);
      onAdd(res.data);

      // Reset form
      setTitle('');
      setConstituency('NA-1');
      setCandidates([{ name: '', party: '', symbol: '' }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-700/50 pb-4">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-2xl">
          ➕
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Create New Election</h2>
          <p className="text-sm text-slate-400">Set up poll details and register competing candidates</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Election Title & Constituency */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Election Title
            </label>
            <input
              type="text"
              placeholder="e.g. National Assembly General Election"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Constituency
            </label>
            <div className="relative">
              <select
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-700/80 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition appearance-none cursor-pointer"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`NA-${i + 1}`} className="bg-slate-800 text-white">
                    NA-{i + 1}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Candidates Input Section */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Candidates List
            </h3>
            <button
              type="button"
              onClick={addCandidateField}
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition flex items-center gap-1"
            >
              <span>+ Add Candidate</span>
            </button>
          </div>

          <div className="space-y-3">
            {candidates.map((candidate, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/40 border border-slate-700/60 space-y-3 md:space-y-0 md:flex md:items-center md:gap-3 relative group"
              >
                <input
                  type="text"
                  placeholder="Candidate Name"
                  value={candidate.name}
                  onChange={(e) => handleCandidateChange(idx, 'name', e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="Party Name"
                  value={candidate.party}
                  onChange={(e) => handleCandidateChange(idx, 'party', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
                <input
                  type="text"
                  placeholder="Symbol / Emoji (e.g. 🏏)"
                  value={candidate.symbol}
                  onChange={(e) => handleCandidateChange(idx, 'symbol', e.target.value)}
                  className="w-full md:w-48 px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />

                {candidates.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCandidateField(idx)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition"
                    title="Remove Candidate"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-600/25 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Publishing Election...' : 'Publish Election'}
        </button>
      </form>
    </div>
  );
}