import { useState } from 'react';
import Header from '../../components/Header';
import CreateElection from '../../components/CreateElection';
import ElectionList from '../../components/ElectionList';

const AdminPanel = () => {
  const [elections, setElections] = useState([]);

  const handleAddElection = (newElection) => {
    setElections(prev => [...prev, newElection]);
  };

  return (
    <div>
      <Header />
      <main className="max-w-3xl mx-auto p-4">
        <CreateElection onAdd={handleAddElection} />
        <ElectionList elections={elections} />
      </main>
    </div>
  );
};

export default AdminPanel;