import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CButton,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CPagination,
  CPaginationItem,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';


const Payment = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [viewVisible, setViewVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewPayment, setViewPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");

  const itemsPerPage = 5;

  // Fetch payment data from MongoDB API
  const fetchPaymentData = async (page = 1, email = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://18.209.91.97:8132/api/pay/pays", {
        params: { page, limit: itemsPerPage, email },
      });
      const { data, totalPages: total } = response.data;
      setPaymentData(data || []);
      setTotalPages(total || 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching payment data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData(currentPage, searchEmail);
  }, [currentPage, searchEmail]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 on new search
    fetchPaymentData(1, searchEmail);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  const handleDeletePayment = async (id) => {
    try {
      await axios.delete(`http://18.209.91.97:8132/api/pay/${id}`);
      setPaymentData(paymentData.filter((payment) => payment._id !== id));
      window.alert('Payment successfully deleted');
    } catch (error) {
      console.error('Error deleting payment:', error);
    }
  };
  const handleViewPayment = async (payment) => {
    console.log("Viewing Payment ID:", payment._id);
    try {
      const response = await axios.get(`http://18.209.91.97:8132/api/pay/payment/${payment._id}`);
      if (response) {
        setViewPayment(response.data);
        setViewVisible(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error('Error fetching damage details:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CCard>
        <CCardHeader>
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Payment Management</h1>
          <form
            onSubmit={handleSearch}
            className="mt-2"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Search by email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="form-control"
              style={{ width: "180px" }}
            />
          </form>

        </CCardHeader>
        <CCardBody>
          {paymentData.length === 0 ? (
            <div>No payment data found.</div>
          ) : (
            <>
              <CTable hover bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Payment Id</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Transaction ID</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>

                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {paymentData.map((payment) => (
                    <CTableRow key={payment._id}> {/* Use _id as unique key */}
                      <CTableDataCell>{payment._id}</CTableDataCell> {/* MongoDB's unique ID */}
                      {/* <CTableDataCell>{(payment.amount / 100).toFixed(2)} USD</CTableDataCell> */}
                      <CTableDataCell>
                        {(payment.paymentDetails.transactionDetails.amount / 100).toFixed(2)} USD
                      </CTableDataCell>

                      <CTableDataCell>{payment.paymentDetails.paymentId || 'N/A'}</CTableDataCell>
                      <CTableDataCell>{payment.paymentDetails.transactionDetails.payment_method.billing_details.email || 'N/A'}</CTableDataCell> {/* Adjusted field for email */}
                      <CTableDataCell>{payment.paymentType || 'N/A'}</CTableDataCell>
                      <CTableDataCell style={{ marginRight: '10px' }}>    <CButton size="sm" color="info" onClick={() => handleViewPayment(payment)}>
                        View
                      </CButton>
                        <CButton
                          size="sm"
                          onClick={() => handleDeletePayment(payment._id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            style={{ color: "#bb1616", cursor: "pointer" }}
                          />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CPagination aria-label="Page navigation">
                <CPaginationItem
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </CPaginationItem>
                {[...Array(totalPages).keys()].map((pageNumber) => (
                  <CPaginationItem
                    key={pageNumber + 1}
                    active={pageNumber + 1 === currentPage}
                    onClick={() => handlePageChange(pageNumber + 1)}
                  >
                    {pageNumber + 1}
                  </CPaginationItem>
                ))}
                <CPaginationItem
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </CPaginationItem>
              </CPagination>
            </>
          )}
        </CCardBody>
      </CCard>
      <CModal visible={viewVisible} onClose={() => setViewVisible(false)}>
        <CModalHeader>
          <CModalTitle> Payment Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {viewPayment && (
            <div>
              <h5>Payment Details:</h5>
              {viewPayment.bookingDetails && (
                <ul>
                  <li>Payment ID: {viewPayment.payment._id}</li>
                  <li>Transaction ID: {viewPayment.payment.paymentDetails.paymentId}</li>
                  <li>Amount: {(viewPayment.payment.paymentDetails.transactionDetails.amount / 100).toFixed(2)} USD</li>
                  <li>Email: {viewPayment.payment.paymentDetails.transactionDetails.payment_method.billing_details.email || 'N/A'}</li>
                  <li>Phone: {viewPayment.payment.phone || 'N/A'}</li>
                </ul>
              )}
              <h5>Booking Details:</h5>
              {viewPayment.bookingDetails && (
                <ul>
                  <li>Name: {viewPayment.bookingDetails.bname}</li>
                  <li>Phone: {viewPayment.bookingDetails.bphone}</li>
                  <li>Email: {viewPayment.bookingDetails.bemail}</li>
                  <li>Rental Address: {viewPayment.bookingDetails.baddress}</li>
                  <li>Home Address: {viewPayment.bookingDetails.baddressh}</li>
                  <li>Status: {viewPayment.bookingDetails.status}</li>
                </ul>
              )}
              <h5>Reservation Details:</h5>
              {viewPayment.reservationDetails && (
                <ul>
                  <li>Pickup: {viewPayment.reservationDetails.pickup}</li>
                  <li>Drop-off: {viewPayment.reservationDetails.drop}</li>
                  <li>Pickup Date: {viewPayment.reservationDetails.pickdate}</li>
                  <li>Drop-off Date: {viewPayment.reservationDetails.dropdate}</li>
                  <li>Days: {viewPayment.reservationDetails.days}</li>
                  <li>Reserve Amount: {viewPayment.reservationDetails.reserveAmount}</li>
                </ul>
              )}



              <h5>Vehicle Details:</h5>
              {viewPayment.vehicleDetails && (
                <ul>
                  <li>Name: {viewPayment.vehicleDetails.vname}</li>
                  <li>Seats: {viewPayment.vehicleDetails.passenger}</li>
                  <li>Tag Number: {viewPayment.vehicleDetails.tagNumber}</li>
                  <li>
                    Image:
                    {viewPayment.vehicleDetails.image && viewPayment.vehicleDetails.image.length > 0 ? (
                      <img
                        src={viewPayment.vehicleDetails.image}
                        alt="Vehicle"
                        style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                      />
                    ) : (
                      <span> No image available</span>
                    )}
                  </li>
                </ul>
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

export default Payment;
