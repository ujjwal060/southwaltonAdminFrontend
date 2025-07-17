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
  CRow,
  CCol,
  CCardText,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const TaskManageList = () => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [driverName, setDriverName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [visible, setVisible] = useState(false);

  const fetchTaskData = async () => {
    try {
      const response = await axios.get('http://98.82.228.18:8132/api/task');
      setTaskData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskData();
  }, []);

  const handleAddTask = async () => {
    try {
      const response = await axios.post(
        'http://98.82.228.18:8132/api/task/add',
        {
          driverName,
          customerName,
          pickupAddress,
          deliveryAddress,
          pickupDate,
          deliveryDate,
        }
      );
      setTaskData([...taskData, response.data]);
      resetForm();
      setVisible(false);
      window.alert('Task successfully added');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = (task) => {
    setDriverName(task.driverName);
    setCustomerName(task.customerName);
    setPickupAddress(task.pickupAddress);
    setDeliveryAddress(task.deliveryAddress);
    setPickupDate(task.pickupDate);
    setDeliveryDate(task.deliveryDate);

    setEditMode(true);
    setCurrentTaskId(task._id);
    setVisible(true);
  };

  const handleUpdateTask = async () => {
    try {
      const response = await axios.put(
        `http://98.82.228.18:8132/api/task/${currentTaskId}`,
        {
          driverName,
          customerName,
          pickupAddress,
          deliveryAddress,
          pickupDate,
          deliveryDate,
        }
      );
      const updatedTask = response.data;

      setTaskData(
        taskData.map((task) =>
          task._id === currentTaskId ? { ...task, ...updatedTask } : task
        )
      );

      resetForm();
      setEditMode(false);
      setCurrentTaskId(null);
      setVisible(false);
      window.alert('Task successfully updated');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://98.82.228.18:8132/api/task/${id}`);
      setTaskData(taskData.filter((task) => task._id !== id));
      window.alert('Task successfully deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const resetForm = () => {
    setDriverName('');
    setCustomerName('');
    setPickupAddress('');
    setDeliveryAddress('');
    setPickupDate('');
    setDeliveryDate('');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex 100%">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'purple' }}>Task Manage List</h1>
          <CButton
            color="primary"
            size="sm"
            className="me-md-2"
            onClick={() => {
              resetForm();
              setEditMode(false);
              setVisible(true);
            }}
          >
            {editMode ? 'Edit Task' : 'Add Task'}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {taskData.length === 0 ? (
              <div className="no-data">No task data found.</div>
            ) : (
              <CRow>
                <CCol>
                  <CTable hover bordered striped responsive>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">Driver Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Customer Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Pickup Address</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Delivery Address</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Pickup Date</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Delivery Date</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {taskData.map((task, index) => (
                        <CTableRow key={task._id}>
                          <CTableDataCell>{task.driverName}</CTableDataCell>
                          <CTableDataCell>{task.customerName}</CTableDataCell>
                          <CTableDataCell>{task.pickupAddress}</CTableDataCell>
                          <CTableDataCell>{task.deliveryAddress}</CTableDataCell>
                          <CTableDataCell>{task.pickupDate}</CTableDataCell>
                          <CTableDataCell>{task.deliveryDate}</CTableDataCell>
                          <CTableDataCell>
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                              onClick={() => handleEditTask(task)}
                            />
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: '#bb1616', cursor: 'pointer' }}
                              onClick={() => handleDeleteTask(task._id)}
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
        </CCardBody>
      </CCard>

      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Task' : 'Add Task'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CFormLabel htmlFor="driverName" className="col-sm-3 col-form-label">
                Driver Name
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="customerName" className="col-sm-3 col-form-label">
                Customer Name
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="pickupAddress" className="col-sm-3 col-form-label">
                Pickup Address
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="pickupAddress"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="deliveryAddress" className="col-sm-3 col-form-label">
                Delivery Address
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="text"
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="pickupDate" className="col-sm-3 col-form-label">
                Pickup Date
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="date"
                  id="pickupDate"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CFormLabel htmlFor="deliveryDate" className="col-sm-3 col-form-label">
                Delivery Date
              </CFormLabel>
              <CCol sm="9">
                <CFormInput
                  type="date"
                  id="deliveryDate"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          {editMode ? (
            <CButton color="primary" onClick={handleUpdateTask}>
              Save Changes
            </CButton>
          ) : (
            <CButton color="primary" onClick={handleAddTask}>
              Add Task
            </CButton>
          )}
        </CModalFooter>
      </CModal>
    </>
  );
};

export default TaskManageList;
