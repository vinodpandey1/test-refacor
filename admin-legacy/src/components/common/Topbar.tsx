import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout'
import colorConfigs from '../../configs/colorConfigs'
import sizeConfigs from '../../configs/sizeConfigs'
import { Cookies } from 'react-cookie'

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const boxRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (event: any) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('keydown', handleEscapeKey)

    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEscapeKey)
    }
  }, [])

  const handleToggleModal = () => {
    setIsOpen((prevOpen) => !prevOpen)
  }

  const handleLogout = (e) => {
    e.preventDefault()
    const postLogoutUri = window.location.origin
    const accessToken = localStorage.getItem('accessToken')
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = postLogoutUri
    return
  }

  const handleIconClick = () => {
    setIsOpen((prevOpen) => !prevOpen)
  }

  const handleGotoAdminBookings = () => {
    const url = process.env.GMS_ADMIN_URL + `/bookings`
    window.open(url, '_blank')
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: 'unset',
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold !important' }}>
          Property Admin Portal
        </Typography>
        <Box sx={{ position: 'relative', display: 'flex' }}>
          <Box sx={{ marginTop: '7px', cursor: 'pointer', fontWeight: 'bold' }}>
            <Typography
              variant="body1"
              sx={{
                color: 'rgb(25, 118, 210)',
                marginRight: '30px !important',
                textTransform: 'capitalize',
                fontWeight: 'bold !important',
              }}
              onClick={handleGotoAdminBookings}
            >
              Guest Admin
            </Typography>
          </Box>
          <IconButton color="inherit" onClick={handleIconClick}>
            <AccountCircleIcon />
          </IconButton>
          {isOpen && (
            <Box
              ref={boxRef}
              sx={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 200,
                bgcolor: 'background.paper',
                boxShadow: 1,
                p: 2,
              }}
            >
              {/* <Button variant="text" startIcon={<AccountCircleIcon />} onClick={handleLogout} sx={{ mb: 1 }}>
                Profile
              </Button> */}
              <Button variant="text" startIcon={<LogoutIcon />} onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar
