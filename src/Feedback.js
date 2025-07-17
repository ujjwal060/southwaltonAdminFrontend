import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);


  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://98.82.228.18:8132/api/request/', {
        params: {
          page: currentPage,
          limit: limit,
          search: searchQuery
        }
      });
      console.log('API response:', response.data.data.data); // Debugging response
      setFeedbackData(Array.isArray(response.data.data.data) ? response.data.data.data : []);
      setTotalPages(response.data.data.totalPages); // Set total pages for pagination
    } catch (error) {
      console.error('Error fetching feedback data:', error);
      setFeedbackData([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData();
  }, [currentPage, limit, searchQuery]); // Re-fetch when page, limit, or search query changes

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to page 1 when the search query changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://98.82.228.18:8132/api/request/${id}`);
      setFeedbackData(feedbackData.filter((feedback) => feedback._id !== id));
      window.alert('Feedback successfully deleted');
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <CCard className="d-flex w-100">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h1 style={{ fontSize: '24px', color: 'indianred' }}>Feedback Management</h1>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by name or email"
          style={{ padding: '5px', borderRadius: '4px' }}
        />
      </CCardHeader>
      <CCardBody>
        <CCardText>
          {loading ? (
            <div>Loading...</div>
          ) : feedbackData.length === 0 ? (
            <div className="no-data">No feedback data found.</div>
          ) : (
            <>
              <CTable hover bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">End Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Comments</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {feedbackData.map((feedback) => (
                    <CTableRow key={feedback._id}>
                      <CTableDataCell>{feedback.name}</CTableDataCell>
                      <CTableDataCell>{feedback.email}</CTableDataCell>
                      <CTableDataCell>{new Date(feedback.startDate).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{new Date(feedback.endDate).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{feedback.comment}</CTableDataCell>
                      <CTableDataCell>
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: '#bb1616', cursor: 'pointer' }}
                          onClick={() => handleDeleteFeedback(feedback._id)}
                        />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              {/* Updated Pagination Controls */}
              <div className="pagination-controls">
                <CButton
                  color="primary"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  size="sm"
                >
                  Previous
                </CButton>
                <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
                <CButton
                  color="primary"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  size="sm"
                >
                  Next
                </CButton>
              </div>
            </>
          )}
        </CCardText>
      </CCardBody>
    </CCard>


  );
};

export default Feedback;
