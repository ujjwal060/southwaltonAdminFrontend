import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
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
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CCol,
  CCardText,
  CButton,
  CTable,
  CTableHead,
  CTableDataCell,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
} from '@coreui/react';
import './UserManageList.css'; // Import CSS file for styling

const UserManageList = () => {
  const [userManageData, setUserManageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState('Deactive');
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // Adjust debounce time as needed

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch user data from the backend
  const fetchUserManageData = async (page = 1, query = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://98.82.228.18:8132/api/user/', {
        params: {
          page,
          limit: 8, // Adjust limit as needed
          query,
        },
      });
      const { users, totalPages } = response.data.data;

      setUserManageData(users);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching user manage data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchUserManageData(page, debouncedQuery);
  };

  // Fetch data on initial load and query change
  useEffect(() => {
    fetchUserManageData(1, debouncedQuery);
  }, [debouncedQuery]);

  // Add user
  const handleAddUserManage = async () => {
    const formData = new FormData();
    if (image) formData.append('image', image);
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phoneNumber', phoneNumber);
    formData.append('state', state);
    formData.append('status', status);

    try {
      const response = await axios.post('http://98.82.228.18:8132/api/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // fetchUserManageData();
      setUserManageData([...userManageData, response.data]);
      window.alert('User successfully added');
      resetForm();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update user
  const handleUpdateUserManage = async () => {
    const formData = new FormData();

    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('phoneNumber', phoneNumber);
    formData.append('state', state);
    formData.append('status', status);

    try {
      const response = await axios.put(`http://98.82.228.18:8132/api/user/${editUserId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserManageData(userManageData.map(user => user._id === editUserId ? response.data : user));
      window.alert('User successfully updated');
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle add/update
  const handleAddOrUpdateUserManage = () => {
    if (editing) {
      handleUpdateUserManage();
    } else {
      handleAddUserManage();
    }
  };

  // Delete user
  const handleDeleteUserManage = async (id) => {
    try {
      await axios.delete(`http://98.82.228.18:8132/api/user/${id}`);
      setUserManageData(userManageData.filter(user => user._id !== id));
      window.alert('User successfully deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Set form values for editing
  // const handleEditUserManage = (user) => {

  //   setFullName(user.fullName);
  //   setEmail(user.email);
  //   setPassword(user.password);
  //   setPhoneNumber(user.phoneNumber);
  //   setState(user.state);
  //   setStatus(user.status);
  //   setEditUserId(user._id);
  //   setEditing(true);
  //   setVisible(true);
  // };


  // Activate or deactivate user
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Deactive' : 'Active';
    const data = { id, status: newStatus };

    try {
      const response = await axios.post('http://98.82.228.18:8132/api/user/status', data);
      console.log("Status update response:", response.data);

      if (response.data && response.data.success) {
        // Update local state with new user data
        setUserManageData((prevData) =>
          prevData.map((user) =>
            user._id === id ? { ...user, isActive: newStatus } : user
          )
        );
        window.alert('User status updated successfully');
      } else {
        console.error('Unexpected response:', response.data);
        window.alert('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      window.alert('Error occurred while updating status');
    }
  };



  // Reset form fields
  const resetForm = () => {
    setImage(null);
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setState('');
    setStatus('');
    setVisible(false);
    setEditing(false);
    setEditUserId(null);
    // Optionally refetch data to ensure the latest list
    fetchUserManageData();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'thistle' }}>User Manage List</h1>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="me-3"
              style={{ width: "180px", marginRight: "0rem" }}
            />

          </div>

        </CCardHeader>
        <CCardBody>
          <CCardText>
            {loading ? (
              <div>Loading...</div>
            ) : userManageData.length === 0 ? (
              <div className="no-data">No user data found.</div>
            ) : (
              <>
                <CRow>
                  <CCol>
                    <CTable hover bordered striped responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Mobile No.</CTableHeaderCell>
                          <CTableHeaderCell scope="col">State</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {userManageData.map((user) => (
                          <CTableRow key={user._id}>
                            <CTableDataCell>{user.fullName}</CTableDataCell>
                            <CTableDataCell>{user.email}</CTableDataCell>
                            <CTableDataCell>{user.phoneNumber}</CTableDataCell>
                            <CTableDataCell>{user.state}</CTableDataCell>
                            <CTableDataCell>
                              <span
                                style={{
                                  color: user.isActive === 'Active' ? 'green' : 'red',
                                  fontWeight: 'bold',
                                }}
                              >
                                {user.isActive === 'Active' ? 'ACTIVE' : 'INACTIVE'}
                              </span>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton  size="sm"
                                style={{
                                  padding: '5px 10px',
                                  backgroundColor: user.isActive === 'Active' ? '#b3ae0f' : '#0d6efd',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  marginRight: '10px',
                                  
                                }}
                                onClick={() => handleToggleStatus(user._id, user.isActive)}
                              >
                                {user.isActive === 'Active' ? 'Deactivate' : 'Activate'}
                              </CButton>
                              <FontAwesomeIcon
                                icon={faTrash}
                                style={{ color: '#f00000', cursor: 'pointer' }}
                                onClick={() => handleDeleteUserManage(user._id)}
                              />
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </CCol>
                </CRow>
                <div className="pagination">
                  {[...Array(totalPages)].map((_, index) => (
                    <CButton
                      key={index}
                      color={index + 1 === currentPage ? 'primary' : 'secondary'}
                      className="me-2"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </CButton>
                  ))}
                </div>
              </>
            )}
          </CCardText>
        </CCardBody>

      </CCard>
    </>
  );
};

export default UserManageList;
