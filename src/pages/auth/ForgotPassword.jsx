import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await forgotPassword(email);
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Request failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form onSubmit={submit} className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-3xl p-8 space-y-6 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Reset password</h1>
        {msg && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">{msg}</div>}
        {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
        <input className="w-full px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium text-white">Send reset link</button>
        <div className="text-center text-sm text-slate-400"><Link to="/login" className="text-indigo-400">Back to login</Link></div>
      </form>
    </div>
  );
}
