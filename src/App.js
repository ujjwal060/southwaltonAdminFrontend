import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
// const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
const ForgotPassword = React.lazy(() => import('./views/pages/forgotpassword/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./views/pages/resetpassword/ResetPassword'));
const ForgotPasswordRequest = React.lazy(() => import('./views/pages/forgotpasswordrequest/ForgotPasswordRequest'));
const verifyOTP = React.lazy(() => import('./views/pages/verifyotp/verifyOTP'));
  
// Custom components
const AuthList = React.lazy(() => import('./AuthList'));
const UserManageList = React.lazy(() => import('./UserManageList'));
const VehicleManageList = React.lazy(() => import('./VehicleManageList'));
// const BookManageList = React.lazy(() => import('./BookManageList'));
const TransacManageList = React.lazy(() => import('./TransacManageList'));
const ProductManageList = React.lazy(() => import('./ProductManageList'));
const StaticContentManageList = React.lazy(() => import('./StaticContentManageList'));

const Header = React.lazy(() => import('./HeaderBar/Header'));
const CalendarView = React.lazy(() => import('./Calendar/CalendarView'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (isColorModeSet()) {
      return;
    }

    setColorMode(storedTheme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/forgot-password" name="Forgot Password Page" element={<ForgotPassword />} />
          <Route exact path="/reset-password/:token" name="Reset Password Page" element={<ResetPassword />} />
          <Route exact path="/forgot-password-request" name="Forgot Password Request Page" element={<ForgotPasswordRequest />} />
          <Route exact path="/verify-otp" name="verify OTP Page" element={<verifyOTP />} />     
          {/* <Route exact path="/register" name="Register Page" element={<Register />} /> */}
          <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} />
          <Route exact path="/auth-list" name="Auth List" element={<AuthList />} />
          <Route exact path="/usermanage-list" name="User Management" element={<UserManageList />} />
          <Route exact path="/vehiclemanage-list" name="Vehicle Management" element={<VehicleManageList />} />
          {/* <Route exact path="/bookmanage-list" name="BookManage List" element={<BookManageList />} />  */}
          <Route exact path="/transacmanage-list" name="Transaction Management" element={<TransacManageList />} />
          <Route exact path="/productmanage-list" name="Product Management" element={<ProductManageList />} />
          

          {/* <Route index element={<><Header /><CalendarView /></>} /> */}
          <Route exact path="/staticcontentmanage-list" name="Static Content Management" element={<StaticContentManageList />} /> {/* Add AuthList route */}
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
