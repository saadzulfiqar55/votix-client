import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createElection,
  updateElection,
  getElection,
  addCandidate,
  getConstituencies,
} from "../../api/elections";

export default function CreateElection() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", description: "", electionType: "general",
    startDate: "", endDate: "", constituencyCodes: [],
  });
  const [candidates, setCandidates] = useState([{ name: "", party: "", partySymbol: "", constituency: "" }]);
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    getConstituencies().then((r) => setConstituencies(r.data.constituencies || [])).catch(() => {});
    if (isEdit) {
      getElection(id).then((r) => {
        const e = r.data.election;
        setForm({
          name: e.name,
          description: e.description,
          electionType: e.electionType,
          startDate: new Date(e.startDate).toISOString().slice(0, 16),
          endDate: new Date(e.endDate).toISOString().slice(0, 16),
          constituencyCodes: e.constituencies.map((c) => c.code),
        });
      });
    }
  }, [id, isEdit]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setCodes = (e) => {
    const options = e.target.options;
    const values = Array.from(options).filter((o) => o.selected).map((o) => o.value);
    setForm({ ...form, constituencyCodes: values });
  };

  const cset = (i, k) => (e) => {
    const updated = [...candidates];
    updated[i][k] = e.target.value;
    setCandidates(updated);
  };
  const addCandidateRow = () => setCandidates([...candidates, { name: "", party: "", partySymbol: "", constituency: "" }]);
  const removeCandidate = (i) => setCandidates(candidates.filter((_, idx) => idx !== i));

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      let electionId = id;
      const payload = { ...form, constituencyCodes: form.constituencyCodes };
      if (isEdit) {
        await updateElection(id, payload);
        electionId = id;
      } else {
        const res = await createElection(payload);
        electionId = res.data.election.id;
      }
      const validCandidates = candidates.filter((c) => c.name.trim() && c.party.trim() && c.partySymbol.trim() && c.constituency);
      for (const c of validCandidates) {
        await addCandidate(electionId, { name: c.name, party: c.party, partySymbol: c.partySymbol, constituency: c.constituency });
      }
      navigate("/admin/elections");
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">{isEdit ? "Edit Election" : "New Election"}</h1>
      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{err}</div>}
      <form onSubmit={submit} className="space-y-6">
        <input className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white" placeholder="Election name" value={form.name} onChange={set("name")} required />
        <textarea className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white" placeholder="Description" value={form.description} onChange={set("description")} />
        <select className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white" value={form.electionType} onChange={set("electionType")}>
          <option value="general">General</option>
          <option value="by-election">By-election</option>
          <option value="local">Local</option>
          <option value="primary">Primary</option>
        </select>
        <div className="grid sm:grid-cols-2 gap-4">
          <input type="datetime-local" className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white" value={form.startDate} onChange={set("startDate")} required />
          <input type="datetime-local" className="px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white" value={form.endDate} onChange={set("endDate")} required />
        </div>
        <select multiple className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white" value={form.constituencyCodes} onChange={setCodes} size={6}>
          {constituencies.map((c) => (
            <option key={c.id} value={c.code}>{c.code} — {c.name}</option>
          ))}
        </select>

        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex justify-between"><span className="text-slate-200 font-medium">Candidates</span><button type="button" onClick={addCandidateRow} className="text-sm text-indigo-400">+ add</button></div>
          {candidates.map((c, i) => (
            <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm" placeholder="Name" value={c.name} onChange={cset(i, "name")} />
              <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm" placeholder="Party" value={c.party} onChange={cset(i, "party")} />
              <input className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm" placeholder="Symbol" value={c.partySymbol} onChange={cset(i, "partySymbol")} />
              <select className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-white text-sm" value={c.constituency} onChange={(e) => cset(i, "constituency")(e)}>
                <option value="">Constituency</option>
                {constituencies.map((cc) => <option key={cc.id} value={cc.code}>{cc.code}</option>)}
              </select>
              <button type="button" onClick={() => removeCandidate(i)} className="px-3 py-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-sm">Remove</button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button disabled={loading} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-medium">{loading ? "Saving…" : "Save election"}</button>
          <button type="button" onClick={() => navigate("/admin/elections")} className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600">Cancel</button>
        </div>
      </form>
    </div>
  );
}
