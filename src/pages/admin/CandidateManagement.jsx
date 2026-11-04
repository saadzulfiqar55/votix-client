import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCandidates,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getElection,
  getConstituencies,
} from "../../api/elections";

export default function CandidateManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [form, setForm] = useState({ name: "", party: "", partySymbol: "", constituency: "" });
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState(null);

  const load = async () => {
    try {
      const [e, c, con] = await Promise.all([getElection(id), getCandidates(id), getConstituencies()]);
      setElection(e.data.election);
      setCandidates(c.data.candidates || []);
      setConstituencies(con.data.constituencies || []);
    } catch (e) { setErr(e.message); }
  };
  useEffect(() => { load(); }, [id]);

  const reset = () => { setForm({ name: "", party: "", partySymbol: "", constituency: "" }); setEditing(null); };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const payload = { name: form.name, party: form.party, partySymbol: form.partySymbol, constituency: form.constituency };
      if (editing) {
        await updateCandidate(id, editing.id, payload);
      } else {
        await addCandidate(id, payload);
      }
      reset();
      load();
    } catch (e) { setErr(e.response?.data?.message || e.message); }
  };

  const handleEdit = (c) => {
    setEditing(c);
    setForm({ name: c.name, party: c.party, partySymbol: c.partySymbol, constituency: c.constituency?.code || "" });
  };
  const handleDelete = async (c) => {
    if (!window.confirm("Delete this candidate?")) return;
    await deleteCandidate(id, c.id);
    load();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Candidates — {election?.name || ""}</h1>
        <button onClick={() => navigate("/admin/elections")} className="text-sm text-indigo-400">Back to elections</button>
      </div>
      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{err}</div>}

      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" placeholder="Party" value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} required />
        <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" placeholder="Symbol" value={form.partySymbol} onChange={(e) => setForm({ ...form, partySymbol: e.target.value })} required />
        <select className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" value={form.constituency} onChange={(e) => setForm({ ...form, constituency: e.target.value })} required>
          <option value="">Constituency</option>
          {constituencies.map((c) => <option key={c.id} value={c.code}>{c.code}</option>)}
        </select>
        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium">{editing ? "Update" : "Add"}</button>
      </form>

      <div className="space-y-2">
        {candidates.map((c) => (
          <div key={c.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex justify-between items-center">
            <div><span className="text-xl mr-2">{c.partySymbol}</span><b className="text-white">{c.name}</b> <span className="text-sm text-slate-400">{c.party}</span> <span className="text-xs text-slate-500">[{c.constituency?.code}]</span></div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(c)} className="px-3 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-500 text-xs">Edit</button>
              <button onClick={() => handleDelete(c)} className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
