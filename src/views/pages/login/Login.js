import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Login = () => {
  const navigateTo = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://52.20.55.193:8132/api/auth/login', {
        email,
        password,
      });
      setMessage(response.data.message);
      if (response.status === 200) {
        navigateTo('/dashboard');
      }
    } catch (error) {
      setMessage('Login failed');
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <style>
        {`
          .login-card {
            width: 100%;
            max-width: 450px; /* Adjust this value to change the card width */
            margin: auto;
          }

          .text-primary {
            color: #007bff;
          }

          .text-muted {
            color: #6c757d;
          }

          .text-danger {
            color: #dc3545;
          }

          .bg-body-tertiary {
            background-color: #f8f9fa;
          }
        `}
      </style>
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCardGroup>
              <CCard className="p-4 login-card">
                <CCardBody>
                  <CForm>
                    <h1 className="text-primary">Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="success" variant="outline" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <Link to="/forgot-password-request">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </Link>
                      </CCol> */}
                    </CRow>
                    {message && <p className="text-danger mt-3">{message}</p>}
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
