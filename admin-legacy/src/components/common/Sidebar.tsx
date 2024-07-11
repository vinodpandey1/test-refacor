import React from 'react'
import { Avatar, Drawer, List, Stack, Toolbar } from '@mui/material'
import assets from '../../assets'
import colorConfigs from '../../configs/colorConfigs'
import sizeConfigs from '../../configs/sizeConfigs'
import appRoutes from '../../routes/appRoutes'
import SidebarItem from './SidebarItem'
import SidebarItemCollapse from './SidebarItemCollapse'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const navigate = useNavigate()
  const goToPropertyPage = () => {
    navigate(`/properties`)
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sizeConfigs.sidebar.width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: sizeConfigs.sidebar.width,
          boxSizing: 'border-box',
          borderRight: '0px',
          backgroundColor: colorConfigs.sidebar.bg,
          color: colorConfigs.sidebar.color,
        },
      }}
    >
      <List disablePadding>
        <Toolbar sx={{ marginBottom: '20px' }}>
          <Stack sx={{ width: '100%', marginTop: '20px' }} direction="row" justifyContent="center">
            <img src={assets.images.logo1} style={{ maxWidth: '80%', height: 'auto' }} onClick={goToPropertyPage} />
          </Stack>
        </Toolbar>
        {appRoutes.map((route, index) =>
          route.sidebarProps ? (
            route.child ? (
              <SidebarItemCollapse item={route} key={index} />
            ) : (
              <SidebarItem item={route} key={index} />
            )
          ) : null
        )}
      </List>
    </Drawer>
  )
}

export default Sidebar
