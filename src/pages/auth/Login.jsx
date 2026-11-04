import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
      if (/verify/i.test(msg)) navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🗳️</div>
          <h1 className="text-3xl font-bold text-gradient">Welcome back</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to access your voting dashboard</p>
        </div>

        <form onSubmit={submit} className="glass rounded-2xl p-8 space-y-5 shadow-2xl shadow-black/20">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition"
              type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
            <input
              className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700/60 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition"
              type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-white disabled:opacity-50 shadow-lg shadow-indigo-600/20 transition-all hover:shadow-indigo-500/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Signing in…
              </span>
            ) : "Sign in"}
          </button>

          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-slate-400 hover:text-indigo-400 transition">Forgot password?</Link>
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition">Create account →</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
