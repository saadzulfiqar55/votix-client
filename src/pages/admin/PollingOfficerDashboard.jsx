import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getPollingStations, verifyVoterSearch, verifyVoterEntry, submitStationResult, getStationResults } from "../../api/elections";

const STATUS_COLORS = {
  DRAFT: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  SUBMITTED: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  APPROVED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  FINALIZED: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  CORRECTION_REQUIRED: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function PollingOfficerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [stationResults, setStationResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        if (user?.assignedPollingStation) {
          const res = await getPollingStations({ constituency: user.constituency });
          const st = res.data.pollingStations.find(s => s._id === user.assignedPollingStation);
          setStation(st || null);
          if (st) {
            const rRes = await getStationResults(
              "current",
              user.constituency,
              "MNA"
            );
            if (rRes.data.results) setStationResults(rRes.data.results);
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [user]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setSearching(true);
    setSearchResult(null);
    try {
      const res = await verifyVoterSearch({
        electionId: "current",
        search: searchTerm,
        pollingStationId: user?.assignedPollingStation,
      });
      setSearchResult(res.data);
    } catch (e) {
      setSearchResult({ error: e.response?.data?.message || "Voter not found" });
    }
    setSearching(false);
  };

  const handleVerify = async () => {
    if (!searchResult?.voter?._id) return;
    setVerifying(true);
    try {
      await verifyVoterEntry(searchResult.voter._id);
      setSearchResult({ ...searchResult, verified: true });
    } catch (e) {
      setSearchResult({ ...searchResult, error: e.response?.data?.message || "Verification failed" });
    }
    setVerifying(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Polling Officer Dashboard</h1>
          <p className="text-slate-400 mt-1">
            Station: {station?.name || "Not assigned"} ({station?.code || "N/A"})
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/results" className="px-4 py-2 rounded-lg bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-700 transition-all text-sm">
            View Results
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="text-slate-400 text-sm">My Station</div>
          <div className="text-2xl font-bold text-white mt-1">{station?.code || "—"}</div>
          <div className="text-slate-500 text-xs mt-1">{station?.name || "Not assigned"}</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-slate-400 text-sm">Station Capacity</div>
          <div className="text-2xl font-bold text-white mt-1">{station?.capacity || 0}</div>
          <div className="text-slate-500 text-xs mt-1">Registered voters</div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="text-slate-400 text-sm">Results Submitted</div>
          <div className="text-2xl font-bold text-white mt-1">{stationResults.length}</div>
          <div className="text-slate-500 text-xs mt-1">Polling station result sheets</div>
        </div>
      </div>

      {/* Voter Verification */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-indigo-400">✓</span> Verify Voter
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name, email, or voter ID..."
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-600/30 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all disabled:opacity-50"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        {searchResult && (
          <div className="mt-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
            {searchResult.error ? (
              <div className="text-red-400 text-sm">{searchResult.error}</div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white font-medium">{searchResult.user?.name}</div>
                  <div className="text-slate-400 text-sm">{searchResult.user?.email}</div>
                  <div className="text-slate-500 text-xs mt-1">Voter ID: {searchResult.user?.voterId}</div>
                  {searchResult.voter?.status && (
                    <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${STATUS_COLORS[searchResult.voter.status] || "bg-slate-500/20 text-slate-300"} border`}>
                      {searchResult.voter.status}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {searchResult.verified ? (
                    <span className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm border border-emerald-500/30">Verified ✓</span>
                  ) : searchResult.voter?.status === "VOTED" ? (
                    <span className="px-4 py-2 bg-amber-500/20 text-amber-300 rounded-lg text-sm border border-amber-500/30">Already Voted</span>
                  ) : (
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm transition-all disabled:opacity-50"
                    >
                      {verifying ? "Verifying..." : "Verify Identity"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Station Results */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-blue-400">📊</span> Station Results
        </h2>
        {stationResults.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-slate-400 text-sm">No results submitted yet for this station.</p>
            <p className="text-slate-500 text-xs mt-1">Results are submitted after counting is complete.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stationResults.map((r) => (
              <div key={r._id} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg border border-slate-700/20">
                <div>
                  <div className="text-white text-sm font-medium">{r.constituencyId?.name || r.constituencyId} — {r.seatType}</div>
                  <div className="text-slate-500 text-xs">Total ballots: {r.totalBallots}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs border ${STATUS_COLORS[r.status] || "bg-slate-500/20 text-slate-300 border-slate-500/30"}`}>
                  {r.status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
