import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
  CCol,
  CCardText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';

const Sign = () => {
  const [signatureData, setSignatureData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSignatureData();
  }, [page, search]); // Refetch data when page or search changes

  const fetchSignatureData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://44.217.145.210:8132/api/sign/get-sign', {
        params: { page, limit, search },
      });

      const { data, totalPages: total } = response.data;
      setSignatureData(data);
      setTotalPages(total);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle case when no records are found
        setSignatureData([]); // Clear the data
        setTotalPages(1); // Reset pagination
      } else {
        console.error('Error fetching signature data:', error);
      }
      setLoading(false);
    }
  };


  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };


  const handleDeleteSignature = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this signature?');
      if (!confirmDelete) return;

      await axios.delete(`http://44.217.145.210:8132/api/sign/${id}`); // Make delete API call
      setSignatureData((prevData) => prevData.filter((sig) => sig._id !== id)); // Update state
    } catch (error) {
      console.error('Error deleting signature:', error);
      window.alert('Failed to delete signature. Please try again later.');
    }
  };


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'purple' }}>Signature List</h1>
          <input
            type="text"
            placeholder="Search by email"
            value={search}
            onChange={handleSearch}
            style={{ padding: '5px', fontSize: '16px' }}
          />
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {loading ? (
              <div>Loading...</div>
            ) : signatureData.length === 0 ? (
              <div className="no-data">No signature data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                      <CTableHeaderCell scope="col">Tracking No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">User Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">User Email</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Agreement</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {signatureData.map((signature) => (
                        <CTableRow key={signature._id}>
                          <CTableDataCell>{signature.trackingNumber}</CTableDataCell>
                            <CTableDataCell>{signature.userDetails.fullName}</CTableDataCell>
                          <CTableDataCell>{signature.userDetails.email}</CTableDataCell>
                          <CTableDataCell>
                            {signature.pdf ? (
                              <a href={signature.pdf} target="_blank" rel="noopener noreferrer" title="Download Agreement">
                                <FontAwesomeIcon icon={faDownload} size="lg" />
                              </a>
                            ) : (
                              <span>No Agreement</span>
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: '#bb1616', cursor: 'pointer' }}
                              onClick={() => handleDeleteSignature(signature._id)} // Pass the correct signature ID
                            />
                          </CTableDataCell>

                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            )}
          </CCardText>
          {!loading && totalPages > 1 && (
            <div className="pagination">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  disabled={page === i + 1}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    background: page === i + 1 ? 'purple' : 'white',
                    color: page === i + 1 ? 'white' : 'black',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </CCardBody>
      </CCard>

    </>
  );
};

export default Sign;
