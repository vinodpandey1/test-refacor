import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, { useEffect, useState } from 'react'
import {  useSelector } from 'react-redux'
import { getLoginRedirectUri } from './oAuth2-helper'
import { Loader } from '../../components/Loader'


const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          marginTop: '30px',
          color: '#000',
          '&:hover': {
            backgroundColor: '#f8f8f8',
          },
        },
      },
    },
  },
})

export default function Login() {
  const authList = useSelector((state: any) => state.auth.auth?.success)
  const loading = useSelector((state: any) => state?.loader.loader)


  useEffect(() => {
    if (authList === true) {
      window.location.reload()
    }
  }, [authList])

  useEffect(() => {
    const next = '/'
    const uri = getLoginRedirectUri(next)
    console.log('redirecting:', uri)
    window.location.href = uri;
  })

  return (
    <>
      <ThemeProvider theme={theme}>
        <Loader loading={loading} />
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
          </Box>
        </Container>
      </ThemeProvider>
    </>
  )
}
