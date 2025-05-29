import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/genres/${id}`)
      .then(res => setName(res.data.name));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`http://localhost:3000/genres/${id}`, { name });
    navigate('/movies/genres');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sửa thể loại</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Cập nhật</button>
    </form>
  );
};

export default Edit;
