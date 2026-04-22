import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v3',
  timeout: 15000,
})

// Request interceptor: attach Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: normalize errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default api
