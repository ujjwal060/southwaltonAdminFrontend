// Get today's date
var today = new Date();
var y = today.getFullYear(); // Current year
var m = today.getMonth();   // Current month (0-indexed)
var d = today.getDate();    // Current day of the month



// Define an array of events
export const eventsArray = [
  {
    title: "Test",
    start: "2021-05-02",
    end: "2021-05-04",
    className: "bg-default",
    id: 15
  },
  {
    id: 1,
    title: "Call with Dave",
    start: new Date(y, m, 1), // 1st day of the current month
    allDay: true,
    className: "bg-red",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 2,
    title: "Lunch meeting",
    start: new Date(y, m, d - 1, 10, 30), // 1 day before today at 10:30 AM
    allDay: true,
    className: "bg-orange",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 3,
    title: "All day conference",
    start: new Date(y, m, d + 7, 12, 0), // 7 days from today at 12:00 PM
    allDay: true,
    className: "bg-green",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 4,
    title: "Meeting with Mary",
    start: new Date(y, m, d - 2), // 2 days before today
    allDay: true,
    className: "bg-blue",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 5,
    title: "Winter Hackaton",
    start: new Date(y, m, d + 1, 19, 0), // 1 day from today at 7:00 PM
    allDay: true,
    className: "bg-red",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 6,
    title: "Digital event",
    start: new Date(y, m, 11), // 11th day of the current month
    allDay: true,
    className: "bg-warning",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },

  {
    id: 7,
    title: "Marketing event",
    start: new Date(y, m, 21), // 21st day of the current month
    allDay: true,
    className: "bg-purple",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 8,
    title: "Dinner with Family",
    start: new Date(y, m, 19), // 19th day of the current month
    allDay: true,
    className: "bg-red",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 9,
    title: "Black Friday",
    start: new Date(y, m, 23), // 23rd day of the current month
    allDay: true,
    className: "bg-blue",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  },
  {
    id: 10,
    title: "Cyber Week",
    start: new Date(y, m, 2), // 2nd day of the current month
    allDay: true,
    className: "bg-yellow",
    description:
      "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
  }
];
