// ForgotPasswordRequest.js
import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://44.217.145.210:8132/api/auths/send-email', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to send password reset email");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header">Forgot Password</h5>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
              </div>
              <button onClick={handleForgotPassword} className="btn btn-info">Send OTP</button>
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordRequest;
