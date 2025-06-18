import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CForm, CFormLabel, CRow, CCol, CButton, CFormSelect, CBadge
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';
import {
  format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval,
  isSameDay, addDays, addMonths, isSameMonth, isToday,
  startOfMonth, endOfMonth, isSameWeek, addWeeks, subMonths
} from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaFilter, FaCar } from 'react-icons/fa';
import { MdToday, MdViewDay, MdViewWeek, MdViewAgenda } from 'react-icons/md';

const CalendarView = () => {
  const [vehicles, setVehicles] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [miniCalendarDate, setMiniCalendarDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const sidebarRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Color palette
  const colors = {
    primary: '#4285F4',
    secondary: '#34A853',
    accent: '#EA4335',
    background: '#F8F9FA',
    text: '#202124',
    lightText: '#5F6368',
    border: '#DADCE0',
    today: '#1A73E8',
    event: '#E8F0FE',
    eventBorder: '#4285F4'
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://18.209.91.97:8132/api/book/calendar');
      if (response.data) {
        const events = response.data.data.map(eventData => ({
          id: eventData.paymentId,
          title: eventData.bookingDetails?.bname || 'No Title',
          email: eventData.bookingDetails?.bemail || 'No Email',
          start: new Date(eventData.reservationDetails?.pickdate),
          end: new Date(eventData.reservationDetails?.dropdate),
          pickup: eventData.reservationDetails?.pickup || 'Not specified',
          drop: eventData.reservationDetails?.drop || 'Not specified',
          vname: eventData.reservationDetails.vehicle?.vname || 'No Vehicle',
          tagNumber: eventData.reservationDetails.vehicle?.tagNumber || 'N/A',
          passenger: eventData.reservationDetails.vehicle?.passenger || 'N/A',
          status: eventData.status || 'confirmed',
          ...eventData,
        }));
        setAllEvents(events);
        setFilteredEvents(events);
      }
    } catch (error) {
      console.error("Error fetching events data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://18.209.91.97:8132/api/newVehicle');
      setVehicles(response.data.vehicles || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchVehicles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allEvents, selectedTags, searchTerm, statusFilter]);

  const applyFilters = () => {
    let filtered = [...allEvents];

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(event => selectedTags.includes(event.tagNumber));
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.email.toLowerCase().includes(term) ||
        event.vname.toLowerCase().includes(term) ||
        event.tagNumber.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  };

  const handleTagToggle = (tagNumber) => {
    setSelectedTags(prev =>
      prev.includes(tagNumber)
        ? prev.filter(tag => tag !== tagNumber)
        : [...prev, tagNumber]
    );
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const navigateDate = (direction) => {
    if (view === 'day') {
      setSelectedDay(addDays(selectedDay, direction));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, direction * 7));
    } else { // month
      setCurrentDate(addMonths(currentDate, direction));
    }
    setMiniCalendarDate(currentDate);
  };

  const navigateMiniCalendar = (direction) => {
    if (view === 'day') {
      setSelectedDay(addDays(selectedDay, direction));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, direction));
    } else { // month
      setCurrentDate(addMonths(currentDate, direction));
    }
    setMiniCalendarDate(addMonths(miniCalendarDate, direction));
  };

  const handleMiniCalendarDayClick = (day) => {
    setSelectedDay(day);
    if (view === 'month') {
      setCurrentDate(day);
    }
  };

  const getDaysForView = () => {
    if (view === 'day') {
      return [selectedDay];
    } else if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      return eachDayOfInterval({ start, end });
    } else { // month
      const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return eachDayOfInterval({ start: firstDay, end: lastDay });
    }
  };

  const getEventsForDay = (day) => {
    return filteredEvents.filter(event =>
      isSameDay(event.start, day) ||
      (event.end && isSameDay(event.end, day)) ||
      (event.start <= day && event.end >= day)
    );
  };

  const getEventColor = (status) => {
    switch (status) {
      case 'confirmed': return '#E8F0FE';
      case 'completed': return '#E6F4EA';
      case 'cancelled': return '#FCE8E6';
      default: return '#E8F0FE';
    }
  };

  const getEventBorderColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4285F4';
      case 'completed': return '#34A853';
      case 'cancelled': return '#EA4335';
      default: return '#4285F4';
    }
  };

  const renderMiniCalendar = () => {
    const start = startOfMonth(miniCalendarDate);
    const end = endOfMonth(miniCalendarDate);
    const days = eachDayOfInterval({ start, end });

    const weeks = [];
    let week = [];

    days.forEach((day, i) => {
      week.push(day);
      if (day.getDay() === 6 || i === days.length - 1) {
        weeks.push(week);
        week = [];
      }
    });

    return (
      <div style={{
        width: '240px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '12px',
        marginRight: '16px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <button
            onClick={() => setMiniCalendarDate(subMonths(miniCalendarDate, 1))}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              ':hover': {
                backgroundColor: '#F1F3F4'
              }
            }}
          >
            <FaChevronLeft size={14} color={colors.lightText} />
          </button>
          <div style={{
            fontWeight: '500',
            color: colors.text
          }}>
            {format(miniCalendarDate, 'MMMM yyyy')}
          </div>
          <button
            onClick={() => setMiniCalendarDate(addMonths(miniCalendarDate, 1))}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              ':hover': {
                backgroundColor: '#F1F3F4'
              }
            }}
          >
            <FaChevronRight size={14} color={colors.lightText} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} style={{
              textAlign: 'center',
              fontSize: '0.75rem',
              color: colors.lightText,
              padding: '4px'
            }}>
              {day}
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px'
        }}>
          {weeks.flatMap((week, weekIndex) =>
            week.map((day, dayIndex) => {
              const isSelected = isSameDay(day, selectedDay);
              const hasEvents = getEventsForDay(day).length > 0;
              const isCurrentMonth = isSameMonth(day, miniCalendarDate);

              return (
                <button
                  key={`${weekIndex}-${dayIndex}`}
                  onClick={() => handleMiniCalendarDayClick(day)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: 'none',
                    background: isSelected ? colors.primary : 'transparent',
                    color: isSelected ? 'white' :
                      !isCurrentMonth ? colors.border :
                        isToday(day) ? colors.primary : colors.text,
                    fontWeight: isSelected ? 'bold' :
                      isToday(day) ? 'bold' : 'normal',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    opacity: isCurrentMonth ? 1 : 0.5,
                    ':hover': {
                      backgroundColor: isSelected ? colors.primary : '#F1F3F4'
                    }
                  }}
                >
                  {format(day, 'd')}
                  {hasEvents && (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: isSelected ? 'white' : colors.primary
                    }} />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDay(selectedDay);

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px',
        flex: 1
      }}>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: '500',
          color: colors.text,
          marginBottom: '16px'
        }}>
          {format(selectedDay, 'EEEE, MMMM d, yyyy')}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {dayEvents.length === 0 ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
              color: colors.lightText
            }}>
              No bookings for this day
            </div>
          ) : (
            dayEvents.map(event => (
              <div
                key={event.id}
                style={{
                  backgroundColor: getEventColor(event.status),
                  borderLeft: `3px solid ${getEventBorderColor(event.status)}`,
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '12px',
                  cursor: 'pointer',
                  color: colors.text,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  ':hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => handleViewDetails(event)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {event.title}
                  </div>
                  <CBadge color={event.status === 'confirmed' ? 'primary' :
                    event.status === 'completed' ? 'success' : 'danger'}>
                    {event.status}
                  </CBadge>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginTop: '12px'
                }}>
                  <div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: colors.lightText,
                      marginBottom: '4px'
                    }}>
                      Vehicle
                    </div>
                    <div style={{ fontWeight: '500' }}>
                      {event.vname} ({event.tagNumber})
                    </div>
                  </div>

                  <div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: colors.lightText,
                      marginBottom: '4px'
                    }}>
                      Pickup Location
                    </div>
                    <div style={{ fontWeight: '500' }}>
                      {event.pickup}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const days = getDaysForView();

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: colors.background,
        flex: 1
      }}>
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}>
          <div style={{ width: '60px' }}></div>
          {days.map(day => (
            <div
              key={day.getTime()}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px 8px',
                cursor: 'pointer',
                backgroundColor: isToday(day) ? colors.today : 'transparent',
                color: isToday(day) ? 'white' : colors.text,
                transition: 'all 0.2s ease'
              }}
              onClick={() => {
                setSelectedDay(day);
                setView('day');
              }}
            >
              <div style={{
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                opacity: isToday(day) ? 0.9 : 0.7
              }}>
                {format(day, 'EEE')}
              </div>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: isToday(day) ? 'bold' : 'normal',
                marginTop: '4px'
              }}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flex: 1 }}>
            {days.map(day => (
              <div
                key={day.getTime()}
                style={{
                  flex: 1,
                  borderRight: `1px solid ${colors.border}`,
                  position: 'relative',
                  minHeight: '100px',
                  backgroundColor: 'white',
                  padding: '8px'
                }}
              >
                {getEventsForDay(day).map(event => (
                  <div
                    key={event.id}
                    style={{
                      backgroundColor: getEventColor(event.status),
                      borderLeft: `3px solid ${getEventBorderColor(event.status)}`,
                      borderRadius: '4px',
                      padding: '6px 8px',
                      margin: '4px 0',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.85rem',
                      color: colors.text,
                      transition: 'all 0.2s ease',
                      ':hover': {
                        transform: 'translateX(2px)'
                      }
                    }}
                    onClick={() => handleViewDetails(event)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysForView();
    const weeks = [];

    // Split days into weeks
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'white',
        flex: 1
      }}>
        <div style={{
          display: 'flex',
          borderBottom: `1px solid ${colors.border}`,
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 1
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '12px 8px',
                fontSize: '0.85rem',
                fontWeight: '500',
                color: colors.lightText,
                textTransform: 'uppercase'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {weeks.map((week, weekIndex) => (
            <div
              key={weekIndex}
              style={{
                display: 'flex',
                minHeight: '120px',
                borderBottom: `1px solid ${colors.border}`
              }}
            >
              {week.map(day => {
                const isCurrentMonth = isSameMonth(day, currentDate);
                const dayEvents = getEventsForDay(day);

                return (
                  <div
                    key={day.getTime()}
                    style={{
                      flex: 1,
                      borderRight: `1px solid ${colors.border}`,
                      padding: '4px',
                      backgroundColor: isToday(day) ? '#E8F0FE' : 'white',
                      opacity: isCurrentMonth ? 1 : 0.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        backgroundColor: '#F1F3F4'
                      }
                    }}
                    onClick={() => {
                      setSelectedDay(day);
                      setView('day');
                    }}
                  >
                    <div style={{
                      textAlign: 'right',
                      padding: '4px 8px',
                      fontWeight: isToday(day) ? 'bold' : 'normal',
                      color: isToday(day) ? colors.today : colors.text
                    }}>
                      {format(day, 'd')}
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          style={{
                            backgroundColor: getEventColor(event.status),
                            borderLeft: `3px solid ${getEventBorderColor(event.status)}`,
                            borderRadius: '4px',
                            padding: '2px 4px',
                            margin: '2px 0',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '0.75rem',
                            color: colors.text,
                            transition: 'all 0.2s ease',
                            ':hover': {
                              transform: 'translateX(2px)'
                            }
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(event);
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div style={{
                          fontSize: '0.75rem',
                          color: colors.lightText,
                          textAlign: 'center',
                          padding: '2px'
                        }}>
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: colors.background
      }}>
        <div style={{
          padding: '24px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid ${colors.border}`,
            borderTopColor: colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div style={{
            fontSize: '1.1rem',
            color: colors.text,
            fontWeight: '500'
          }}>
            Loading Calendar...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: colors.background
    }}>
      {/* Header with navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{
            margin: 0,
            color: colors.text,
            fontSize: '1.5rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FaCar style={{ marginRight: '12px', color: colors.primary }} />
            Booking Calendar
          </h2>
          <div style={{
            marginLeft: '24px',
            display: 'flex',
            gap: '4px',
            backgroundColor: '#F1F3F4',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={() => setView('day')}
              style={{
                padding: '6px 12px',
                backgroundColor: view === 'day' ? 'white' : 'transparent',
                color: view === 'day' ? colors.primary : colors.lightText,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: view === 'day' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontWeight: view === 'day' ? '500' : 'normal'
              }}
            >
              <MdViewDay size={16} />
              Day
            </button>
            <button
              onClick={() => setView('week')}
              style={{
                padding: '6px 12px',
                backgroundColor: view === 'week' ? 'white' : 'transparent',
                color: view === 'week' ? colors.primary : colors.lightText,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: view === 'week' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontWeight: view === 'week' ? '500' : 'normal'
              }}
            >
              <MdViewWeek size={16} />
              Week
            </button>
            <button
              onClick={() => setView('month')}
              style={{
                padding: '6px 12px',
                backgroundColor: view === 'month' ? 'white' : 'transparent',
                color: view === 'month' ? colors.primary : colors.lightText,
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: view === 'month' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                fontWeight: view === 'month' ? '500' : 'normal'
              }}
            >
              <MdViewAgenda size={16} />
              Month
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#F1F3F4',
            borderRadius: '20px',
            padding: '6px 12px',
            gap: '8px'
          }}>
            <button
              onClick={() => navigateDate(-1)}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.lightText,
                ':hover': { backgroundColor: '#E0E0E0' }
              }}
            >
              <FaChevronLeft size={14} />
            </button>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '500',
              color: colors.text,
              minWidth: '200px',
              textAlign: 'center'
            }}>
              {view === 'day' && format(selectedDay, 'MMMM d, yyyy')}
              {view === 'week' && `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`}
              {view === 'month' && format(currentDate, 'MMMM yyyy')}
            </div>
            <button
              onClick={() => navigateDate(1)}
              style={{
                padding: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.lightText,
                ':hover': { backgroundColor: '#E0E0E0' }
              }}
            >
              <FaChevronRight size={14} />
            </button>
          </div>
          <button
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDay(new Date());
              setMiniCalendarDate(new Date());
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#F1F3F4',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              color: colors.text,
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ':hover': { backgroundColor: '#E0E0E0' }
            }}
          >
            <MdToday size={16} />
            Today
          </button>
          <button
            onClick={toggleSidebar}
            style={{
              padding: '8px',
              backgroundColor: '#F1F3F4',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: colors.text,
              ':hover': { backgroundColor: '#E0E0E0' }
            }}
          >
            <FaFilter size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar with filters */}
        <div
          ref={sidebarRef}
          style={{
            width: sidebarCollapsed ? '0' : '300px',
            background: "white",
            padding: sidebarCollapsed ? '0' : "20px",
            borderRight: `1px solid ${colors.border}`,
            color: colors.text,
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {!sidebarCollapsed && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: colors.lightText
                }}>
                  Search Bookings
                </label>
                <input
                  type="text"
                  placeholder="Search by name, email, vehicle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    ':focus': {
                      outline: 'none',
                      borderColor: colors.primary,
                      boxShadow: `0 0 0 2px ${colors.primary}20`
                    }
                  }}
                />
              </div>
              {/* Mini Calendar */}
              <div style={{
                width: 'auto',
                borderRight: `1px solid ${colors.border}`,
                overflowY: 'auto'
              }}>
                {renderMiniCalendar()}
              </div>


              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: colors.lightText
                }}>
                  Booking Status
                </label>
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </CFormSelect>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  color: colors.lightText
                }}>
                  Vehicle Tag Numbers
                </label>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  paddingRight: '8px'
                }}>
                  <div
                    style={{
                      padding: '8px 12px',
                      background: selectedTags.length === 0 ? '#E8F0FE' : '#F8F9FA',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      border: selectedTags.length === 0 ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
                      ':hover': {
                        backgroundColor: '#F1F3F4'
                      }
                    }}
                    onClick={() => setSelectedTags([])}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: selectedTags.length === 0 ? 'none' : `1px solid ${colors.border}`,
                      backgroundColor: selectedTags.length === 0 ? colors.primary : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {selectedTags.length === 0 && '✓'}
                    </div>
                    <span>All Vehicles</span>
                  </div>

                  {vehicles.map((vehicle, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '8px 12px',
                        background: selectedTags.includes(vehicle.tagNumber) ? '#E8F0FE' : '#F8F9FA',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        border: selectedTags.includes(vehicle.tagNumber) ? `1px solid ${colors.primary}` : `1px solid ${colors.border}`,
                        ':hover': {
                          backgroundColor: '#F1F3F4'
                        }
                      }}
                      onClick={() => handleTagToggle(vehicle.tagNumber)}
                    >
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: selectedTags.includes(vehicle.tagNumber) ? 'none' : `1px solid ${colors.border}`,
                        backgroundColor: selectedTags.includes(vehicle.tagNumber) ? colors.primary : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        {selectedTags.includes(vehicle.tagNumber) && '✓'}
                      </div>
                      <span>{vehicle.tagNumber}</span>
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.8rem',
                        color: colors.lightText
                      }}>
                        {vehicle.vname}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          backgroundColor: 'white',
          transition: 'all 0.3s ease'
        }}>


          {/* Main Calendar Content */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
          }}>
            {view === 'day' && renderDayView()}
            {view === 'week' && renderWeekView()}
            {view === 'month' && renderMonthView()}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <CModal
        visible={modalOpen}
        onClose={handleModalClose}
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle style={{
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaCalendarAlt />
            Booking Details
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEvent && (
            <CForm>
              {/* Customer Details */}
              <h5 className="mb-3" style={{
                fontWeight: '600',
                color: colors.primary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: `${colors.primary}20`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCar size={12} color={colors.primary} />
                </span>
                Customer Details
              </h5>
              <CRow className="mb-4">
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Name</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {selectedEvent.title || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Email</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {selectedEvent.email || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Pickup Date</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {format(selectedEvent.start, 'MMMM d, yyyy')}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Return Date</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {format(selectedEvent.end, 'MMMM d, yyyy')}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Pickup Location</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {selectedEvent.pickup || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Return Location</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {selectedEvent.drop || 'N/A'}
                  </div>
                </CCol>
              </CRow>

              {/* Vehicle Details */}
              <h5 className="mb-3" style={{
                fontWeight: '600',
                color: colors.primary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: `${colors.primary}20`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCar size={12} color={colors.primary} />
                </span>
                Vehicle Details
              </h5>
              <CRow className="mb-4">
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Vehicle Name</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {selectedEvent.vname || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Tag Number</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {selectedEvent.tagNumber || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Passenger Capacity</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${colors.primary}`
                  }}>
                    {selectedEvent.passenger || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: colors.lightText }}>Booking Status</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#F8F9FA',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${getEventBorderColor(selectedEvent.status)}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span>{selectedEvent.status || 'N/A'}</span>
                    <CBadge
                      color={selectedEvent.status === 'confirmed' ? 'primary' :
                        selectedEvent.status === 'completed' ? 'success' : 'danger'}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {selectedEvent.status}
                    </CBadge>
                  </div>
                </CCol>
              </CRow>
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={handleModalClose}
            style={{ borderRadius: '20px', padding: '8px 16px' }}
          >
            Close
          </CButton>
          <CButton
            color="primary"
            style={{ borderRadius: '20px', padding: '8px 16px' }}
          >
            Edit Booking
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CalendarView;