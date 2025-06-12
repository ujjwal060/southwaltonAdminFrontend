import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import debounce from 'lodash.debounce';
import { Autocomplete } from '@react-google-maps/api';

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [viewVehicles, setViewVehicles] = useState(null);
  const [reservationId, setReservationId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [pickdate, setPickdate] = useState('');
  const [dropdate, setDropdate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [vehicleUpdateModal, setVehicleUpdateModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const itemsPerPage = 8;
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropAutocomplete, setDropAutocomplete] = useState(null);


  const fetchReservations = async (page = 1, searchQuery = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://18.209.91.97:8132/api/reserve/reservations', {
        params: {
          page,
          limit: itemsPerPage,
          search: searchQuery,

        },
      });

      console.log(response.data);
      if (response.data.success) {
        const { data, pagination } = response.data;
        setReservations(Array.isArray(data) ? data : []);
        setTotalPages(pagination?.totalPages || 0);
        setCurrentPage(pagination?.currentPage || 1);
      } else {
        console.error('Error fetching reservations: ', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const debouncedSearch = debounce((query) => {
    fetchReservations(1, query);
  }, 500);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    debouncedSearch(query);
  };



  // Handle delete reservation
  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`http://18.209.91.97:8132/api/reserve/reservation/${id}`); // Adjust the API URL
      setReservations(reservations.filter((reservation) => reservation._id !== id));
      window.alert('Reservation successfully deleted');
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };


  const handleReservationById = async (reservation) => {
    try {
      const response = await axios.get(
        `http://18.209.91.97:8132/api/reserve/reservation/${reservation._id}`
      );

      if (response) {
        setReservationId(reservation._id);
        const { pickdate, dropdate, vehicleId } = response.data; // Adjust based on response structure
        console.log(pickdate, dropdate)
        setSelectedVehicleId(vehicleId || null);

        if (pickdate && dropdate) {

          const pickDateObj = new Date(pickdate);
          const dropDateObj = new Date(dropdate);

          const timeDifference = dropDateObj - pickDateObj;
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1; // +1 for inclusivity

          console.log(`Inclusive days difference: ${days}`);

          // Get season and days difference
          const vehicles = await getSeasonAndDays(days, pickdate, dropdate);
          if (vehicles) {
            setViewVehicles(vehicles.results); // Set vehicles in state
          }
          console.log(vehicles)
        }
        setVehicleUpdateModal(true);
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error fetching reservation details:", error);
    }
  };

  /**
   * Function to calculate season and days difference
   */
  const getSeasonAndDays = async (days, pickdate, dropdate) => {
    try {
      const response = await axios.get("http://18.209.91.97:8132/api/newVehicle/vehicleData", {
        params: {
          days,
          pickdate,
          dropdate,
        },
      });

      if (response.data) {
        return response.data; // { days: x, seasonType: '...' }
      } else {
        console.warn("Failed to fetch season details.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching season details:", error);
      return null;
    }
  };

  const handleUpdateReservation = async (vehicleId, totalPrice) => {
    if (selectedVehicleId === vehicleId) {
      // Unbook the current vehicle
      setSelectedVehicleId(null);
      alert("Vehicle unbooked. You can now select a new vehicle.");
      return;
    }

    if (!reservationId) {
      alert("Reservation ID is not available.");
      return;
    }
    try {
      const response = await axios.put(
        `http://18.209.91.97:8132/api/reserve/reservation/${reservationId}`,
        {
          vehicleId,
          reserveAmount: totalPrice,
          reservation: true
        }
      );

      if (response.status === 200) {
        fetchReservations()
        setSelectedVehicleId(vehicleId);
        setVehicleUpdateModal(false);
        alert("Reservation updated successfully!");
      } else {
        alert("Failed to update reservation.");
      }
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Error occurred while updating reservation.");
    }
  };

  // Handle accept reservation
  const handleAcceptReservation = async (id) => {
    try {
      const response = await axios.put(`http://18.209.91.97:8132/api/reserve/reservation/${id}/accept`);
      alert(response.data.message); // Show success message

      // Update the state for the specific reservation
      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation._id === id ? { ...reservation, status: 'ACCEPTED' } : reservation
        )
      );
    } catch (error) {
      console.error('Error accepting reservation:', error);
    }
  };

  const handleAddReservation = async () => {
    if (!pickup || !drop || !pickdate || !dropdate) {
      alert('Please fill in all fields!');
      return;
    }

    const reservationData = {
      pickup,
      drop,
      pickdate,
      dropdate,
    };

    try {
      const response = await axios.post('http://18.209.91.97:8132/api/reserve/reservation', reservationData);

      fetchReservations()
      resetForm();
      setVisible(false);
      window.alert('Reservation added successfully!');

    } catch (error) {
      console.error('Error adding reservation:', error);
      alert('Failed to add reservation. Please try again.');
    }
  };

  const handlePickdateChange = (e) => {
    const selectedPickdate = e.target.value;
    setPickdate(selectedPickdate);

    // Reset dropdate if it's before the new pickdate
    if (dropdate && new Date(dropdate) < new Date(selectedPickdate)) {
      setDropdate('');
    }
  };

  const resetForm = () => {
    setPickup('');
    setDrop('');
    setPickdate('');
    setDropdate('');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const handlePlaceSelected = (autocomplete, setField) => {
    const place = autocomplete.getPlace();
    if (place && place.formatted_address) {
      setField(place.formatted_address);
    }
  };

  const repositionDropdown = () => {
    const pacContainers = document.querySelectorAll('.pac-container');
    pacContainers.forEach((container) => {
      container.style.zIndex = '1051'; // Ensure it’s above the modal
      container.style.position = 'absolute';
      container.style.transform = 'translateY(0px)'; // Optional: Tweak based on alignment
    });
  };

  return (
    <>
      <style>
        {`
          .pac-container {
              z-index: 9999 !important; /* Ensures the dropdown appears above everything */
  position: absolute !important;
          }
          .modal {
            overflow: visible !important;
          }
          .modal-dialog {
            overflow: visible !important;
          }
            .hidden-row {
  display: none;
}

        `}
      </style>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'purple' }}>Reservation List</h1>
          <div className="d-flex mb-3 align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by vname or tag"
              value={search}
              onChange={handleSearchChange} // Handle input change
              style={{ width: "180px", marginRight: "1rem" }}
            />
            <CButton
              color="primary"
              size="sm"
              className="me-3"
              onClick={() => {
                resetForm();
                setVisible(true);
              }}
            >
              Add Reservation
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>

          {loading ? (
            <div>Loading...</div>
          ) : reservations.length === 0 ? (
            <div>No reservations found.</div>
          ) : (
            <>
              <CTable hover bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Reservation Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Pickup</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Drop</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Pick Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Drop Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Vehicle Image</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Vehicle Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Vehicle Model</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tag Number</CTableHeaderCell>

                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {reservations.map((reservation) => {
                    const vehicleDetails = reservation.vehicleDetails || {};
                    const vehicleImages = Array.isArray(vehicleDetails.image)
                      ? vehicleDetails.image
                      : vehicleDetails.image
                        ? [vehicleDetails.image]
                        : [];
                    return (
                      <CTableRow key={reservation._id}>
                        <CTableDataCell>{reservation._id}</CTableDataCell>
                        <CTableDataCell>{reservation.pickup || 'N/A'}</CTableDataCell>
                        <CTableDataCell>{reservation.drop || 'N/A'}</CTableDataCell>
                        <CTableDataCell>
                          {reservation.pickdate
                            ? new Date(reservation.pickdate).toLocaleDateString()
                            : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {reservation.dropdate
                            ? new Date(reservation.dropdate).toLocaleDateString()
                            : 'N/A'}
                        </CTableDataCell>
                        <CTableDataCell>
                          {vehicleImages.length > 0 ? (
                            vehicleImages.map((imgSrc, index) => (
                              <img
                                key={index}
                                src={imgSrc}
                                style={{ width: "100px", marginRight: "10px" }}
                                alt={`Vehicle ${index + 1}`}
                              />
                            ))
                          ) : (
                            <span style={{ color: 'red' }}>Please Select Cart</span>
                          )}
                        </CTableDataCell>
                        <CTableDataCell>
                          {vehicleDetails.vname || <span style={{ color: 'red' }}>N/A</span>}
                        </CTableDataCell>
                        <CTableDataCell>
                          {vehicleDetails.model || <span style={{ color: 'red' }}>N/A</span>}
                        </CTableDataCell>
                        <CTableDataCell>
                          {vehicleDetails.tagNumber || <span style={{ color: 'red' }}>N/A</span>}
                        </CTableDataCell>

                        <CTableDataCell>
                          <CButton
                            size="sm"
                            className="me-2"
                            onClick={() => handleReservationById(reservation)}
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              style={{
                                color: "#b3ae0f",
                                cursor: "pointer",
                                marginRight: "10px",
                              }}
                            />
                          </CButton>
                          <CButton
                            size="sm"
                            className="me-2"
                            onClick={() => handleDeleteReservation(reservation._id)}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              style={{ color: "#bb1616", cursor: "pointer" }}
                            />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                </CTableBody>

              </CTable>
              <div className="d-flex mt-3">
                <div className="pagination d-flex align-items-center">
                  <CButton
                    disabled={currentPage === 1 || loading}
                    onClick={() => fetchReservations(currentPage - 1, search)}
                    color="primary"
                    size="sm"
                  >
                    Previous
                  </CButton>
                  <span style={{ margin: '0 10px' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <CButton
                    disabled={currentPage === totalPages || loading}
                    onClick={() => fetchReservations(currentPage + 1, search)}
                    color="primary"
                    size="sm"
                  >
                    Next
                  </CButton>
                </div>
              </div>
            </>
          )}
        </CCardBody>
      </CCard>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Reservation</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="pickup">Pickup</CFormLabel>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    setPickupAutocomplete(autocomplete);
                    repositionDropdown(); // Reposition dropdown on load
                  }}
                  onPlaceChanged={() => {
                    handlePlaceSelected(pickupAutocomplete, setPickup);
                    repositionDropdown(); // Reposition dropdown after place change
                  }}
                >
                  <CFormInput
                    type="text"
                    id="pickup"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                  />
                </Autocomplete>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="drop">Drop</CFormLabel>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    setDropAutocomplete(autocomplete);
                    repositionDropdown(); // Reposition dropdown on load
                  }}
                  onPlaceChanged={() => {
                    handlePlaceSelected(dropAutocomplete, setDrop);
                    repositionDropdown(); // Reposition dropdown after place change
                  }}
                >
                  <CFormInput
                    type="text"
                    id="drop"
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                  />
                </Autocomplete>
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="pickdate">Pickdate</CFormLabel>
                <CFormInput
                  type="date"
                  id="pickdate"
                  value={pickdate}
                  onChange={handlePickdateChange}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="dropdate">Dropdate</CFormLabel>
                <CFormInput
                  type="date"
                  id="dropdate"
                  value={dropdate}
                  onChange={(e) => setDropdate(e.target.value)}
                  min={pickdate} // Ensure dropdate cannot be before pickdate
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleAddReservation}>
            Save changes
          </CButton>

        </CModalFooter>
      </CModal>
      <CModal visible={vehicleUpdateModal} size="lg" onClose={() => setVehicleUpdateModal(false)}>
        <CModalHeader>
          <CModalTitle>Choose Vehicle</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ maxHeight: "500px", overflowY: "auto" }}>
          {viewVehicles && viewVehicles.length > 0 ? (
            <div>
              <h5>Vehicle Details:</h5>
              <ul>
                {viewVehicles.map((vehicle) => (
                  <li key={vehicle.vehicleId} style={{ marginBottom: "20px" }}>
                    <strong>Name:</strong> {vehicle.vname} <br />
                    <strong>Seats:</strong> {vehicle.passenger} <br />
                    <strong>Model:</strong> {vehicle.model} <br />
                    <strong>Tag Number:</strong> {vehicle.tagNumber} <br />
                    <strong>Price:</strong> {vehicle.totalPrice} <br />
                    <img
                      src={vehicle.image}
                      alt={vehicle.vname}
                      style={{ width: "200px", marginTop: "10px" }}
                    />
                    <br />
                    <CButton
                      color={selectedVehicleId === vehicle.vehicleId ? "danger" : "primary"}
                      style={{ marginTop: "10px" }}
                      onClick={() => handleUpdateReservation(vehicle.vehicleId, vehicle.totalPrice)}
                      disabled={selectedVehicleId && selectedVehicleId !== vehicle.vehicleId}
                    >
                      {selectedVehicleId === vehicle.vehicleId ? "Unbook" : "Book"}
                    </CButton>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No vehicles available for the selected season and day.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVehicleUpdateModal(false)}>Close</CButton>
        </CModalFooter>
      </CModal>

    </>
  );
};

export default Reservation;
