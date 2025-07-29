import React, { useState } from 'react';
import axios from 'axios';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('http://54.205.149.77:8132/api/auth/verify-otp', { email, otp });
      setMessage(response.data.message);
      if (response.status === 200) {
        window.location.href = 'http://54.205.149.77:2023/reset-password'; // Redirect to reset password page
      }
    } catch (error) {
      setMessage("Failed to verify OTP");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header">Verify OTP</h5>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label">OTP:</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} className="form-control" />
              </div>
              <button onClick={handleVerifyOTP} className="btn btn-info">Verify OTP</button>
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
