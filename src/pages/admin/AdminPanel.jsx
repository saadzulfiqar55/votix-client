import { useState, useEffect } from 'react';
import CreateElection from '../../components/CreateElection';
import { getElections } from '../../api/elections';

const AdminPanel = () => {
  const [elections, setElections] = useState([]);

  const fetchElections = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await getElections(token);
      setElections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="p-4">
      <CreateElection onAdd={(election) => setElections(prev => [...prev, election])} />
      <h2 className="text-lg font-bold mt-6">All Elections</h2>
      <ul className="mt-2 space-y-2">
        {elections.map(e => (
          <li key={e._id} className="border p-2 rounded bg-gray-50">
            {e.title} - {e.constituency}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
