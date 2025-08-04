const ElectionList = ({ elections }) => {
  if (elections.length === 0) {
    return <p className="p-4 text-gray-600">No elections added yet.</p>;
  }

  return (
    <div className="grid gap-4 mt-4">
      {elections.map(election => (
        <div key={election.id} className="p-4 border rounded shadow bg-white">
          <h3 className="text-lg font-bold">{election.title}</h3>
          <p className="text-sm text-gray-700">{election.description}</p>
          <p className="text-sm font-medium">Constituency: {election.constituency}</p>
          <ul className="mt-2 text-sm">
            {election.candidates.map((c, i) => (
              <li key={i}>{c.symbol} {c.name} – {c.party}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ElectionList;