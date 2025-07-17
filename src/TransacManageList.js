import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const TransacManageList = () => {
  const [transacManageData, setTransacManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    sno: '',
    productname: '',
    password: '', // Changed from bookingID to password
    bookingdate: '',
    transactionamount: '',
    transactiondate: '',
    transactionstatus: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTransacManageData = async () => {
      try {
        const response = await axios.get('http://98.82.228.18:8132/api/TransacManageData/');
        setTransacManageData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching transac manage data:', error);
        setLoading(false);
      }
    };

    fetchTransacManageData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTransacManage = async () => {
    try {
      const response = await axios.post('http://98.82.228.18:8132/api/TransacManageData/password', formData);
      setTransacManageData([...transacManageData, response.data]);
      setFormData({
        sno: '',
        productname: '',
        password: '', // Reset password field
        bookingdate: '',
        transactionamount: '',
        transactiondate: '',
        transactionstatus: '',
      });
      setVisible(false);
    } catch (error) {
      console.error('Error adding transac manage:', error);
    }
  };

  const handleDeleteTransacManage = async (id) => {
    try {
      await axios.delete(`http://98.82.228.18:8132/api/TransacManageData/${id}`);
      setTransacManageData(transacManageData.filter((transac) => transac._id !== id));
    } catch (error) {
      console.error('Error deleting transac manage:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (transacManageData.length === 0) {
    return <div>No transac manage data found.</div>;
  }

  const filteredTransactions = transacManageData.filter((transac) => {
    const password = transac.password;
    return password && typeof password === 'string' && password.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <CCard>
        <CCardHeader className="d-flex justify-content-between">
          <div className="w-25">
            <CForm>
              <CFormInput
                type="text"
                placeholder="Search by Password"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </CForm>
          </div>
          <CButton color="primary" onClick={() => setVisible(true)}>
            Add Transaction
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CTable striped>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">S no.</CTableHeaderCell>
                <CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
                <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                <CTableHeaderCell scope="col">Booking Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Transaction Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col">Transaction Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Transaction Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {filteredTransactions.map((transac, index) => (
                <CTableRow key={transac._id}>
                  <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{transac.productname}</CTableDataCell>
                  <CTableDataCell>{transac.password}</CTableDataCell>
                  <CTableDataCell>{transac.bookingdate}</CTableDataCell>
                  <CTableDataCell>{transac.transactionamount}</CTableDataCell>
                  <CTableDataCell>{transac.transactiondate}</CTableDataCell>
                  <CTableDataCell>{transac.transactionstatus}</CTableDataCell>
                  <CTableDataCell>
                            
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: '#bb1616', cursor: 'pointer' }}
                              onClick={() => handleDeleteTransacManage(transac._id)}
                            />
                          </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Add Transaction</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol>
                <CFormInput type="text" name="sno" value={formData.sno} onChange={handleInputChange} placeholder="S no." />
              </CCol>
              <CCol>
                <CFormInput type="text" name="productname" value={formData.productname} onChange={handleInputChange} placeholder="Product Name" />
              </CCol>
              <CCol>
                <CFormInput type="text" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput type="date" name="bookingdate" value={formData.bookingdate} onChange={handleInputChange} placeholder="Booking Date" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput type="text" name="transactionamount" value={formData.transactionamount} onChange={handleInputChange} placeholder="Transaction Amount" />
              </CCol>
              <CCol>
                <CFormInput type="date" name="transactiondate" value={formData.transactiondate} onChange={handleInputChange} placeholder="Transaction Date" />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol>
                <CFormInput type="text" name="transactionstatus" value={formData.transactionstatus} onChange={handleInputChange} placeholder="Transaction Status" />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleAddTransacManage}>Add Transaction</CButton>{' '}
          <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default TransacManageList;
