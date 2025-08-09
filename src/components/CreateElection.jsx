import { useState } from 'react';
import { createElection } from '../api/elections';

const CreateElection = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    constituency: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await createElection(formData);
      if (onAdd) onAdd(data);
      setFormData({ title: '', description: '', constituency: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded bg-white shadow"
    >
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
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Creating...' : 'Add Election'}
      </button>
    </form>
  );
};

export default CreateElection;
