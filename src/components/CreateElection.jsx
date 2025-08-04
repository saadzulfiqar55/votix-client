import { useState } from 'react';
import candidateData from '../data/candidates.json';

const CreateElection = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    constituency: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredCandidates = candidateData.filter(
      c => c.constituency === formData.constituency
    );
    const newElection = {
      ...formData,
      id: Date.now(),
      candidates: filteredCandidates
    };
    onAdd(newElection);
    setFormData({ title: '', description: '', constituency: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-bold">Create Election</h2>
      <input
        type="text"
        name="title"
        placeholder="Election Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="constituency"
        placeholder="Constituency (e.g., NA-101)"
        value={formData.constituency}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Election
      </button>
    </form>
  );
};

export default CreateElection;