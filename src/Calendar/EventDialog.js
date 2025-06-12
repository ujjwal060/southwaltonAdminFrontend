import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FilledInput from '@material-ui/core/FilledInput';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Check from '@material-ui/icons/Check';
import { TextField } from '@material-ui/core';
import './Calendar.css';

const Transition = React.forwardRef(function Transition(props, ref) {
  return React.createElement(Slide, { direction: 'down', ref: ref, ...props });
});

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
      margin: '10px 0px'
    },
    '& .MuiFormLabel-root': {
      margin: '10px 0px'
    },
    '& .MuiDialog-root': {
      width: '300px'
    }
  }
}));

export const EventDialog = (props) => {
  const {
    eventModal,
    setEventModal,
    event,
    eventTitle,
    setEventTitle,
    radios,
    setRadios,
    eventDescription,
    setEventDescription,
    addNewEvent,
    editEvent,
    isEditModal
  } = props;

  const classes = useStyles();

  return React.createElement(Dialog, {
    className: classes.root,
    open: eventModal,
    TransitionComponent: Transition,
    keepMounted: true,
    onClose: () => setEventModal(false),
    'aria-labelledby': 'alert-dialog-slide-title',
    'aria-describedby': 'alert-dialog-slide-description'
  },
    React.createElement(DialogContent, null,
      React.createElement('h3', null, isEditModal ? 'Edit Event' : 'Add New Event'),
      React.createElement(FormGroup, null,
        React.createElement(TextField, {
          required: true,
          label: 'Event title',
          variant: 'outlined',
          placeholder: 'Event Title',
          type: 'text',
          value: eventTitle,
          onChange: (e) => setEventTitle(e.target.value)
        })
      ),
      React.createElement(FormGroup, null,
        React.createElement(FormLabel, null, 'Status'),
        React.createElement(Box, null,
          React.createElement(Box, { display: 'inline-block', marginRight: '.5rem' },
            React.createElement(IconButton, {
              className: 'bg-info',
              onClick: () => setRadios('bg-info')
            },
              radios === 'bg-info' && React.createElement(Box, {
                width: '.6rem!important',
                height: '.6rem!important',
                component: Check
              })
            )
          ),
          React.createElement(Box, { display: 'inline-block', marginRight: '.5rem' },
            React.createElement(IconButton, {
              className: 'bg-warning',
              onClick: () => setRadios('bg-warning')
            },
              radios === 'bg-warning' && React.createElement(Box, {
                width: '.6rem!important',
                height: '.6rem!important',
                component: Check
              })
            )
          ),
          React.createElement(Box, { display: 'inline-block', marginRight: '.5rem' },
            React.createElement(IconButton, {
              className: 'bg-danger',
              onClick: () => setRadios('bg-danger')
            },
              radios === 'bg-danger' && React.createElement(Box, {
                width: '.6rem!important',
                height: '.6rem!important',
                component: Check
              })
            )
          ),
          React.createElement(Box, { display: 'inline-block', marginRight: '.5rem' },
            React.createElement(IconButton, {
              className: 'bg-success',
              onClick: () => setRadios('bg-success')
            },
              radios === 'bg-success' && React.createElement(Box, {
                width: '.6rem!important',
                height: '.6rem!important',
                component: Check
              })
            )
          ),
          React.createElement(Box, { display: 'inline-block', marginRight: '.5rem' },
            React.createElement(IconButton, {
              color: 'default',
              className: 'bg-default',
              onClick: () => setRadios('bg-default')
            },
              radios === 'bg-default' && React.createElement(Box, {
                width: '.6rem!important',
                height: '.6rem!important',
                component: Check
              })
            )
          ),
          React.createElement(Box, { display: 'inline-block', marginRight: '.5rem' },
            React.createElement(IconButton, {
              color: 'primary',
              className: 'bg-primary',
              onClick: () => setRadios('bg-primary')
            },
              radios === 'bg-primary' && React.createElement(Box, {
                width: '.6rem!important',
                height: '.6rem!important',
                component: Check
              })
            )
          )
        )
      ),
      React.createElement(FormGroup, null,
        React.createElement(TextField, {
          placeholder: 'Event Description',
          label: 'Event Description',
          type: 'text',
          variant: 'outlined',
          multiline: true,
          rows: '4',
          value: eventDescription,
          onChange: (e) => setEventDescription(e.target.value)
        })
      )
    ),
    React.createElement(DialogActions, null,
      React.createElement(Box, { width: '100%', display: 'flex', justifyContent: 'space-around' },
        React.createElement(Box, null,
          isEditModal ? React.createElement(Button, {
            color: 'danger',
            variant: 'contained',
            onClick: () => editEvent(event)
          }, 'Edit') :
            React.createElement(Button, {
              color: 'primary',
              variant: 'contained',
              onClick: () => addNewEvent()
            }, 'Add')
        ),
        React.createElement(Button, { onClick: () => setEventModal(false), color: 'primary' }, 'Close')
      )
    )
  );
};
