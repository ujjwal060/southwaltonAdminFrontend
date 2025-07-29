
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react';

const CustDamageManage = () => {
  const [damageManageData, setDamageManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(''); // For search query
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });
  const fetchDamageManageData = async () => {
    try {
      const response = await axios.get('http://54.205.149.77:8132/api/customer-damages/', {
        params: {
          page: pagination.currentPage,
          limit: pagination.itemsPerPage,
          search: search,
        },
      });

      setDamageManageData(response.data.data);
      setPagination({
        ...pagination,
        totalItems: response.data.pagination.totalItems,
        totalPages: response.data.pagination.totalPages,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching damage manage data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDamageManageData();
  }, [pagination.currentPage, search]);

  const handleDeleteDamageManage = async (id) => {
    try {
      await axios.delete(`http://54.205.149.77:8132/api/customer-damages/${id}`);
      setDamageManageData(damageManageData.filter((damage) => damage._id !== id));
      window.alert('Customer damage successfully deleted');
    } catch (error) {
      console.error('Error deleting damage manage:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination({ ...pagination, currentPage: 1 }); // Reset to page 1 when search is updated
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: newPage });
    }
  };

  return (
    <CCard className="d-flex 100%">
      <CCardHeader className="d-flex justify-content-between align-items-center">
        <h1 style={{ fontSize: '24px', color: 'dodgerblue' }}>Customer Damage Management</h1>
        <input
          type="text"
          placeholder="Search by vname or tag"
          value={search}
          onChange={handleSearchChange}
          style={{ padding: '5px', marginRight: '10px' }}
        />
      </CCardHeader>
      <CCardBody>
        <CCardText>
          {damageManageData.length === 0 ? (
            <div className="no-data">No customer damage data found.</div>
          ) : (
            <CRow>
              <CCol>
                <CTable hover bordered striped responsive>
                  <CTableHead color="dark">
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Payment ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                      <CTableHeaderCell scope="col">DReasons</CTableHeaderCell>
                      <CTableHeaderCell scope="col">AReasons</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Images</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {damageManageData.map((damage) => (
                      <CTableRow key={damage._id}>
                        <CTableDataCell>{damage._id}</CTableDataCell>
                        <CTableDataCell>{damage.paymentId}</CTableDataCell>
                        <CTableDataCell>{damage.description}</CTableDataCell>
                        <CTableDataCell>{damage.DReasons.join(', ')}</CTableDataCell>
                        <CTableDataCell>{damage.AReasons.join(', ')}</CTableDataCell>
                        <CTableDataCell>
                          {damage.images && damage.images.length > 0 && (
                            <img
                              src={damage.images[0]}
                              alt="Damage"
                              style={{ width: '100px', height: 'auto' }}
                            />
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            size="sm"
                            onClick={() => handleDeleteDamageManage(damage._id)}
                            color="danger"
                          >
                            Delete
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <div className="pagination d-flex align-items-center mt-3">
                  <CButton
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    size="sm"
                    color="primary"
                  >
                    Previous
                  </CButton>
                  <span style={{ margin: "0 10px" }}>{`Page ${pagination.currentPage} of ${pagination.totalPages}`}</span>
                  <CButton
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    size="sm"
                     color="primary"
                  >
                    Next
                  </CButton>
                </div>
              </CCol>
            </CRow>
          )}
        </CCardText>
      </CCardBody>
    </CCard>
  );
};

export default CustDamageManage;
