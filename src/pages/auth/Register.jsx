import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getConstituencies } from "../../api/elections";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "", constituencyCode: "" });
  const [constituencies, setConstituencies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    getConstituencies().then((r) => setConstituencies(r.data.constituencies || [])).catch(() => {});
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🗳️</div>
          <h1 className="text-3xl font-bold text-gradient">Join Votix</h1>
          <p className="text-slate-400 mt-2 text-sm">Create your account and start voting securely</p>
        </div>

        <form onSubmit={submit} className="glass rounded-2xl p-8 space-y-5 shadow-2xl shadow-black/20">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Full Name</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition"
              placeholder="John Doe" value={form.name} onChange={set("name")} required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition"
              type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition"
              type="password" placeholder="Min 8 chars, upper, lower, number" value={form.password} onChange={set("password")} required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Constituency</label>
            <select
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition appearance-none"
              value={form.constituencyCode} onChange={set("constituencyCode")} required
            >
              <option value="">Select your constituency</option>
              {constituencies.map((c) => (
                <option key={c.id} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-white disabled:opacity-50 shadow-lg shadow-indigo-600/20 transition-all hover:shadow-indigo-500/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Creating…
              </span>
            ) : "Create Account"}
          </button>

          <div className="text-sm text-slate-400 text-center">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition">Sign in →</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
