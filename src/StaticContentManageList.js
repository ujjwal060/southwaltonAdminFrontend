import React, { useState } from 'react';
import axios from 'axios';
import './StaticContentManageList.css'; // Import CSS file for styling

const StaticContentManageList = () => {
  const [policy, setPolicy] = useState('');
  const [termsandconditions, setTermsAndConditions] = useState('');

  const handleAddStaticContent = async () => {
    try {
      const response = await axios.post('http://54.205.149.77:8132/api/StaticContentManageData/StaticContent', { policy, termsandconditions });
      console.log('New static content added:', response.data);
      setPolicy('');
      setTermsAndConditions('');
    } catch (error) {
      console.error('Error adding static content:', error);
    }
  };

  const handleUpdateStaticContent = async () => {
    try {
      // Assuming you have the ID of the static content you want to update
      const id = 'your_static_content_id';
      const response = await axios.put(`http://54.205.149.77:8132/api/StaticContentManageData/${id}`, { policy, termsandconditions });
      console.log('Static content updated:', response.data);
      setPolicy('');
      setTermsAndConditions('');
    } catch (error) {
      console.error('Error updating static content:', error);
    }
  };

  return (
    <div className="static-content-manage">
      <h1>Static Content Management</h1>
      <div className="input-container">
        <label htmlFor="policy">Policy:</label>
        <input type="text" id="policy" value={policy} onChange={e => setPolicy(e.target.value)} />
      </div>
      <div className="input-container">
        <label htmlFor="termsandconditions">Terms and Conditions:</label>
        <input type="text" id="termsandconditions" value={termsandconditions} onChange={e => setTermsAndConditions(e.target.value)} />
      </div>
      <div className="button-container">
        <button className="add-button" onClick={handleAddStaticContent}>Add Static Content</button>
        <button className="update-button" onClick={handleUpdateStaticContent}>Update Static Content</button>
      </div>
    </div>
  );
};

export default StaticContentManageList;
