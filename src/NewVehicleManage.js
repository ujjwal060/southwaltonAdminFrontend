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
  CFormSelect,
  CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare,faDownload } from '@fortawesome/free-solid-svg-icons';

const BASE_URL = 'http://18.209.91.97:8132/api/newVehicle'; // Update with your API base URL

const NewVehicleManage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [vehicleId, setVehicleId] = useState(null);
  const [vehicleData, setVehicleData] = useState({
    vname: '',
    image: null,
    tagNumber: '',
    model: '',
    passenger: '',
    dailyPricingFile: null,
    twoToFourDaysPricingFile: null,
    fiveToSevenDaysPricingFile: null,
    eightToTwentySevenDaysPricingFile: null,
    twentyEightPlusPricingFile: null,
  });
  const [errors, setErrors] = useState({});

  // Fetch all vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(BASE_URL);
        setVehicles(response.data.vehicles || []);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!vehicleData.vname) newErrors.vname = 'Vehicle Name is required';
    if (!vehicleData.tagNumber) newErrors.tagNumber = 'Tag Number is required';
    if (!vehicleData.model) newErrors.model = 'Model selection is required';
    if (!vehicleData.passenger) newErrors.passenger = 'Passenger capacity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setVehicleData({
      vname: '',
      image: null,
      tagNumber: '',
      model: '',
      passenger: '',
      dailyPricingFile: null,
      twoToFourDaysPricingFile: null,
      fiveToSevenDaysPricingFile: null,
      eightToTwentySevenDaysPricingFile: null,
      twentyEightPlusPricingFile: null,
    });
    setErrors({});
    setEditMode(false);
    setVehicleId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    setVehicleData((prev) => ({ ...prev, [key]: file }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    Object.keys(vehicleData).forEach((key) => {
      if (vehicleData[key]) {
        formData.append(key, vehicleData[key]);
      }
    });

    try {
      if (editMode) {
        await axios.put(`${BASE_URL}/${vehicleId}`, formData);
      } else {
        await axios.post(`${BASE_URL}/add`, formData);
      }
      const response = await axios.get(BASE_URL);
      setVehicles(response.data.vehicles || []);
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    }
  };

  const handleEdit = (vehicle) => {
    setVehicleId(vehicle._id);
    setVehicleData({
      vname: vehicle.vname,
      image: null,
      tagNumber: vehicle.tagNumber,
      model: vehicle.model,
      passenger: vehicle.passenger,
      dailyPricingFile: null,
      twoToFourDaysPricingFile: null,
      fiveToSevenDaysPricingFile: null,
      eightToTwentySevenDaysPricingFile: null,
      twentyEightPlusPricingFile: null,
    });
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setVehicles((prev) => prev.filter((vehicle) => vehicle._id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}> Vehicle Management</h1>
          <CButton color="primary" size="sm" onClick={() => {
            resetForm();
            setModalOpen(true)
          }}>
            Add Vehicle
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            <CRow>
              <CCol>
                <CTable hover bordered striped responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>#</CTableHeaderCell>
                      <CTableHeaderCell>Vehicle Name</CTableHeaderCell>
                      <CTableHeaderCell>Image</CTableHeaderCell>
                      <CTableHeaderCell>Tag Number</CTableHeaderCell>
                      <CTableHeaderCell>Model</CTableHeaderCell>
                      <CTableHeaderCell>Passengers</CTableHeaderCell>
                      <CTableHeaderCell>Pricings</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {vehicles.map((vehicle, index) => (
                      <CTableRow key={vehicle._id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{vehicle.vname}</CTableDataCell>
                        <CTableDataCell>
                          <img
                            src={vehicle.image}
                            alt="Vehicle"
                            style={{ width: '50px', height: '50px' }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>{vehicle.tagNumber}</CTableDataCell>
                        <CTableDataCell>{vehicle.model}</CTableDataCell>
                        <CTableDataCell>{vehicle.passenger}</CTableDataCell>
                        <CTableDataCell>
                          <CDropdown>
                            <CDropdownToggle color="primary" size="sm">
                              Download Pricing Files
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem href={vehicle.dailyPricingFile} target="_blank">
                                <FontAwesomeIcon icon={faDownload} className="me-2" />
                                Daily Pricing
                              </CDropdownItem>
                              <CDropdownItem href={vehicle.twoToFourDaysPricingFile} target="_blank">
                                <FontAwesomeIcon icon={faDownload} className="me-2" />
                                2-4 Days Pricing
                              </CDropdownItem>
                              <CDropdownItem href={vehicle.fiveToSevenDaysPricingFile} target="_blank">
                                <FontAwesomeIcon icon={faDownload} className="me-2" />
                                5-7 Days Pricing
                              </CDropdownItem>
                              <CDropdownItem href={vehicle.eightToTwentySevenDaysPricingFile} target="_blank">
                                <FontAwesomeIcon icon={faDownload} className="me-2" />
                                8-27 Days Pricing
                              </CDropdownItem>
                              <CDropdownItem href={vehicle.twentyEightPlusPricingFile} target="_blank">
                                <FontAwesomeIcon icon={faDownload} className="me-2" />
                                28+ Days Pricing
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="warning"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEdit(vehicle)}
                          >
                            <FontAwesomeIcon icon={faPenToSquare} />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            onClick={() => handleDelete(vehicle._id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CRow>
          </CCardText>
        </CCardBody>
      </CCard>

      <CModal size="lg" visible={modalOpen} onClose={() => setModalOpen(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Vehicle' : 'Add New Vehicle'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {/* Vehicle Name and Image */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Vehicle Name</CFormLabel>
                <CFormInput
                  type="text"
                  name="vname"
                  value={vehicleData.vname}
                  onChange={handleInputChange}
                />
                {errors.vname && <p className="text-danger">{errors.vname}</p>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Vehicle Image</CFormLabel>
                <CFormInput type="file" name="image" onChange={(e) => handleFileChange(e, 'image')} />
              </CCol>
            </CRow>

            {/* Tag Number */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Tag Number (Must be Unique)</CFormLabel>
                <CFormInput
                  type="text"
                  name="tagNumber"
                  value={vehicleData.tagNumber}
                  onChange={handleInputChange}
                />
                {errors.tagNumber && <p className="text-danger">{errors.tagNumber}</p>}
              </CCol>
              <CCol md={6}>
                <CFormLabel>Model</CFormLabel>
                <CFormSelect
                  name="model"
                  value={vehicleData.model}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Model</option>
                  <option value="gas">Gas</option>
                  <option value="electric">Electric</option>
                </CFormSelect>
                {errors.model && <p className="text-danger">{errors.model}</p>}
              </CCol>
            </CRow>

            {/* Passenger Capacity */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Passengers</CFormLabel>
                <CFormSelect
                  name="passenger"
                  value={vehicleData.passenger}
                  onChange={handleInputChange}
                >
                  <option value="" disabled>Select Passenger Capacity</option>
                  <option value="fourPassenger">Four Passenger</option>
                  <option value="sixPassenger">Six Passenger</option>
                  <option value="eightPassenger">Eight Passenger</option>
                </CFormSelect>
                {errors.passenger && <p className="text-danger">{errors.passenger}</p>}
              </CCol>
            </CRow>

            {/* Pricing Files */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Daily Pricing File</CFormLabel>
                <CFormInput
                  type="file"
                  name="dailyPricingFile"
                  onChange={(e) => handleFileChange(e, 'dailyPricingFile')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>2-4 Days Pricing File</CFormLabel>
                <CFormInput
                  type="file"
                  name="twoToFourDaysPricingFile"
                  onChange={(e) => handleFileChange(e, 'twoToFourDaysPricingFile')}
                />
              </CCol>
            </CRow>

            {/* More Pricing Files */}
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>5-7 Days Pricing File</CFormLabel>
                <CFormInput
                  type="file"
                  name="fiveToSevenDaysPricingFile"
                  onChange={(e) => handleFileChange(e, 'fiveToSevenDaysPricingFile')}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>8-27 Days Pricing File</CFormLabel>
                <CFormInput
                  type="file"
                  name="eightToTwentySevenDaysPricingFile"
                  onChange={(e) => handleFileChange(e, 'eightToTwentySevenDaysPricingFile')}
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>28+ Days Pricing File</CFormLabel>
                <CFormInput
                  type="file"
                  name="twentyEightPlusPricingFile"
                  onChange={(e) => handleFileChange(e, 'twentyEightPlusPricingFile')}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalOpen(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            {editMode ? 'Update' : 'Save'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default NewVehicleManage;
