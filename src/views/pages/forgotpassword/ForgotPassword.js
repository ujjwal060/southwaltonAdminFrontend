import React, { useState } from 'react';
//import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
 // const history = useHistory();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://52.20.55.193:8132/api/auths/send-email', { email });
      setMessage(response.data.message);
      if (response.status === 200) {
       // history.push('/reset-password');
      }
    } catch (error) {
      setMessage("Failed to send password reset email");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
      </div>
      <button onClick={handleForgotPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
