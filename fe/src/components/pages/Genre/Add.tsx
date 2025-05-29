import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await axios.post('http://localhost:3000/genres', { name });
    navigate('/movies/genres');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Thêm thể loại</h2>
      <input
        type="text"
        value={name}
        placeholder="Tên thể loại"
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Thêm</button>
    </form>
  );
};

export default Add;
