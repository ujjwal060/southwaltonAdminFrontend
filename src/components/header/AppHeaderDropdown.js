import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import '@fortawesome/fontawesome-free/css/all.min.css'

const AppHeaderDropdown = () => {
  const navigateTo = useNavigate();

  const handleLogout = () => {
    navigateTo('/Login')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle 
        placement="bottom-end" 
        className="py-0 pe-0 d-flex align-items-center justify-content-center" 
        caret={false} 
        style={{ width: '40px', height: '40px', paddingTop: '5px' }}
      >
        <i className="fa-solid fa-user" style={{ color: '#58afbb', fontSize: '24px', display: 'flex',
    flexDirection: 'row',
    paddingLeft: 0,
    paddingTop: '10px',
    marginBottom: 0,
    listStyle: 'none',
    alignItems: 'center' }}></i>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
