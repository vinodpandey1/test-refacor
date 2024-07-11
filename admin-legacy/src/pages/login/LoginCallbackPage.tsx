import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  options,
} from './oAuth2-helper'
// ** React Imports

// ** MUI Components
import Box from '@mui/material/Box'

import {AuthAPI, } from "../../admin-sdk/pms";
import {getLoggedInUser} from "./_requests";

const LoginPage = () => {
  console.log('Login page')
  const location = useLocation()
    const navigate = useNavigate()

  // console.log('query 0000000', location.get('code'))
  useEffect(() => {
    // console.log('useEffect()', {code: query.code})
    // const redirectUrl = localStorage.getItem('redirectUrl')
      const queryParams = new URLSearchParams(location.search);
      const code = queryParams.get('code');
      const state = queryParams.get('state') || '/';


    console.log('L31', {code})
    const data: any = {
      client_id: options.clientId as string,
      redirect_uri: options.redirectUri as string,
      code: code as string,
      grant_type: 'authorization_code',
    }

    console.log('L39 request:', data)

    if (data.code) {
      AuthAPI.authenticate(data)
          .then((response: any) => {
            console.log('authenticate() success:', response)
            localStorage.setItem('accessToken', response.access_token)
            localStorage.setItem('refreshToken', response.refresh_token)

            getLoggedInUser()
                .then((user: any) => {
                  console.log('getLoggedInUser() success', user)
                  localStorage.user = JSON.stringify(user)
                  console.log('data', data)
                  return navigate(state, { replace: true })
                })
          })
          .catch((err: any) => console.error('L54',err))
    }
  })

  return (
      <Box className='content-right' sx={{backgroundColor: 'background.paper'}}>
        SSO Login Callback
      </Box>
  )
}

export default LoginPage

