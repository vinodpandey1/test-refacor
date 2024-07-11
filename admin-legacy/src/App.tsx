import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import MainLayout from './components/layout/MainLayout'
import { routes } from './routes'
import Login from './pages/login/Login'
import ForgotPassword from './pages/forgotPassword/ForgotPassword'
import ResetPassword from './pages/resetpwd'
import LoginCallback from './pages/login/LoginCallbackPage'
import { OpenAPI} from "./admin-sdk/pms";
console.log('process.env.REACT_APP_ADMIN_GATEWAY_URL: ', process.env.REACT_APP_ADMIN_GATEWAY_URL)
OpenAPI.BASE = process.env.REACT_APP_ADMIN_GATEWAY_URL
function App() {
  const isAuthenticated = localStorage.getItem('accessToken') ? true : false

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/forgot" element={isAuthenticated ? <Navigate to="/" /> : <ForgotPassword />} />
        <Route path="/resetPwd" element={<ResetPassword />} />
        <Route path="/" element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
          {routes}
        </Route>
        <Route path="/login/callback" element={<LoginCallback />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
