import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormLabel,
  CFormInput,
  CTableDataCell ,
  CFormSelect,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CPagination,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CCardText,
  CPaginationItem
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faComment } from '@fortawesome/free-solid-svg-icons';

const OrderStatusTrack = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newTrackStatus, setNewTrackStatus] = useState('');
  const [visible, setVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get('http://54.205.149.77:8132/api/OrderDetails/status/ACCEPT');
      setOrderDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setNewTrackStatus(order.trackStatus);
    setVisible(true);
  };

  const handleChatOrder = (order) => {
    setSelectedOrder(order);
    setChatVisible(true);
  };

  const handleTrackStatusChange = (event) => {
    setNewTrackStatus(event.target.value);
  };

  const handleUpdateTrackStatus = async () => {
    try {
      await axios.put(`http://54.205.149.77:8132/api/OrderStatusTrack/${selectedOrder._id}`, { trackStatus: newTrackStatus });
      setSelectedOrder({ ...selectedOrder, trackStatus: newTrackStatus });
      setOrderDetails((prevDetails) =>
        prevDetails.map((order) =>
          order._id === selectedOrder._id ? { ...order, trackStatus: newTrackStatus } : order
        )
      );
      setVisible(false);
    } catch (error) {
      console.error('Error updating track status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://54.205.149.77:8132/api/OrderDetails/${orderId}`);
      setOrderDetails(orderDetails.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
  };

  const filteredOrderDetails = filter === 'ALL'
    ? orderDetails
    : orderDetails.filter(order => order.trackStatus === filter);

  return (
    <CCard>
      <CCardHeader style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4>Order Status Tracking</h4>
        <CDropdown className="float-right">
          <CDropdownToggle color="secondary">
            Filter Orders
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => handleFilterChange('ALL')}>All</CDropdownItem>
            <CDropdownItem onClick={() => handleFilterChange('BOOKING PLACED')}>Booking Placed</CDropdownItem>
            <CDropdownItem onClick={() => handleFilterChange('BOOKING CONFIRMED')}>Booking Confirmed</CDropdownItem>
            <CDropdownItem onClick={() => handleFilterChange('ON THE WAY')}>On the way</CDropdownItem>
            <CDropdownItem onClick={() => handleFilterChange('DELIVERED')}>Delivered </CDropdownItem>
            <CDropdownItem onClick={() => handleFilterChange('PICKED UP')}>Picked Up</CDropdownItem>
            
          </CDropdownMenu>
        </CDropdown>
      </CCardHeader>
      <CCardBody>
        <CTable hover bordered striped responsive>
          <CTableHead color="dark">
            <CTableRow>
              <CTableHeaderCell>Order ID</CTableHeaderCell>
              <CTableHeaderCell>Items</CTableHeaderCell>
              <CTableHeaderCell>Date and Time</CTableHeaderCell>
              <CTableHeaderCell>Price</CTableHeaderCell>
              <CTableHeaderCell>Special Note</CTableHeaderCell>
              <CTableHeaderCell>Track Status</CTableHeaderCell>
              <CTableHeaderCell>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {loading ? (
              <CTableRow>
                <CTableDataCell colSpan="7">Loading...</CTableDataCell>
              </CTableRow>
            ) : (
              filteredOrderDetails.map((order, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{order.orderId}</CTableDataCell>
                  <CTableDataCell>{order.items}</CTableDataCell>
                  <CTableDataCell>{order.dateTime}</CTableDataCell>
                  <CTableDataCell>{order.price}</CTableDataCell>
                  <CTableDataCell>{order.specialNote}</CTableDataCell>
                  <CTableDataCell>{order.trackStatus}</CTableDataCell>
                  <CTableDataCell>
                    <CButton onClick={() => handleViewOrder(order)}>
                      <FontAwesomeIcon icon={faEye} style={{ color: '#975c26' }} />
                    </CButton>
                    <CButton onClick={() => handleChatOrder(order)}>
                      <FontAwesomeIcon icon={faComment} style={{ color: '#1d979f' }} />
                    </CButton>
                    <CButton onClick={() => handleDeleteOrder(order._id)}>
                      <FontAwesomeIcon icon={faTrash} style={{ color: '#b71f1f' }} />
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))
            )}
          </CTableBody>
        </CTable>
        <CPagination align="center" aria-label="Page navigation example">
          <CPaginationItem disabled aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </CPaginationItem>
          <CPaginationItem active>1</CPaginationItem>
          <CPaginationItem>2</CPaginationItem>
          <CPaginationItem>3</CPaginationItem>
          <CPaginationItem aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </CPaginationItem>
        </CPagination>
      </CCardBody>

      {selectedOrder && (
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle>View Order</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow>
                <CCol md={6}>
                  <CFormLabel>Order ID</CFormLabel>
                  <CFormInput value={selectedOrder.orderId} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Items</CFormLabel>
                  <CFormInput value={selectedOrder.items} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Date and Time</CFormLabel>
                  <CFormInput value={selectedOrder.dateTime} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Price</CFormLabel>
                  <CFormInput value={selectedOrder.price} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Special Note</CFormLabel>
                  <CFormInput value={selectedOrder.specialNote} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Track Status</CFormLabel>
                  <CFormSelect value={newTrackStatus} onChange={handleTrackStatusChange}>
                    <option value="Order Confirmed">Order Confirmed</option>
                    <option value="Order Being Processed">Order Being Processed</option>
                    <option value="Order Dispatched">Order Dispatched</option>
                    <option value="Order On Its Way">Order On Its Way</option>
                    <option value="Order Received">Order Received</option>
                  </CFormSelect>
                </CCol>
                <CCol md={6}>
                  <CFormLabel>User Name</CFormLabel>
                  <CFormInput value={selectedOrder.userName} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Mobile Number</CFormLabel>
                  <CFormInput value={selectedOrder.mobileNumber} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput value={selectedOrder.email} readOnly />
                </CCol>
                <CCol md={6}>
                  <CFormLabel>Address</CFormLabel>
                  <CFormInput value={selectedOrder.address} readOnly />
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleUpdateTrackStatus}>
              Update Status
            </CButton>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      )}

      {/* Chat Modal (assuming similar structure) */}
      {/* Implement your chat modal here */}

    </CCard>
  );
};

export default OrderStatusTrack;
