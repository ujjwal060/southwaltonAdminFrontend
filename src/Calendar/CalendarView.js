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
  const [view, setView] = useState('month');
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const sidebarRef = useRef(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

    if (selectedTags.length > 0) {
      filtered = filtered.filter(event => selectedTags.includes(event.tagNumber));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(term) ||
        event.email.toLowerCase().includes(term) ||
        event.vname.toLowerCase().includes(term) ||
        event.tagNumber.toLowerCase().includes(term)
      );
    }

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
    } else {
      setCurrentDate(addMonths(currentDate, direction));
    }
    setMiniCalendarDate(currentDate);
  };

  const navigateMiniCalendar = (direction) => {
    if (view === 'day') {
      setSelectedDay(addDays(selectedDay, direction));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, direction));
    } else {
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
    } else {
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
      case 'confirmed': return 'var(--cui-info-light)';
      case 'completed': return 'var(--cui-success-light)';
      case 'cancelled': return 'var(--cui-danger-light)';
      default: return 'var(--cui-info-light)';
    }
  };

  const getEventBorderColor = (status) => {
    switch (status) {
      case 'confirmed': return 'var(--cui-info)';
      case 'completed': return 'var(--cui-success)';
      case 'cancelled': return 'var(--cui-danger)';
      default: return 'var(--cui-info)';
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
        backgroundColor: 'var(--cui-body-bg)',
        borderRadius: '8px',
        boxShadow: 'var(--cui-box-shadow)',
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
                backgroundColor: 'var(--cui-secondary-bg)'
              }
            }}
          >
            <FaChevronLeft size={14} color="var(--cui-secondary-color)" />
          </button>
          <div style={{
            fontWeight: '500',
            color: 'var(--cui-body-color)'
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
                backgroundColor: 'var(--cui-secondary-bg)'
              }
            }}
          >
            <FaChevronRight size={14} color="var(--cui-secondary-color)" />
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
              color: 'var(--cui-secondary-color)',
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
                    background: isSelected ? 'var(--cui-primary)' : 'transparent',
                    color: isSelected ? 'var(--cui-white)' :
                      !isCurrentMonth ? 'var(--cui-border-color)' :
                        isToday(day) ? 'var(--cui-primary)' : 'var(--cui-body-color)',
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
                      backgroundColor: isSelected ? 'var(--cui-primary)' : 'var(--cui-secondary-bg)'
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
                      backgroundColor: isSelected ? 'var(--cui-white)' : 'var(--cui-primary)'
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
          color: 'var(--cui-body-color)',
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
              color: 'var(--cui-secondary-color)'
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
                  color: 'var(--cui-body-color)',
                  boxShadow: 'var(--cui-box-shadow)',
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
                      color: 'var(--cui-secondary-color)',
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
                      color: 'var(--cui-secondary-color)',
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
        backgroundColor: 'var(--cui-body-bg)',
        flex: 1
      }}>
        <div style={{
          display: 'flex',
          borderBottom: `1px solid var(--cui-border-color)`,
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--cui-body-bg)',
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
                backgroundColor: isToday(day) ? 'var(--cui-primary)' : 'transparent',
                color: isToday(day) ? 'var(--cui-white)' : 'var(--cui-body-color)',
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
                  borderRight: `1px solid var(--cui-border-color)`,
                  position: 'relative',
                  minHeight: '100px',
                  backgroundColor: 'var(--cui-body-bg)',
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
                      color: 'var(--cui-body-color)',
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

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--cui-body-bg)',
        flex: 1
      }}>
        <div style={{
          display: 'flex',
          borderBottom: `1px solid var(--cui-border-color)`,
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--cui-body-bg)',
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
                color: 'var(--cui-secondary-color)',
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
                borderBottom: `1px solid var(--cui-border-color)`
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
                      borderRight: `1px solid var(--cui-border-color)`,
                      padding: '4px',
                      backgroundColor: isToday(day) ? 'var(--cui-info-light)' : 'var(--cui-body-bg)',
                      opacity: isCurrentMonth ? 1 : 0.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        backgroundColor: 'var(--cui-secondary-bg)'
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
                      color: isToday(day) ? 'var(--cui-primary)' : 'var(--cui-body-color)'
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
                            color: 'var(--cui-body-color)',
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
                          color: 'var(--cui-secondary-color)',
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
        backgroundColor: 'var(--cui-body-bg)'
      }}>
        <div style={{
          padding: '24px', 
          backgroundColor: 'var(--cui-body-bg)',
          borderRadius: '8px',
          boxShadow: 'var(--cui-box-shadow)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: `4px solid var(--cui-border-color)`,
            borderTopColor: 'var(--cui-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div style={{
            fontSize: '1.1rem',
            color: 'var(--cui-body-color)',
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
      height: 'auto',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--cui-body-bg)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        borderBottom: `1px solid var(--cui-border-color)`,
        backgroundColor: 'var(--cui-body-bg)',
        boxShadow: 'var(--cui-box-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 style={{
            margin: 0,
            color: 'var(--cui-body-color)',
            fontSize: '1.5rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center'
          }}>
            <FaCar style={{ marginRight: '12px', color: 'var(--cui-primary)' }} />
            Booking Calendar
          </h2>
          <div style={{
            marginLeft: '24px',
            display: 'flex',
            gap: '4px',
            backgroundColor: 'var(--cui-secondary-bg)',
            borderRadius: '8px',
            padding: '4px'
          }}>
            <button
              onClick={() => setView('day')}
              style={{
                padding: '6px 12px',
                backgroundColor: view === 'day' ? 'var(--cui-body-bg)' : 'transparent',
                color: view === 'day' ? 'var(--cui-primary)' : 'var(--cui-secondary-color)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: view === 'day' ? 'var(--cui-box-shadow)' : 'none',
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
                backgroundColor: view === 'week' ? 'var(--cui-body-bg)' : 'transparent',
                color: view === 'week' ? 'var(--cui-primary)' : 'var(--cui-secondary-color)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: view === 'week' ? 'var(--cui-box-shadow)' : 'none',
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
                backgroundColor: view === 'month' ? 'var(--cui-body-bg)' : 'transparent',
                color: view === 'month' ? 'var(--cui-primary)' : 'var(--cui-secondary-color)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: view === 'month' ? 'var(--cui-box-shadow)' : 'none',
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
            backgroundColor: 'var(--cui-secondary-bg)',
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
                color: 'var(--cui-secondary-color)',
                ':hover': { backgroundColor: 'var(--cui-hover-bg)' }
              }}
            >
              <FaChevronLeft size={14} />
            </button>
            <div style={{
              fontSize: '1.1rem',
              fontWeight: '500',
              color: 'var(--cui-body-color)',
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
                color: 'var(--cui-secondary-color)',
                ':hover': { backgroundColor: 'var(--cui-hover-bg)' }
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
              backgroundColor: 'var(--cui-secondary-bg)',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              color: 'var(--cui-body-color)',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              ':hover': { backgroundColor: 'var(--cui-hover-bg)' }
            }}
          >
            <MdToday size={16} />
            Today
          </button>
          <button
            onClick={toggleSidebar}
            style={{
              padding: '8px',
              backgroundColor: 'var(--cui-secondary-bg)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--cui-body-color)',
              ':hover': { backgroundColor: 'var(--cui-hover-bg)' }
            }}
          >
            <FaFilter size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div
          ref={sidebarRef}
          style={{
            width: sidebarCollapsed ? '0' : '300px',
            background: 'var(--cui-body-bg)',
            padding: sidebarCollapsed ? '0' : '20px',
            borderRight: `1px solid var(--cui-border-color)`,
            color: 'var(--cui-body-color)',
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
                  color: 'var(--cui-secondary-color)'
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
                    border: `1px solid var(--cui-border-color)`,
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    backgroundColor: 'var(--cui-body-bg)',
                    color: 'var(--cui-body-color)',
                    ':focus': {
                      outline: 'none',
                      borderColor: 'var(--cui-primary)',
                      boxShadow: `0 0 0 2px var(--cui-primary-light)`
                    }
                  }}
                />
              </div>
              <div style={{
                width: 'auto',
                borderRight: `1px solid var(--cui-border-color)`,
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
                  color: 'var(--cui-secondary-color)'
                }}>
                  Booking Status
                </label>
                <CFormSelect
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: 'var(--cui-body-bg)',
                    color: 'var(--cui-body-color)',
                    borderColor: 'var(--cui-border-color)'
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
                  color: 'var(--cui-secondary-color)'
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
                      background: selectedTags.length === 0 ? 'var(--cui-info-light)' : 'var(--cui-secondary-bg)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      border: selectedTags.length === 0 ? `1px solid var(--cui-primary)` : `1px solid var(--cui-border-color)`,
                      ':hover': {
                        backgroundColor: 'var(--cui-hover-bg)'
                      }
                    }}
                    onClick={() => setSelectedTags([])}
                  >
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: selectedTags.length === 0 ? 'none' : `1px solid var(--cui-border-color)`,
                      backgroundColor: selectedTags.length === 0 ? 'var(--cui-primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--cui-white)',
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
                        background: selectedTags.includes(vehicle.tagNumber) ? 'var(--cui-info-light)' : 'var(--cui-secondary-bg)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        border: selectedTags.includes(vehicle.tagNumber) ? `1px solid var(--cui-primary)` : `1px solid var(--cui-border-color)`,
                        ':hover': {
                          backgroundColor: 'var(--cui-hover-bg)'
                        }
                      }}
                      onClick={() => handleTagToggle(vehicle.tagNumber)}
                    >
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: selectedTags.includes(vehicle.tagNumber) ? 'none' : `1px solid var(--cui-border-color)`,
                        backgroundColor: selectedTags.includes(vehicle.tagNumber) ? 'var(--cui-primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--cui-white)',
                        fontSize: '12px'
                      }}>
                        {selectedTags.includes(vehicle.tagNumber) && '✓'}
                      </div>
                      <span>{vehicle.tagNumber}</span>
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.8rem',
                        color: 'var(--cui-secondary-color)'
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

        <div style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          backgroundColor: 'var(--cui-body-bg)',
          transition: 'all 0.3s ease'
        }}>
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

      <CModal
        visible={modalOpen}
        onClose={handleModalClose}
        size="lg"
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle style={{
            color: 'var(--cui-body-color)',
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
              <h5 className="mb-3" style={{
                fontWeight: '600',
                color: 'var(--cui-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'var(--cui-primary-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCar size={12} color="var(--cui-primary)" />
                </span>
                Customer Details
              </h5>
              <CRow className="mb-4">
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Name</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {selectedEvent.title || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Email</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {selectedEvent.email || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Pickup Date</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {format(selectedEvent.start, 'MMMM d, yyyy')}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Return Date</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {format(selectedEvent.end, 'MMMM d, yyyy')}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Pickup Location</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {selectedEvent.pickup || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Return Location</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {selectedEvent.drop || 'N/A'}
                  </div>
                </CCol>
              </CRow>

              <h5 className="mb-3" style={{
                fontWeight: '600',
                color: 'var(--cui-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: 'var(--cui-primary-light)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCar size={12} color="var(--cui-primary)" />
                </span>
                Vehicle Details
              </h5>
              <CRow className="mb-4">
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Vehicle Name</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {selectedEvent.vname || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Tag Number</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {selectedEvent.tagNumber || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Passenger Capacity</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
                    borderRadius: '6px',
                    borderLeft: `3px solid var(--cui-primary)`
                  }}>
                    {selectedEvent.passenger || 'N/A'}
                  </div>
                </CCol>
                <CCol sm={6} className="mb-3">
                  <CFormLabel style={{ fontWeight: '500', color: 'var(--cui-secondary-color)' }}>Booking Status</CFormLabel>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'var(--cui-secondary-bg)',
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
          
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default CalendarView;