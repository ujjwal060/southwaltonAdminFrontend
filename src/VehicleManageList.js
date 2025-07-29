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
  CFormSelect, CFormText, CFormFeedback

} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

const VehicleManageList = () => {


  const [vehicleData, setVehicleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vname, setVname] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [model, setModel] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [passenger, setPassenger] = useState('');
  const [vprice, setVprice] = useState([]);
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [vehiclePrice, setVehiclePrice] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchVehicleData = async () => {
    try {
      const response = await axios.get(`http://54.205.149.77:8132/api/vehicle`, {
        params: { page, limit, search },
      });

      const { vehicles, totalPages: total } = response.data;
      setVehicleData(vehicles || []);
      setTotalPages(total || 1);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleData();
  }, [page, search]);

  const handleAddVehicle = async () => {
    const formData = new FormData();
    formData.append('vname', vname);
    formData.append('tagNumber', tagNumber);
    formData.append('model', model)
    formData.append('isAvailable', isAvailable);
    formData.append('passenger', passenger);
    formData.append('vprice', JSON.stringify(vprice));
    if (image) {
      formData.append('images', image);
    }

    try {
      const response = await axios.post('http://54.205.149.77:8132/api/vehicle/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchVehicleData();
      resetForm();
      setVisible(false);
      window.alert('Vehicle successfully added');
    } catch (error) {
      console.error('Error adding vehicle:', error);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setVname(vehicle.vname);
    setTagNumber(vehicle.tagNumber);
    setModel(vehicle.model);
    setIsAvailable(vehicle.isAvailable)
    setPassenger(vehicle.passenger);
    setVprice(vehicle.vprice || []);
    setImage(null);
    setEditMode(true);
    setCurrentVehicleId(vehicle._id);
    setVisible(true);
  };




  const handleUpdateVehicle = async () => {
    const formData = new FormData();
    formData.append('vname', vname);
    formData.append('tagNumber', tagNumber);
    formData.append('model', model);
    formData.append('isAvailable', isAvailable);
    formData.append('passenger', passenger);
    formData.append('vprice', JSON.stringify(vprice));
    if (image) {
      formData.append('images', image);  // Include image if it's updated
    }

    try {
      const response = await axios.put(`http://54.205.149.77:8132/api/vehicle/${currentVehicleId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedVehicle = response.data;
      setVehicleData(vehicleData.map((vehicle) =>
        vehicle._id === currentVehicleId ? { ...vehicle, ...updatedVehicle } : vehicle
      ));
      fetchVehicleData();
      resetForm();
      setEditMode(false);
      setCurrentVehicleId(null);
      setVisible(false);
      window.alert('Vehicle successfully updated');
    } catch (error) {
      console.error('Error updating vehicle data:', error);
    }
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`http://54.205.149.77:8132/api/vehicle/${id}`);
      setVehicleData(vehicleData.filter((vehicle) => vehicle._id !== id));
      window.alert('Vehicle successfully deleted');
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  const handleViewPrice = (vehicleId) => {
    const vehicle = vehicleData.find((vehicle) => vehicle._id === vehicleId);
    if (vehicle && Array.isArray(vehicle.vprice) && vehicle.vprice.length > 0) {
      setVehiclePrice(vehicle.vprice);
      setPriceModalVisible(true);
    } else {
      setVehiclePrice([]);
      setPriceModalVisible(true);
    }
  };


  const resetForm = () => {
    setVname('');
    setTagNumber('');
    setModel('');
    setPassenger('');
    setVprice([]);
    setImage(null);
  };

  const handleAddPrice = () => {
    if (Array.isArray(vprice)) {
      setVprice([...vprice, { season: '', day: '', price: '' }]);
    }
  };

  const handlePriceChange = (index, field, value) => {
    const newPrices = [...vprice];
    newPrices[index][field] = value;
    setVprice(newPrices);
  };

  const handleDeletePrice = (index) => {
    const newPrices = [...vprice];
    newPrices.splice(index, 1);
    setVprice(newPrices);
  };


  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: "24px", color: "indianred" }}>Vehicle Management</h1>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by vname or tag"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="me-3"
              style={{ width: "200px", marginRight: "0rem" }}
            />
            <CButton
              color="primary"
              className="ms-3"
              size="sm"
              onClick={() => {
                resetForm();
                setEditMode(false);
                setVisible(true);
              }}
            >
              Add Vehicle
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <CCardText>
            {loading ? (
              <div>Loading...</div>
            ) : vehicleData.length === 0 ? (
              <div className="no-data">No vehicle data found.</div>
            ) : (
              <>
                <CRow>
                  <CCol>
                    <CTable hover bordered striped responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell scope="col">Profile</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Passenger</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Tag Number</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Model</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Available</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Price</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {vehicleData.map((vehicle) => (
                          <CTableRow key={vehicle._id}>
                            <CTableDataCell>
                              {vehicle.image && vehicle.image.length > 0 ? (
                                vehicle.image.map((imgSrc, index) => (
                                  <img
                                    key={index}
                                    src={imgSrc}
                                    alt={`${vehicle.name} ${index + 1}`}
                                    style={{ width: "100px", marginRight: "10px" }}
                                  />
                                ))
                              ) : (
                                <span>No images available</span>
                              )}
                            </CTableDataCell>
                            <CTableDataCell>{vehicle.vname}</CTableDataCell>
                            <CTableDataCell>
                              {vehicle.passenger === 'fourPassenger'
                                ? 'Four Passenger'
                                : vehicle.passenger === 'sixPassenger'
                                  ? 'Six Passenger'
                                  : vehicle.passenger === 'eightPassenger'
                                    ? 'Eight Passenger'
                                    : 'Unknown'}
                            </CTableDataCell>

                            <CTableDataCell>{vehicle.tagNumber}</CTableDataCell>
                            <CTableDataCell>
                              {vehicle.model === 'gas' ? 'Gas' : vehicle.model === 'electric' ? 'Electric' : 'Unknown'}
                            </CTableDataCell>

                            <CTableDataCell>
                              <span style={{ color: vehicle.isAvailable ? "green" : "red" }}>
                                {vehicle.isAvailable ? "Yes" : "No"}
                              </span>
                            </CTableDataCell>

                            <CTableDataCell>
                              <CButton
                                size="sm"
                                color="info"
                                onClick={() => handleViewPrice(vehicle._id)}
                              >
                                View Price
                              </CButton>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                size="sm"
                                className="me-2"
                                onClick={() => handleEditVehicle(vehicle)}
                              >
                                <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  style={{ color: "#b3ae0f", cursor: "pointer" }}
                                />
                              </CButton>
                              <CButton
                                size="sm"
                                onClick={() => handleDeleteVehicle(vehicle._id)}
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
                  </CCol>
                </CRow>
                <div className="pagination d-flex align-items-center mt-3">
                  <CButton
                    color="secondary"
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    size="sm"
                  >
                    Previous
                  </CButton>
                  <span style={{ margin: "0 10px" }}>
                    Page {page} of {totalPages}
                  </span>
                  <CButton
                    color="secondary"
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
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

      {/* Price Modal */}
      <CModal size="lg" visible={priceModalVisible} onClose={() => setPriceModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Vehicle Price</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {vehiclePrice && vehiclePrice.length > 0 ? (
            vehiclePrice.map((priceData, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>Season: {priceData.season || 'No season available'}</div>
                <div style={{ marginBottom: '10px' }}>Day: {priceData.day || 'No day available'}</div>
                <div style={{ marginBottom: '10px' }}>Price: {priceData.price ? `$${priceData.price}` : 'No price available'}</div>
                <hr />
              </div>
            ))
          ) : (
            <div>No price data available</div>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setPriceModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>


      {/* Add/Edit Vehicle Modal */}
      <CModal size="lg" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? 'Edit Vehicle' : 'Add Vehicle'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="vname">Name</CFormLabel>
                <CFormInput
                  id="vname"
                  value={vname}
                  onChange={(e) => setVname(e.target.value)}
                  className="mb-3"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="passenger">Passenger</CFormLabel>
                <CFormSelect
                  id="passenger"
                  value={passenger}
                  onChange={(e) => setPassenger(e.target.value)}
                  className={`mb-3`}
                >
                  <option value="" disabled>
                    Select Passenger Capacity
                  </option>
                  <option value="fourPassenger">Four Passenger</option>
                  <option value="sixPassenger">Six Passenger</option>
                  <option value="eightPassenger">Eight Passenger</option>
                </CFormSelect>
              </CCol>


              <CCol xs={12}>
                <CFormLabel htmlFor="tagNumber">Tag Number (Must be Unique )</CFormLabel>
                <CFormInput
                  id="tagNumber"
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  className="mb-3"
                />
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="model">Model</CFormLabel>
                <CFormSelect
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="mb-3"
                >
                  <option value="" disabled>
                    Select Model
                  </option>
                  <option value="gas">Gas</option>
                  <option value="electric">Electric</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CFormLabel htmlFor="image">Upload Image</CFormLabel>
                <CFormInput
                  id="image"
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="mb-3"
                />
              </CCol>
              {/* Price Section */}
              <CCol xs={12}>
                <CFormLabel>Price</CFormLabel>
                {vprice.map((price, index) => (
                  <div key={index} className="mb-3">
                    <CFormSelect
                      value={price.season}
                      onChange={(e) => handlePriceChange(index, 'season', e.target.value)}
                      className="mb-3"
                    >
                      <option value="">Select Season</option>
                      <option value="offSeason">Off Season</option>
                      <option value="secondarySeason">Secondary Season</option>
                      <option value="peakSeason">Peak Season</option>
                    </CFormSelect>
                    <CFormSelect
                      value={price.day}
                      onChange={(e) => handlePriceChange(index, 'day', e.target.value)}
                      className="mb-3"
                    >
                      <option value="">Select Day</option>
                      <option value="oneDay">One Day</option>
                      <option value="twoDay">Two Day</option>
                      <option value="threeDay">Three Day</option>
                      <option value="fourDay">Four Day</option>
                      <option value="fiveDay">Five Day</option>
                      <option value="sixDay">Six Day</option>
                      <option value="weeklyRental">Weekly Rental</option>
                    </CFormSelect>
                    <CFormInput
                      type="number"
                      value={price.price}
                      placeholder="Price"
                      onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                      className="mb-3"
                    />
                    <CButton size="sm" color="danger" onClick={() => handleDeletePrice(index)}>
                      Remove
                    </CButton>
                  </div>
                ))}
                <CButton size="sm" style={{ marginLeft: "1rem" }} color="success" onClick={handleAddPrice}>
                  Add Price
                </CButton>
              </CCol>


            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => setVisible(false)}
          >
            Cancel
          </CButton>
          <CButton
            color="primary"
            onClick={editMode ? handleUpdateVehicle : handleAddVehicle}
          >
            {editMode ? 'Update' : 'Add'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default VehicleManageList;
