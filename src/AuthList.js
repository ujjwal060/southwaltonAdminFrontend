import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthList = () => {
  const [auths, setAuths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const fetchAuths = async () => {
    try {
      const response = await axios.get('http://18.209.91.97:8132/api/auths/');
      setAuths(response.data);
      console.log(response)
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAuths();
  }, []);

  const handleAddAuth = async () => {
    try {
      const response = await axios.post('http://18.209.91.97:8132/api/auths/website', { username, email, password });
      setAuths([...auths, response.data]);
      setUsername('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAuth = async (id) => {
    try {
      await axios.delete(`http://18.209.91.97:8132/api/auths/${id}`);
      setAuths(auths.filter(auth => auth._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (auths.length === 0) {
    return <div>No auths found.</div>;
  }

  return (
    <div>
      <h1>Auth List</h1>
      <ul>
        {auths.map(auth => (
          <li key={auth._id}>
            <span>{auth.username}</span>
            <button onClick={() => handleDeleteAuth(auth._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleAddAuth}>Add Auth</button>
    </div>
  );
};

export default AuthList;
