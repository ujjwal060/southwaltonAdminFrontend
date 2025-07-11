import React, { useEffect, useState } from 'react';
import {
  CCard, CCardHeader, CCardBody, CModal, CModalHeader, CModalTitle,
  CModalBody, CModalFooter, CForm, CFormLabel, CFormInput, CRow,
  CCol, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell,
} from '@coreui/react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'


const Season = () => {
  const [seasonData, setSeasonData] = useState({ offSeason: [], secondarySeason: [], peakSeason: [] });
  const [selectedSeasonType, setSelectedSeasonType] = useState('');
  const [month, setMonth] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editEntryId, setEditEntryId] = useState(null);

  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      const response = await axios.get('http://52.20.55.193:8132/api/seasons');
      const data = response.data;
      setSeasonData({
        offSeason: data[0]?.offSeason || [],
        secondarySeason: data[0]?.secondarySeason || [],
        peakSeason: data[0]?.peakSeason || []
      });
    } catch (error) {
      console.error('Error fetching seasons:', error);
    }
  };

  const handleSaveSeason = async () => {
    const seasonEntry = { seasonType: selectedSeasonType, month, dateFrom, dateTo };

    try {
      if (editMode) {
        await axios.put(`http://52.20.55.193:8132/api/seasons/${editEntryId}`, seasonEntry);
      } else {
        await axios.post('http://52.20.55.193:8132/api/seasons/add', seasonEntry);
      }
      fetchSeasons();
      setModalVisible(false);
      resetForm();
    } catch (error) {
      console.error('Error saving season:', error);
    }
  };

  const handleOpenModal = (type, entry = null) => {
    setSelectedSeasonType(type);
    if (entry) {
      setEditMode(true);
      setEditEntryId(entry._id);
      setMonth(entry.month);
      setDateFrom(new Date(entry.dateFrom).toISOString().slice(0, 10));
      setDateTo(new Date(entry.dateTo).toISOString().slice(0, 10));
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const handleDeleteSeason = async (id) => {
    try {
      await axios.delete(`http://52.20.55.193:8132/api/seasons/${id}`);
      fetchSeasons();
    } catch (error) {
      console.error('Error deleting season:', error);
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setEditEntryId(null);
    setMonth('');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <>
      <CCard className="d-flex w-100">
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h1 style={{ fontSize: '24px', color: 'indianred' }}>Season Management</h1>
          <div className="d-flex align-items-center">
            <CButton color="primary" size="sm" className="me-3" onClick={() => handleOpenModal('offSeason')}>
              Off Season
            </CButton>
            <CButton color="secondary" size="sm" className="me-3" onClick={() => handleOpenModal('secondarySeason')}>
              Secondary Season
            </CButton>
            <CButton color="success" size="sm" onClick={() => handleOpenModal('peakSeason')}>
              Peak Season
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          {['offSeason', 'secondarySeason', 'peakSeason'].map((seasonType) => (
            <div key={seasonType} className="mb-4">
              <h5>{seasonType.replace(/([A-Z])/g, ' $1')}</h5>
              <CTable hover bordered striped responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Month</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date From</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date To</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {seasonData[seasonType]?.map((entry, index) => (
                    <CTableRow key={entry._id || index}>
                      <CTableDataCell>{entry.month}</CTableDataCell>
                      <CTableDataCell>{new Date(entry.dateFrom).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>{new Date(entry.dateTo).toLocaleDateString()}</CTableDataCell>
                      <CTableDataCell>
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          style={{ color: '#b3ae0f', cursor: 'pointer', marginRight: '10px' }}
                          onClick={() => handleOpenModal(seasonType, entry)}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          style={{ color: '#bb1616', cursor: 'pointer' }}
                          onClick={() => handleDeleteSeason(entry._id)}
                        />
                      </CTableDataCell>

                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          ))}
        </CCardBody>
      </CCard>

      {/* Modal for Adding/Editing Season Entry */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>{editMode ? `Edit ${selectedSeasonType}` : `Add ${selectedSeasonType}`} - Set Dates</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md="6">
                <CFormLabel htmlFor="month">Month</CFormLabel>
                <CFormInput
                  type="text"
                  id="month"
                  placeholder="Enter month (e.g., January)"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </CCol>
              <CCol md="6">
                <CFormLabel htmlFor="dateFrom">Date From</CFormLabel>
                <CFormInput
                  type="date"
                  id="dateFrom"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol md="6">
                <CFormLabel htmlFor="dateTo">Date To</CFormLabel>
                <CFormInput
                  type="date"
                  id="dateTo"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSaveSeason}>
            {editMode ? 'Update Season' : 'Save Season'}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Season;
