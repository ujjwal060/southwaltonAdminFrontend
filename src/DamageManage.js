import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';

const stripePromise = loadStripe('pk_test_51Px48IHrMJArnuTlyXynQWb7bamh1ZH6jOlbg6anUY5HSq0TrcBRb0TO5yOu6e39vXmJpCPkaiFNSgCxBNeUK1CB00ckW9Tphf');

const DamageManage = () => {
  const [damageManageData, setDamageManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDamage, setSelectedDamage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [viewDamage, setViewDamage] = useState(null);
  const [viewVisible, setViewVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default page size
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDamageManageData = async (page = 1, limit = 5, search = '') => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://54.205.149.77:8132/api/damage?page=${page}&limit=${limit}&search=${search}`
      );
      const { data, pagination } = response.data;
      setDamageManageData(data);
      setTotalPages(pagination.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching damage manage data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDamageManageData(currentPage, pageSize, searchTerm);
  }, [currentPage, pageSize, searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on page size change
  };

  const handleDeleteDamageManage = async (id) => {
    try {
      await axios.delete(`http://54.205.149.77:8132/api/damage/${id}`);
      setDamageManageData(damageManageData.filter((damage) => damage._id !== id));
      window.alert('Damage successfully deleted');
    } catch (error) {
      console.error('Error deleting damage manage:', error);
    }
  };

  const handleRefund = async (damage) => {
    setSelectedDamage(damage);
    setVisible(true);
  };

  const confirmRefund = async () => {
    if (!selectedDamage) return;

    try {
      // Send the payment ID in the URL as required by the backend
      const response = await axios.post(`http://54.205.149.77:8132/api/damage/refund/${selectedDamage.paymentId}`);
      if (response.data.success) {
        alert(`Refund processed successfully: ${response.data.message}`);
        setDamageManageData(damageManageData.map((damage) =>
          damage.paymentId === selectedDamage.paymentId ? { ...damage, refunded: true } : damage
        ));
      } else {
        alert(`Refund failed: ${response.data.message}`);
      }
      setVisible(false);
    } catch (error) {
      console.error('Error processing refund:', error);
      alert('Failed to process refund: ' + (error.response?.data?.message || error.message));
    }
  };





  const handleGeneratePDF = async (damageId) => {
    try {
      const response = await axios.post('http://54.205.149.77:8132/api/damage/send-damage-report', { damageId }, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `damage_report_${damageId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };


  const handleViewDamage = async (damage) => {
    console.log("Viewing Damage ID:", damage._id);
    try {
      const response = await axios.get(`http://54.205.149.77:8132/api/damage/${damage._id}`);
      if (response.data.success) {
        setViewDamage(response.data.data);
        setViewVisible(true);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching damage details:', error);
    }
  };


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'dodgerblue' }}>Damage Management</h1>
          <div>
            <input
              type="text"
              placeholder="Search by tag or name"
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ marginRight: '10px' }}
            />
            <select value={pageSize} onChange={handlePageSizeChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {loading ? (
              <div>Loading...</div>
            ) : damageManageData.length === 0 ? (
              <div className="no-data">No damage manage data found.</div>
            ) : (
              <>
                <CRow>
                  <CCol>
                    <CTable hover bordered striped responsive>
                      <CTableHead color="dark">
                        <CTableRow>
                          <CTableHeaderCell scope="col">Booking ID</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Transaction ID</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Damage</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Images</CTableHeaderCell>
                          <CTableHeaderCell scope="col">PDF</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {damageManageData.map((damage) => (
                          <CTableRow key={damage._id}>
                            <CTableDataCell>{damage.bookingId}</CTableDataCell>
                            <CTableDataCell>{damage.transactionId}</CTableDataCell>
                            <CTableDataCell>{damage.damage ? 'Yes' : 'No'}</CTableDataCell>
                            <CTableDataCell>
                              {damage.images && damage.images.length > 0 ? (
                                damage.images.map((imgSrc, index) => (
                                  <img
                                    key={index}
                                    src={imgSrc}
                                    alt={`Damage ${index + 1}`}
                                    style={{ width: '100px', marginRight: '10px' }}
                                  />
                                ))
                              ) : (
                                <span>No Damage</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="success"
                                size="sm"
                                style={{ padding: '2px 6px', fontSize: '12px' }}
                                onClick={() => handleGeneratePDF(damage._id)}
                                className="me-2"
                              >
                                <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '10px' }} /> Generate PDF
                              </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton size="sm" color="info" onClick={() => handleViewDamage(damage)}>
                                View
                              </CButton>
                              <CButton size="sm" color="warning" onClick={() => handleRefund(damage)}>
                                Refund
                              </CButton>
                              <CButton size="sm" color="danger" onClick={() => handleDeleteDamageManage(damage._id)}>
                                Delete
                              </CButton>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
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

      {/* Refund Modal */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Confirm Refund</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>Are you sure you want to refund the transaction {selectedDamage?.transactionId}?</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
          <CButton color="primary" onClick={confirmRefund}>Confirm Refund</CButton>
        </CModalFooter>
      </CModal>

      {/* View Damage Modal */}
      <CModal visible={viewVisible} onClose={() => setViewVisible(false)}>
        <CModalHeader>
          <CModalTitle>Damage Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewDamage && (
            <div>
              <h5>Booking ID: {viewDamage.bookingId}</h5>
              <h5>Transaction ID: {viewDamage.transactionId}</h5>
              <h5>Damage Description: {viewDamage.damage}</h5>
              <h5>Booking Details:</h5>
              {viewDamage.bookingDetails && (
                <ul>
                  <li>Pickup: {viewDamage.bookingDetails.bpickup}</li>
                  <li>Drop-off: {viewDamage.bookingDetails.bdrop}</li>
                  <li>Pickup Date: {viewDamage.bookingDetails.bpickDate}</li>
                  <li>Drop-off Date: {viewDamage.bookingDetails.bdropDate}</li>
                  <li>Name: {viewDamage.bookingDetails.bname}</li>
                  <li>Phone: {viewDamage.bookingDetails.bphone}</li>
                  <li>Email: {viewDamage.bookingDetails.bemail}</li>
                  <li>Address: {viewDamage.bookingDetails.baddress}</li>
                  <li>Additional Address: {viewDamage.bookingDetails.baddressh}</li>
                </ul>
              )}

              <h5>Vehicle Details:</h5>
              {viewDamage.vehicleDetails && (
                <ul>
                  <li>Name: {viewDamage.vehicleDetails.vname}</li>
                  <li>Seats: {viewDamage.vehicleDetails.passenger}</li>
                  <li>Tag Number: {viewDamage.vehicleDetails.tagNumber}</li>
                  <li>
                    Image:
                    {viewDamage.vehicleDetails.image && viewDamage.vehicleDetails.image.length > 0 ? (
                      <img
                        src={viewDamage.vehicleDetails.image[0]}
                        alt="Vehicle"
                        style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                      />
                    ) : (
                      <span> No Damage</span>
                    )}
                  </li>
                </ul>
              )}

              <h5>Damage Images:</h5>
              {viewDamage.images && viewDamage.images.length > 0 ? (
                viewDamage.images.map((imgSrc, index) => (
                  <img
                    key={index}
                    src={imgSrc}
                    alt={`Damage ${index + 1}`}
                    style={{ width: '100px', marginRight: '10px' }}
                  />
                ))
              ) : (
                <span>No Damage</span>
              )}

            </div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setViewVisible(false)}>Close</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default DamageManage;
