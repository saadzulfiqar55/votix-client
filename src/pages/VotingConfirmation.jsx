import React from "react";
import { Link } from "react-router-dom";

export default function VoteConfirmation() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 glass rounded-2xl shadow-2xl animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/15 flex items-center justify-center animate-float">
          <span className="text-4xl">✅</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white"> Votes Recorded!</h1>
          <p className="text-slate-400 mt-2">Thank you for participating in the election. Your votes for both MNA and MPA seats have been securely recorded.</p>
        </div>
        <div className="glass rounded-xl p-4 text-left space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 text-xs font-semibold">MNA</span>
            <span className="text-slate-300">National Assembly vote recorded</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 text-xs font-semibold">MPA</span>
            <span className="text-slate-300">Provincial Assembly vote recorded</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/results"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium shadow-lg shadow-indigo-600/20 transition"
          >
            View Results →
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
