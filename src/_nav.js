import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faTruck ,faCar, faMoneyBill ,faEnvelopeOpen  , faSignature , faVectorSquare ,faListCheck, faIdCard , faSquareCheck ,faBars, faCircleExclamation  } from '@fortawesome/free-solid-svg-icons'


const _nav = [

  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <FontAwesomeIcon icon={faVectorSquare} style={{ color: '#74C0FC', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
    badge: {
      color: 'info',
    
    },
  },

  {
    component: CNavItem,
    name: 'User Management',
    to: '/UserManageList',
    icon: <FontAwesomeIcon icon={faUser} style={{ color: '#B197FC', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },

  {
    component: CNavItem,
  name: 'Driver Management',
  to: '/DriverManageList',
  icon: <FontAwesomeIcon icon={faIdCard} style={{ color: '#f8ff94' , fontSize: '1.5rem', marginRight: '0.5rem'}} />,
  badge: {
    color: 'info',
    },
  },

  // {
  //   component: CNavItem,
  //   name: 'Season Management',
  //   to: '/Season',
  //   icon: <FontAwesomeIcon icon={faCar} style={{ color: '#9b8799', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
  //   badge: {
  //     color: 'info',
  //   },
  // },

  // {
  //   component: CNavItem,
  //   name: 'Vehicle Management',
  //   to: '/VehicleManageList',
  //   icon: <FontAwesomeIcon icon={faCar} style={{ color: '#9b8799', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
  //   badge: {
  //     color: 'info',
  //   },
  // },

  {
    component: CNavItem,
    name: 'Reservation Management',
    to: '/Reservation',
    icon: <FontAwesomeIcon icon={faSquareCheck} style={{ color: '#4ce637' , fontSize: '1.5rem', marginRight: '0.5rem' }} />,
    badge: {
      color: 'info',
    },
  },

  {
    component: CNavItem,
    name: 'Booking Management',
    to: '/BookManageList',
    icon: <FontAwesomeIcon icon={faSquareCheck} style={{ color: '#4ce637' , fontSize: '1.5rem', marginRight: '0.5rem' }} />,
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavItem,
    name: 'Vehicle Management',
    to: '/NewVehicleManage',
    icon: <FontAwesomeIcon icon={faCar} style={{ color: '#9b8799', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
    badge: {
      color: 'info',
       text: 'NEW',
    },
  },

  // {
  //   component: CNavItem,
  // name: 'Task Management',
  // to: '/TaskManageList',
  // icon: <FontAwesomeIcon icon={faListCheck} style={{ color: '#ff99f7' , fontSize: '1.5rem', marginRight: '0.5rem'}} />,
  // badge: {
  //   color: 'info',
  //     // text: 'NEW',
  //   },
  // },

  {
    component: CNavItem,
    name: 'Payment Management',
    to: '/Payment',
    icon: <FontAwesomeIcon icon={faMoneyBill} style={{ color: '#db8251', fontSize: '1.5rem', marginRight: '0.5rem' }} />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },

  {
    component: CNavItem,
    name: 'Damage Management',
    to: '/DamageManage',
    icon: <FontAwesomeIcon icon={faCircleExclamation} style={{ color: '#eaf457', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },

  {
    component: CNavItem,
    name: 'C. Damage Management',
    to: '/CustDamageManage',
    icon: <FontAwesomeIcon icon={faCircleExclamation} style={{ color: '#eaf457', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
    badge: {
      color: 'info',
      // text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Sign Management',
    to: '/Sign',
    icon: <FontAwesomeIcon icon={faSignature} style={{ color: '#cb575d', fontSize: '1.5rem', marginRight: '0.5rem' }} />, // Use the signature icon
    badge: {
      color: 'info',
    },
  },
  // {
  //   component: CNavItem,
  // name: 'Order Status Track',
  // to: '/OrderStatusTrack',
  // icon: <FontAwesomeIcon icon={faTruck} style={{ color: '#f73636', fontSize: '1.5rem', marginRight: '0.5rem' }} />,
  // badge: {
  //   color: 'info',
  //     // text: 'NEW',
  //   },
  // },

  {
    component: CNavItem,
    name: 'Feedback Management',
    to: '/Feedback',
    icon: <FontAwesomeIcon icon={faEnvelopeOpen } style={{ color: '#ffadad', fontSize: '1.5rem', marginRight: '0.5rem' }} />, // Message pen icon
    badge: {
      color: 'info'
      // text: 'NEW',
    },
  },





  // {
  //   component: CNavItem,
  //   name: 'Static Content Management',
  //   to: '/StaticContentManageList',
  //   icon: <FontAwesomeIcon icon={faBars} style={{color: "#54c9ac", fontSize: '1.5rem', marginRight: '0.5rem'}} />,
  //   badge: {
  //     color: 'info',
  //     // text: 'NEW',
  //   },
  // },

  

  // {
  //   component: CNavItem,
  //   name: 'UserManage',
  //   to: '/UserManage',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavItem,
  //   name: 'VehicleManage',
  //   to: '/VehicleManage',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  

 
 
  // {
  //   component: CNavItem,
  //   name: 'TransacManage',
  //   to: '/TransacManage',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavItem,
  //   name: 'ProductManage',
  //   to: '/ProductManage',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavItem,
  //   name: 'StaticContentManage',
  //   to: '/StaticContentManage',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },

  // {
  //   component: CNavItem,
  //   name: 'AuthList',
  //   to: '/AuthList',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },

  
//  { component: CNavGroup,
//     name: 'Order',
//     to: '/Order',
//     CIcon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
//     items: [

//   {
//     component: CNavItem,
//     name: 'Book Orders',
//     to: '/Order/BookOrder',
//     icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
// },
// {
//     component: CNavItem,
//     name: 'Product Orders',
//     to: '/Order/ProductOrder',
//     icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
// },
//     ]
//   },

  

 

 

 



  // {
  //   component: CNavItem,
  //   name: 'Transaction Management',
  //   to: '/TransacManageList',
  //   icon: <FontAwesomeIcon icon={faMoneyCheckDollar} style={{ color: 'brown', fontSize: '1.5rem', marginRight: '0.5rem' }} />,
  //   badge: {
  //     color: 'info',
  //     // text: 'NEW',
  //   },
  // },

  // {
  //   component: CNavItem,
  //   name: 'Product Management',
  //   to: '/ProductManageList',
  //   icon: <FontAwesomeIcon icon={faCartShopping} style={{ color: '#2ebf2b', fontSize: '1.5rem', marginRight: '0.5rem'}} />,
  //   badge: {
  //     color: 'info',
  //     // text: 'NEW',
  //   },
  // },


  

  // {
  //   component: CNavItem,
  //   name: 'BookManageList',
  //   to: '/BookManageList',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     // text: 'NEW',
  //   },
  // },

  // {
  //   component: CNavTitle,
  //   name: 'Theme',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Colors',
  //   to: '/theme/colors',
  //   icon: <CIcon icon={cilDrop} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Typography',
  //   to: '/theme/typography',
  //   icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Components',
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Base',
  //   to: '/base',
  //   icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Accordion',
  //       to: '/base/accordion',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Breadcrumb',
  //       to: '/base/breadcrumbs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Cards',
  //       to: '/base/cards',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Carousel',
  //       to: '/base/carousels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Collapse',
  //       to: '/base/collapses',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'List group',
  //       to: '/base/list-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Navs & Tabs',
  //       to: '/base/navs',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Pagination',
  //       to: '/base/paginations',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Placeholders',
  //       to: '/base/placeholders',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Popovers',
  //       to: '/base/popovers',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Progress',
  //       to: '/base/progress',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Spinners',
  //       to: '/base/spinners',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tables',
  //       to: '/base/tables',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Tooltips',
  //       to: '/base/tooltips',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Buttons',
  //   to: '/buttons',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Buttons',
  //       to: '/buttons/buttons',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Buttons groups',
  //       to: '/buttons/button-groups',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Dropdowns',
  //       to: '/buttons/dropdowns',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Forms',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Form Control',
  //       to: '/forms/form-control',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Select',
  //       to: '/forms/select',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Checks & Radios',
  //       to: '/forms/checks-radios',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Range',
  //       to: '/forms/range',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Input Group',
  //       to: '/forms/input-group',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Floating Labels',
  //       to: '/forms/floating-labels',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Layout',
  //       to: '/forms/layout',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Validation',
  //       to: '/forms/validation',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Charts',
  //   to: '/charts',
  //   icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  // {
  //   component: CNavGroup,
  //   name: 'Notifications',
  //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Alerts',
  //       to: '/notifications/alerts',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Badges',
  //       to: '/notifications/badges',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Modal',
  //       to: '/notifications/modals',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Toasts',
  //       to: '/notifications/toasts',
  //     },
  //   ],
  // },
  // {
  //   component: CNavItem,
  //   name: 'Widgets',
  //   to: '/widgets',
  //   icon: <CIcon icon={cilCalculator} customClassName="nav-icon" />,
  //   badge: {
  //     color: 'info',
  //     text: 'NEW',
  //   },
  // },
  // {
  //   component: CNavTitle,
  //   name: 'Extras',
  // },
  
  // {
  //   component: CNavGroup,
  //   name: 'Pages',
  //   icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Login',
  //       to: '/login',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Register',
  //       to: '/register',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 404',
  //       to: '/404',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Error 500',
  //       to: '/500',
  //     },
  //   ],
  // },

  // {
  //   component: CNavItem,
  //   name: 'Docs',
  //   href: 'https://coreui.io/react/docs/templates/installation/',
  //   icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  // },

]

export default _nav
