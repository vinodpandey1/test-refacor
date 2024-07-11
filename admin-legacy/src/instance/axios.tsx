import axios from 'axios'
import process from 'process'

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_ADMIN_GATEWAY_URL}/gateways/pms`,
})
const demoInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
})

const refreshToken = localStorage.getItem('refreshToken')
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
  try {
    const response = await instance.post('/api/auth/refreshToken', {
      refresh_token: refreshToken,
    })

    const newAccessToken = response.data.access_token
    // Update the access token in the cookies
    localStorage.setItem('accessToken', newAccessToken)
    // Call all the subscribers with the new access token
    refreshSubscribers.forEach((subscriber) => subscriber(newAccessToken))
    // Clear the subscribers array
    refreshSubscribers = []
  } catch (error) {
    // Handle the token refresh error
    console.log('Token refresh failed:', error)
  } finally {
    isRefreshing = false
  }
}

// Add request interceptor to attach the access token to requests
instance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

demoInstance.interceptors.request.use((config) => {
  // Modify the config for the demo instance if needed
  return config
})

// Add response interceptor to handle token expiration and refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const statusCode = error.response?.status

    if (statusCode === 401 && !originalRequest._retry && !isRefreshing) {
      originalRequest._retry = true
      isRefreshing = true

      // Create a promise that will resolve once the token is refreshed
      const retryOriginalRequest = new Promise<string>((resolve) => {
        // Add the subscriber to the refreshSubscribers array
        refreshSubscribers.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(instance(originalRequest))
        })
      })

      // Refresh the access token
      await refreshAccessToken()

      // Return the retryOriginalRequest promise
      return retryOriginalRequest
    }

    // Handle other errors
    return Promise.reject(error)
  }
)

export { instance, demoInstance }
