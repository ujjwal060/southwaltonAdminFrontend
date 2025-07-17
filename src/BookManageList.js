import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CCard, CCardBody, CFormSelect, CCardHeader, CTable, CFormLabel, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CForm, CFormInput, CRow, CDropdownItem, CDropdownMenu, CDropdownToggle, CCol, CDropdown } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const BookManageList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingVisible, setBookingVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [viewOnlyVisible, setViewOnlyVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [newCurrentBooking, setNewCurrentBooking] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [assignDriverModalVisible, setAssignDriverModalVisible] = useState(false);
  const [newAssignDriverModalVisible, setNewAssignDriverModalVisible] = useState(false)
  const [currentDriver, setCurrentDriver] = useState('');
  const [customerDriverDetails, setCustomerDriverDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Fixed limit per page
  const [totalPages, setTotalPages] = useState(1);
  const [bname, setBname] = useState('');
  const [bphone, setBphone] = useState('');
  const [bemail, setBemail] = useState('');
  const [bsize, setBsize] = useState('');
  const [baddress, setBaddress] = useState('');
  const [baddressh, setBaddressh] = useState('');
  const [reservationId, setReservationId] = useState('');
  const [customerDrivers, setCustomerDrivers] = useState([{ dname: '', dphone: '', demail: '', dexperience: '', dpolicy: null, dlicense: null }]);

  //panel booking
  const [panelBookings, setPanelBookings] = useState([]);
  const [panelLoading, setPanelLoading] = useState(true);
  const [panelPage, setPanelPage] = useState(1);
  const [panelLimit, setPanelLimit] = useState(5);
  const [totalPanelPages, setTotalPanelPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState('');
  const [loadingBookingId, setLoadingBookingId] = useState(null); // Tracks which booking is loading

  useEffect(() => {
    fetchReservations();
    fetchBookings();
    fetchPanelBookings();
  }, [searchTerm, page, panelPage, panelLimit, searchQuery]);


  // website booking

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://98.82.228.18:8132/api/book', {
        params: {
          search: searchTerm,
          page,
          limit,
        },
      });

      if (response?.data) {
        setBookings(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        console.error('Unexpected response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to the first page on search
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };


  const fetchAvailableDrivers = async () => {
    try {
      const response = await axios.get('http://98.82.228.18:8132/api/driver/'); // Update API endpoint if necessary
      setAvailableDrivers(response.data.drivers); // Adjust if your response structure is different
    } catch (error) {
      console.error("Error fetching drivers:", error.message);
    }
  };

  const viewBookingDetails = async (booking) => {
    console.log("Selected Booking:", booking);
    setCurrentBooking(booking);
    console.log("Current Booking after setting:", booking);
    await fetchAvailableDrivers();
    setCustomerDriverDetails(booking.customerDrivers);
    setViewOnlyVisible(true);
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://98.82.228.18:8132/api/book/${id}`);
      setBookings(bookings.filter(booking => booking._id !== id));
      fetchPanelBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const assignDriver = async () => {
    if (!currentDriver || !currentBooking) {
      console.error("Driver or Booking not selected. Current Booking:", currentBooking, "Current Driver:", currentDriver);
      return;
    }

    const bookingId = currentBooking.bookingDetails.bookingId;
    if (!bookingId) {
      console.error("Booking ID is missing for the selected booking.");
      return;
    }

    const requestData = {
      bookingId: bookingId,
      driverId: currentDriver,
      paymentId: currentBooking.paymentId || null,
    };

    console.log("Assigning driver with data:", requestData);
    try {
      const response = await axios.post('http://98.82.228.18:8132/api/driver/assignDriver', requestData);
      window.alert('Driver assigned successfully!')
      console.log("Response from server:", response.data);
      setAssignDriverModalVisible(false);
      setCurrentDriver('');
      setCurrentBooking(null);
      fetchBookings();
    } catch (error) {
      console.error("Error assigning driver:", error.response ? error.response.data : error.message);
      alert('Error assigning driver: ' + (error.response?.data?.message || error.message));
    }
  };

  const assignDriver2 = async () => {
    if (!currentDriver || !newCurrentBooking) {
      console.error("Driver or Booking not selected. Current Booking:", newCurrentBooking, "Current Driver:", currentDriver);
      return;
    }

    const bookingId = newCurrentBooking._id;
    if (!bookingId) {
      console.error("Booking ID is missing for the selected booking.");
      return;
    }

    const requestData = {
      bookingId: bookingId,
      driverId: currentDriver,
      paymentId: newCurrentBooking.paymentId || null,
    };

    console.log("Assigning driver with data:", requestData);
    try {
      const response = await axios.post('http://98.82.228.18:8132/api/driver/assignDriver', requestData);
      window.alert('Driver assigned successfully!')
      console.log("Response from server:", response.data);
      setNewAssignDriverModalVisible(false);
      setCurrentDriver('');
      setNewCurrentBooking(null);
      fetchPanelBookings();
    } catch (error) {
      console.error("Error assigning driver:", error.response ? error.response.data : error.message);
      alert('Error assigning driver: ' + (error.response?.data?.message || error.message));
    }
  };

  // const handleAssignClick = (booking) => {
  //   setCurrentBooking(booking);
  //   setNewAssignDriverModalVisible(true);
  //   fetchAvailableDrivers();
  // };

  const handleAssignClick = async (booking) => {
    setNewAssignDriverModalVisible(true);
    console.log("Selected Booking:", booking);
    setNewCurrentBooking(booking);
    console.log("Current Booking after setting:", booking);
    await fetchAvailableDrivers();
  };


  // panel Bookings

  const addDriver = () => {
    setCustomerDrivers([...customerDrivers, { dname: '', dphone: '', demail: '', dexperience: '', dpolicy: null, dlicense: null }]);
  };

  const handleDriverChange = (index, field, value) => {
    const updatedDrivers = [...customerDrivers];
    updatedDrivers[index][field] = value;
    setCustomerDrivers(updatedDrivers);
  };

  const handleFileChange = (index, field, file) => {
    const updatedDrivers = [...customerDrivers];
    updatedDrivers[index][field] = file;
    setCustomerDrivers(updatedDrivers);
  };

  const handleAddBooking = async () => {
    if (!bname || !bphone || !bemail || !bsize || !baddress || !baddressh || !reservationId) {
      alert('Please fill in all required fields!');
      return;
    }

    const formData = new FormData();
    formData.append('bname', bname);
    formData.append('bphone', bphone);
    formData.append('bemail', bemail);
    formData.append('bsize', bsize);
    formData.append('baddress', baddress);
    formData.append('baddressh', baddressh);
    formData.append('reservationId', reservationId);

    customerDrivers.forEach((driver, index) => {
      formData.append(`customerDrivers[${index}][dname]`, driver.dname);
      formData.append(`customerDrivers[${index}][dphone]`, driver.dphone);
      formData.append(`customerDrivers[${index}][demail]`, driver.demail);
      formData.append(`customerDrivers[${index}][dexperience]`, driver.dexperience);
      if (driver.dpolicy) formData.append('images', driver.dpolicy);
      if (driver.dlicense) formData.append('images', driver.dlicense);
    });

    try {
      const response = await axios.post('http://98.82.228.18:8132/api/book/create', formData);
      console.log('Booking added:', response.data);

      const updateResponse = await axios.put(`http://98.82.228.18:8132/api/reserve/reservation/${reservationId}`, {
        booking: true
      });
      console.log('Reservation updated:', updateResponse.data);
      fetchPanelBookings();
      resetForm();
      setBookingVisible(false);
      alert('Booking added successfully!');

    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Failed to add booking. Please try again.');
    }
  };

  const resetForm = () => {
    setBname('');
    setBphone('');
    setBemail('');
    setBsize('');
    setBaddress('');
    setBaddressh('');
    setReservationId('');
    setSelectedReservation('');
    setCustomerDrivers([{ dname: '', dphone: '', demail: '', dexperience: '', dpolicy: null, dlicense: null }]);
  };



  const fetchPanelBookings = async () => {
    setPanelLoading(true);
    try {
      const response = await fetch(`http://98.82.228.18:8132/api/book/bookfromPanel?page=${panelPage}&limit=${panelLimit}&search=${searchQuery}`);
      const data = await response.json();
      setPanelBookings(data.bookings);
      setTotalPanelPages(data.totalPages);
      setTotalBookings(data.totalBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setPanelLoading(false);
    }
  };

  // Handle page change
  const handlePanelPageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPanelPages) return;
    setPanelPage(newPage);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPanelPage(1); // Reset to page 1 on search query change
  };


  const fetchReservations = async () => {
    try {
      const response = await fetch('http://98.82.228.18:8132/api/reserve/reservations/fromPanel'); // Replace with your API URL
      const data = await response.json();
      setReservations(data); // Set reservations to state
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReservationChange = (e) => {
    const selectedId = e.target.value;
    setSelectedReservation(selectedId);
    setReservationId(selectedId);
    const selectedReservation = reservations.find((reservation) => reservation._id === selectedId);
    if (selectedReservation && selectedReservation.vehicleDetails) {
      setBsize(selectedReservation.vehicleDetails.passenger || '');
    } else {
      setBsize(''); // Clear bsize if no vehicleDetails found
    }
  };

  const sendPaymentMail = async (booking) => {
    setLoadingBookingId(booking._id);
    try {
      const response = await fetch('http://98.82.228.18:8132/api/send-rental-agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reserveAmount: booking.reservationId.reserveAmount,
          email: booking.bemail,
          bookingId: booking._id,
          reservationId: booking.reservationId._id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Show success message
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error sending payment mail:', error);
      alert('Failed to send payment mail.');
    }
    finally {
      setLoadingBookingId(null); // Clear loading state
    }
  };

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'chocolate' }}>Booking List from Website</h1>
          <div className="d-flex mb-3 align-items-center">
            <CForm className="d-flex align-items-center">
              <CFormInput
                type="text"
                placeholder="Search by email"
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginRight: '10px' }}
              />
            </CForm>
          </div>
        </CCardHeader>
        <CCardBody>
          {loading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings available</p>
          ) : (
            <CTable hover bordered striped responsive>
              <CTableHead color="dark">
                <CTableRow>

                  <CTableHeaderCell>Pickup Location</CTableHeaderCell>
                  <CTableHeaderCell>Drop Location</CTableHeaderCell>
                  <CTableHeaderCell>Pick Date</CTableHeaderCell>
                  <CTableHeaderCell>Drop Date</CTableHeaderCell>
                  <CTableHeaderCell>Booking Name</CTableHeaderCell>
                  <CTableHeaderCell>Phone</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {bookings.map((booking, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{booking.reservationDetails.pickup}</CTableDataCell>
                    <CTableDataCell>{booking.reservationDetails.drop}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(booking.reservationDetails.pickdate).toLocaleDateString('en-GB')}
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(booking.reservationDetails.dropdate).toLocaleDateString('en-GB')}
                    </CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.bname}</CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.bphone}</CTableDataCell>
                    <CTableDataCell>{booking.bookingDetails.bemail}</CTableDataCell>
                    <CTableDataCell>

                      <FontAwesomeIcon
                        icon={faEye}
                        onClick={() => viewBookingDetails(booking)}
                        style={{ cursor: 'pointer', marginRight: '10px', color: 'green' }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => deleteBooking(booking.bookingDetails.bookingId)}
                        style={{ cursor: 'pointer', color: 'red' }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          )}
          <div className="pagination d-flex align-items-center mt-3">
            <CButton
              disabled={page === 1 || bookings.length === 0 || loading}
              onClick={() => handlePageChange(page - 1)}
              color="primary"
              size="sm"
            >
              Previous
            </CButton>
            <span style={{ margin: '0 10px' }}>
              Page {page} of {totalPages}
            </span>
            <CButton
              disabled={page === totalPages || bookings.length === 0 || loading}
              onClick={() => handlePageChange(page + 1)}
              color="primary"
              size="sm"
            >
              Next
            </CButton>
          </div>

        </CCardBody>
      </CCard>
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'chocolate' }}>Booking List From Panel</h1>
          <div className="d-flex align-items-center">
            <CFormInput
              type="text"
              placeholder="Search by email"
              value={searchQuery}
              onChange={handleSearchChange}
              className="ms-3"
              style={{ width: "180px", marginRight: "1rem" }}
            />
            <CButton color="primary" className="me-3" size="sm" onClick={() => { resetForm(); setBookingVisible(true); }}>
              Add Booking
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {panelLoading ? (
            <p>Loading...</p>
          ) : panelBookings.length === 0 ? (
            <p>No bookings available</p>
          ) : (
            <CTable hover bordered striped responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Pickup Location</CTableHeaderCell>
                  <CTableHeaderCell>Drop Location</CTableHeaderCell>
                  <CTableHeaderCell>Pick Date</CTableHeaderCell>
                  <CTableHeaderCell>Drop Date</CTableHeaderCell>
                  <CTableHeaderCell>Booking Name</CTableHeaderCell>
                  <CTableHeaderCell>Phone</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {panelBookings.map((booking, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{booking.reservationId.pickup}</CTableDataCell>
                    <CTableDataCell>{booking.reservationId.drop}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(booking.reservationId.pickdate).toLocaleDateString('en-GB')}
                    </CTableDataCell>
                    <CTableDataCell>
                      {new Date(booking.reservationId.dropdate).toLocaleDateString('en-GB')}
                    </CTableDataCell>
                    <CTableDataCell>{booking.bname}</CTableDataCell>
                    <CTableDataCell>{booking.bphone}</CTableDataCell>
                    <CTableDataCell>{booking.bemail}</CTableDataCell>
                    <CTableDataCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {booking.reservationId?.accepted ? (
                          <CButton size="sm" color="info" onClick={() => handleAssignClick(booking)}>
                            Assign Driver
                          </CButton>
                        ) : (
                          <CButton
                            size="sm"
                            style={{
                              padding: '5px 10px',
                              backgroundColor: loadingBookingId === booking._id ? '#ccc' : '#b3ae0f',
                              color: loadingBookingId === booking._id ? '#666' : 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: loadingBookingId === booking._id ? 'not-allowed' : 'pointer',
                            }}
                            onClick={() => sendPaymentMail(booking)}
                            disabled={loadingBookingId === booking._id} // Disable only the button being processed
                          >
                            {loadingBookingId === booking._id ? 'Sending...' : 'Send Payment Mail'}
                          </CButton>
                        )}
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => deleteBooking(booking._id)}
                          style={{ cursor: 'pointer', color: 'red' }}
                        />
                      </div>
                    </CTableDataCell>


                  </CTableRow>
                ))}
              </CTableBody>

            </CTable>
          )}

          {/* Pagination Controls */}
          <div className="pagination d-flex align-items-center mt-3">
            <CButton
              disabled={panelPage === 1 || panelBookings.length === 0 || panelLoading}
              onClick={() => handlePanelPageChange(panelPage - 1)}
              color="primary"
              size="sm"
            >
              Previous
            </CButton>
            <span style={{ margin: '0 10px' }}>
              Page {panelPage} of {totalPanelPages}
            </span>
            <CButton
              disabled={panelPage === totalPanelPages || panelBookings.length === 0 || panelLoading}
              onClick={() => handlePanelPageChange(panelPage + 1)}
              color="primary"
              size="sm"
            >
              Next
            </CButton>
          </div>
        </CCardBody>
      </CCard>


      <CModal
        visible={viewOnlyVisible}
        onClose={() => setViewOnlyVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Booking Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <h4>Customer Details:</h4>
          <p><strong>Name:</strong> {currentBooking?.bookingDetails.bname}</p>
          <p><strong>Phone:</strong> {currentBooking?.bookingDetails.bphone}</p>
          <p><strong>Email:</strong> {currentBooking?.bookingDetails.bemail}</p>
          <p><strong>Rental Address:</strong> {currentBooking?.bookingDetails.baddress}</p>
          <p><strong>Home Address</strong> {currentBooking?.bookingDetails.baddressh}</p>
          <p><strong>Pickup Location:</strong> {currentBooking?.reservationDetails.pickup}</p>
          <p><strong>Drop Location:</strong> {currentBooking?.reservationDetails.drop}</p>
          <p><strong>Pickup Date:</strong> {currentBooking?.reservationDetails.pickdate}</p>
          <p><strong>Drop Date:</strong> {currentBooking?.reservationDetails.dropdate}</p>

          <h4>Customer Driver Details:</h4>
          {currentBooking?.bookingDetails.customerDrivers && currentBooking.bookingDetails.customerDrivers.length > 0 ? (
            currentBooking.bookingDetails.customerDrivers.map((driver, index) => (
              <div key={index}>
                <p><strong>Name:</strong> {driver.dname}</p>
                <p><strong>Phone:</strong> {driver.dphone}</p>
                <p><strong>Email:</strong> {driver.demail}</p>
                <p><strong>Experience:</strong> {driver.dexperience}</p>
                <p><strong>License:</strong> <a href={driver.dlicense} target="_blank" rel="noopener noreferrer">View License</a></p>
                <p><strong>Policy:</strong> <a href={driver.dpolicy} target="_blank" rel="noopener noreferrer">View Policy</a></p>
              </div>
            ))
          ) : (
            <p>No driver details available.</p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton size="sm" color="secondary" onClick={() => setViewOnlyVisible(false)}>
            Close
          </CButton>
          <CButton size="sm" style={{
            backgroundColor: '#b3ae0f',
          }} onClick={() => { setAssignDriverModalVisible(true); fetchAvailableDrivers(); }}>
            Assign Driver
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={assignDriverModalVisible}
        onClose={() => setAssignDriverModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Assign Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <select onChange={e => setCurrentDriver(e.target.value)} value={currentDriver}>
                  <option value="">Select Driver</option>
                  {(availableDrivers || []).map(driver => (
                    <option key={driver._id} value={driver._id}>{driver.name}</option>
                  ))}
                </select>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton size='sm' color="secondary" onClick={() => setAssignDriverModalVisible(false)}>
            Cancel
          </CButton>
          <CButton size='sm' color="primary" onClick={assignDriver}>
            Assign Driver
          </CButton>
        </CModalFooter>
      </CModal>

      {/* new Assign */}

      <CModal
        visible={newAssignDriverModalVisible}
        onClose={() => setNewAssignDriverModalVisible(false)}
      >
        <CModalHeader>
          <CModalTitle>Assign Driver</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol xs={12}>
                <select onChange={(e) => setCurrentDriver(e.target.value)} value={currentDriver}>
                  <option value="">Select Driver</option>
                  {(availableDrivers || []).map((driver) => (
                    <option key={driver._id} value={driver._id}>{driver.name}</option>
                  ))}
                </select>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton size="sm" color="secondary" onClick={() => setNewAssignDriverModalVisible(false)}>
            Cancel
          </CButton>
          <CButton size="sm" color="primary" onClick={assignDriver2}>
            Assign Driver
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal size="lg" visible={bookingVisible} onClose={() => setBookingVisible(false)}>
        <CModalHeader>
          <CModalTitle>Add Booking</CModalTitle>
        </CModalHeader>
        <CModalBody>

          <CForm>

            <h6 className="mb-3">Select Reservation</h6>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="reservationId">Reservation ID</CFormLabel>
                <CFormSelect
                  id="reservationId"
                  value={selectedReservation}
                  onChange={handleReservationChange}
                  disabled={loading || reservations.length === 0}
                >
                  <option value="" disabled>
                    {loading ? 'Loading...' : reservations.length === 0 ? 'No reservations available' : 'Select a reservation'}
                  </option>
                  {reservations.map((reservation) => (
                    <option key={reservation._id} value={reservation._id}>
                      {reservation._id}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            {selectedReservation && (
              <p className="mt-3">
                Selected Reservation ID: <strong>{reservationId}</strong>
              </p>
            )}
            <CRow className="mt-3 mb-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="bsize">Cart Size</CFormLabel>
                <CFormInput
                  id="bsize"
                  value={bsize}
                  readOnly
                />
              </CCol>
            </CRow>

            <h6 className="mb-3">Customer Details</h6>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="bname">Name</CFormLabel>
                <CFormInput id="bname" value={bname} onChange={(e) => setBname(e.target.value)} />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="bphone">Phone</CFormLabel>
                <CFormInput id="bphone" type="Number" value={bphone} onChange={(e) => setBphone(e.target.value)} />
              </CCol>
            </CRow>

            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="bemail">Email</CFormLabel>
                <CFormInput id="bemail" value={bemail} onChange={(e) => setBemail(e.target.value)} />
              </CCol>
            </CRow>
            <CRow>
              <CCol xs={12}>
                <CFormLabel htmlFor="baddress">Rental Address</CFormLabel>
                <CFormInput id="baddress" value={baddress} onChange={(e) => setBaddress(e.target.value)} />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol xs={12}>
                <CFormLabel htmlFor="baddressh">Home Address</CFormLabel>
                <CFormInput id="baddressh" value={baddressh} onChange={(e) => setBaddressh(e.target.value)} />
              </CCol>
            </CRow>

            {/* Additional form fields for bname, bphone, drivers, etc. */}
            {customerDrivers.map((driver, index) => (
              <div key={index} className="mb-4">
                <h6 className="mb-3">Customer Driver Details {index + 1}</h6>
                <CFormInput
                  placeholder="Driver Name"
                  value={driver.dname}
                  onChange={(e) => handleDriverChange(index, 'dname', e.target.value)}
                  className="mb-3"
                />
                <CFormInput
                  placeholder="Driver Phone"
                  value={driver.dphone}
                  onChange={(e) => handleDriverChange(index, 'dphone', e.target.value)}
                  className="mb-3"
                />
                <CFormInput
                  placeholder="Driver Email"
                  value={driver.demail}
                  onChange={(e) => handleDriverChange(index, 'demail', e.target.value)}
                  className="mb-3"
                />
                <CFormInput
                  placeholder="Driver Experience"
                  value={driver.dexperience}
                  onChange={(e) => handleDriverChange(index, 'dexperience', e.target.value)}
                  className="mb-3"
                />
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <CFormLabel htmlFor={`dpolicy-${index}`}>Policy</CFormLabel>
                    <CFormInput
                      type="file"
                      id={`dpolicy-${index}`}
                      onChange={(e) => handleFileChange(index, 'dpolicy', e.target.files[0])}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol xs={12}>
                    <CFormLabel htmlFor={`dlicense-${index}`}>License</CFormLabel>
                    <CFormInput
                      type="file"
                      id={`dlicense-${index}`}
                      onChange={(e) => handleFileChange(index, 'dlicense', e.target.files[0])}
                    />
                  </CCol>
                </CRow>
              </div>

            ))}
            <CButton size="sm" color="secondary" onClick={addDriver}>
              Add Another Driver
            </CButton>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setBookingVisible(false)}>Close</CButton>
          <CButton color="primary" onClick={handleAddBooking}>Save Booking</CButton>
        </CModalFooter>
      </CModal>

    </>
  );
};

export default BookManageList;
