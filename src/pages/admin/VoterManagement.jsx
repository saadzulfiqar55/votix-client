import React, { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "../../api/auth";

export default function VoterManagement() {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState(null);
  const load = async () => {
    try {
      const r = await getUsers();
      setUsers(r.data.users || []);
    } catch (e) { setErr(e.message); }
  };
  useEffect(() => { load(); }, []);

  const setRole = async (id, role) => {
    await updateUser(id, { role });
    load();
  };
  const setActive = async (id, isActive) => {
    await updateUser(id, { isActive });
    load();
  };
  const remove = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Users / Voters</h1>
      {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">{err}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-slate-700">
            <th className="p-3 text-xs uppercase text-slate-400">Email</th><th className="p-3 text-xs uppercase text-slate-400">Voter ID</th>
            <th className="p-3 text-xs uppercase text-slate-400">Role</th><th className="p-3 text-xs uppercase text-slate-400">Verified</th>
            <th className="p-3 text-xs uppercase text-slate-400">Active</th><th className="p-3" />
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-slate-700/50">
                <td className="p-3">{u.email}</td>
                <td className="p-3 text-slate-300">{u.voterId}</td>
                <td className="p-3">
                  <select className="bg-slate-800 border border-slate-700 rounded text-white text-sm px-2 py-1"
                    value={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
                    <option value="voter">voter</option>
                    <option value="election_admin">election_admin</option>
                    <option value="super_admin">super_admin</option>
                  </select>
                </td>
                <td className="p-3">{u.isVerified ? "✅" : "❌"}</td>
                <td className="p-3">{u.isActive ? "✅" : "❌"}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => setActive(u.id, !u.isActive)} className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600">{u.isActive ? "Deactivate" : "Activate"}</button>
                  <button onClick={() => remove(u.id)} className="px-2 py-1 text-xs rounded bg-red-600/80 hover:bg-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
