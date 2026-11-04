import React, { useEffect, useState } from "react";
import { createConstituency, getConstituencies, deleteConstituency } from "../../api/elections";

export default function ConstituencyManagement() {
  const [constituencies, setConstituencies] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", province: "", district: "" });
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const load = async () => {
    const r = await getConstituencies();
    setConstituencies(r.data.constituencies || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null); setOk(null);
    try {
      await createConstituency(form);
      setOk("Constituency created");
      setForm({ name: "", code: "", province: "", district: "" });
      load();
    } catch (e) { setErr(e.response?.data?.message || e.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this constituency?")) return;
    await deleteConstituency(id);
    load();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Constituencies</h1>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" placeholder="Code e.g. NA-1" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" placeholder="Province" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} required />
        <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white" placeholder="District" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} required />
        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500">Create</button>
      </form>
      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{err}</div>}
      {ok && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">{ok}</div>}
      <div className="space-y-2">
        {constituencies.map((c) => (
          <div key={c.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700 flex justify-between">
            <div><b className="text-white">{c.code}</b> — {c.name} ({c.province}, {c.district})</div>
            <button onClick={() => handleDelete(c.id)} className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-500 text-xs">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
