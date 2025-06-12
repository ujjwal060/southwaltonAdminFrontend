import React from 'react'

const CalendarView = React.lazy(() => import('./Calendar/CalendarView'))
const AuthList = React.lazy(() => import('./AuthList'))
const UserManageList = React.lazy(() => import('./UserManageList'))
const VehicleManageList = React.lazy(() => import('./VehicleManageList'))
const NewVehicleManage = React.lazy(() => import('./NewVehicleManage'))
const BookManageList = React.lazy(() => import('./BookManageList'))
const TransacManageList = React.lazy(() => import('./TransacManageList'))
const ProductManageList = React.lazy(() => import('./ProductManageList'))
const StaticContentManageList = React.lazy(() => import('./StaticContentManageList'))
const DamageManage = React.lazy(() => import('./DamageManage'))
const OrderStatusTrack = React.lazy(() => import('./OrderStatusTrack'))
const DriverManageList = React.lazy(() => import('./DriverManageList'))
const TaskManageList = React.lazy(() => import('./TaskManageList'))
const Sign = React.lazy(() => import('./Sign'))
const Feedback = React.lazy(() => import('./Feedback'))
const Payment = React.lazy(() => import('./Payment'))
const Reservation = React.lazy(() => import('./Reservation'))
const Season = React.lazy(() => import('./Season'))
const CustDamageManage = React.lazy(() => import('./CustDamageManage'))

const routes = [
  // { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Calendar', element: CalendarView },
  { path: '/AuthList', name: 'AuthList', element: AuthList },
  { path: '/UserManageList', name: 'User Management', element: UserManageList },
  { path: '/VehicleManageList', name: 'Vehicle Management', element: VehicleManageList },
  { path: '/NewVehicleManage', name: 'Vehicle Management', element: NewVehicleManage },
  { path: '/BookManageList', name: 'Booking Management', element: BookManageList },
  { path: '/TransacManageList', name: 'Transaction Management', element: TransacManageList },
  { path: '/ProductManageList', name: 'Product Management', element: ProductManageList },
  { path: '/StaticContentManageList', name: 'Static Content Management', element: StaticContentManageList },
  { path: '/DamageManage', name: 'Damage Management', element: DamageManage },
  { path: '/OrderStatusTrack', name: 'Order Status Track', element: OrderStatusTrack },
  { path: '/DriverManageList', name: 'Driver Management', element: DriverManageList },
  { path: '/TaskManageList', name: 'Task Management', element: TaskManageList },
  { path: '/Sign', name: 'Sign Management', element: Sign },
  { path: '/Feedback', name: 'Feedback Management', element: Feedback },
  { path: '/Payment', name: 'Payment Management', element: Payment },
  { path: '/Reservation', name: 'Reservation Management', element: Reservation },
  { path: '/Season', name: 'Season Management', element: Season },
  { path: '/CustDamageManage', name: 'C. Damage Management', element: CustDamageManage },
 ]

export default routes
