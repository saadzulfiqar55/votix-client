import { useState, useEffect } from 'react';
import Header from '../../components/Header';
// Importing candidate data from JSON file
import candidateData from '../../data/candidates.json';

const VotingPanel = () => {
  const [constituency, setConstituency] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    const storedVote = localStorage.getItem(`voted-${constituency}`);
    if (storedVote) setVoted(true);
  }, [constituency]);

  const handleVote = () => {
    if (selectedCandidate) {
      localStorage.setItem(`voted-${constituency}`, JSON.stringify(selectedCandidate));
      setVoted(true);
    }
  };

  const candidates = candidateData.filter(c => c.constituency === constituency);

  return (
    <div>
      <Header />
      <main className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Voting Panel</h2>

        <input
          type="text"
          placeholder="Enter your constituency (e.g., NA-101)"
          value={constituency}
          onChange={(e) => {
            setConstituency(e.target.value);
            setSelectedCandidate(null);
            setVoted(false);
          }}
          className="w-full p-2 border rounded mb-4"
        />

        {constituency && candidates.length === 0 && (
          <p className="text-red-500">No candidates found for this constituency.</p>
        )}

        {candidates.length > 0 && !voted && (
          <form onSubmit={(e) => { e.preventDefault(); handleVote(); }}>
            <fieldset className="space-y-2 mb-4">
              {candidates.map((candidate, index) => (
                <label key={index} className="flex items-center space-x-2 border p-2 rounded hover:bg-gray-100">
                  <input
                    type="radio"
                    name="vote"
                    value={candidate.name}
                    checked={selectedCandidate?.name === candidate.name}
                    onChange={() => setSelectedCandidate(candidate)}
                  />
                  <span>{candidate.symbol} {candidate.name} – {candidate.party}</span>
                </label>
              ))}
            </fieldset>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={!selectedCandidate}
            >
              Submit Vote
            </button>
          </form>
        )}

        {voted && (
          <div className="p-4 mt-4 border rounded bg-green-100 text-green-800">
            ✅ You have already voted in <strong>{constituency}</strong>.
          </div>
        )}
      </main>
    </div>
  );
};

export default VotingPanel;