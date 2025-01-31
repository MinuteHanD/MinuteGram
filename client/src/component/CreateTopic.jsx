import React, { useState } from 'react';
import api from '../service/apiClient';

const CreateTopic = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createTopic = async () => {
    try {
      await api.post('/topics', { name, description });
      alert('Topic created successfully!');
      setName('');
      setDescription('');
    } catch (err) {
      alert('Failed to create topic');
    }
  };

  return (
    <div>
      <h2>Create Topic</h2>
      <input
        type="text"
        placeholder="Topic Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={createTopic}>Create</button>
    </div>
  );
};

export default CreateTopic;
