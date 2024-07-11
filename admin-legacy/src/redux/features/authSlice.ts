import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { instance } from '../../instance/axios'
import { toast, ToastContainer } from 'react-toastify';
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { showLoadingImage } from './loaderSlice'

interface CustomerInterfaceData {
  auth: {
    success: boolean | any
    accessToken: string | null
  }
}

interface LoginData {
  username: string
  password: string
}

interface mobileData {
  phoneNumber: string
}

interface optData {
  otp: string
  phoneNumber: mobileData
}

const initialState: CustomerInterfaceData = {
  auth: {
    success: false,
    accessToken: null,
  },
}

export const login = createAsyncThunk('login', async (loginData: LoginData, thunkApi) => {
  const { dispatch } = thunkApi

  try {
    dispatch(showLoadingImage(true))
    const { data } = await instance({
      method: 'POST',
      url: `api/auth/authenticate`,
      data: loginData,
    })
    const accessToken = data.access_token
    const refreshToken = data.refresh_token
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      //   NotificationManager.success('Customer Prospect Successfully')
      dispatch(showLoadingImage(false))
      return { success: true, accessToken } // Return the token along with success flag
    } else {
      dispatch(showLoadingImage(false))
      return { success: false, accessToken: null }
    }
  } catch (err) {
    setTimeout(() => {
      dispatch(showLoadingImage(false))
    },7000)
    return { success: false, accessToken: null }
  }
})

export const loginWithMobile = createAsyncThunk('mobile-login', async (mobileData: mobileData, thunkApi) => {
  try {
    const { data } = await instance({
      method: 'POST',
      url: `gtw/auth/generateOtp`,
      data: mobileData,
    })
    return data
  } catch (err) {
    return { err }
  }
})

// export const loginWithOtp = createAsyncThunk('otp-login', async (optData: optData, thunkApi) => {
//   try {
//     const { data } = await instance({
//       method: 'POST',
//       url: `gtw/auth/validateOtp`,
//       data: optData,
//     })
//     const accessToken = data.accessToken
//     const refreshToken = data.refreshToken
//     if (accessToken) {
//       const cookies = new Cookies()
//       cookies.set('accessToken', accessToken, { path: '/', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
//       cookies.set('refreshToken', refreshToken, { path: '/', expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
//       //   NotificationManager.success('Customer Prospect Successfully')

//       return { success: true, accessToken } // Return the token along with success flag
//     } else {
//       return { success: false, accessToken: null }
//     }
//   } catch (err) {
//     return { success: false, accessToken: null }
//   }
// })

const authSlice = createSlice({
  name: 'Auth Reducer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(login.fulfilled, (state, action) => {
      // Set the state to true and update the token
      state.auth = action.payload
    })
  },
})

export default authSlice.reducer
