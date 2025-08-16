import axios from 'axios'

// Support both new VITE_BACKEND_URL and legacy VITE_API_URL
const getApiBaseUrl = () => {
  // Priority 1: New VITE_BACKEND_URL (full backend URL)
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL
  }
  
  // Priority 2: Legacy VITE_API_URL (API endpoint)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Priority 3: Default fallback
  return import.meta.env.PROD ? '/api' : 'http://localhost:10000/api'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data)
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const submitContact = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData)
    return response.data
  } catch (error) {
    console.error('Contact submission error:', error)
    throw error
  }
}

export default api
