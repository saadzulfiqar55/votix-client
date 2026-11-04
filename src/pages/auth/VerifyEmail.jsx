import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../api/auth";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("idle");
  const [msg, setMsg] = useState(null);

  const verify = async () => {
    if (!token) {
      setStatus("error");
      setMsg("Missing verification token.");
      return;
    }
    try {
      await verifyEmail(token);
      setStatus("ok");
    } catch (err) {
      setStatus("error");
      setMsg(err.response?.data?.message || "Verification failed.");
    }
  };

  React.useEffect(() => { if (token) verify(); }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
        <h1 className="text-2xl font-bold text-white">Email verification</h1>
        {status === "ok" && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">Email verified! You can now sign in.</div>}
        {status === "error" && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{msg}</div>}
        {status === "idle" && <div className="text-slate-400">Verifying…</div>}
        <Link to="/login" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm">Go to login</Link>
      </div>
    </div>
  );
}
