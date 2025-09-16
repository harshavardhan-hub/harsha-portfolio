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
  timeout: 15000, // Increased timeout for slow wake-up
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

// Retry function with exponential backoff
const retryWithBackoff = async (fn, retries = 6, delay = 2000, onRetry = null) => {
  try {
    return await fn()
  } catch (error) {
    // Don't retry validation errors (4xx except 408, 429)
    if (error.response?.status >= 400 && error.response?.status < 500 && 
        error.response?.status !== 408 && error.response?.status !== 429) {
      throw error
    }

    if (retries > 0) {
      console.log(`Request failed, retrying in ${delay}ms... (${retries} retries left)`)
      
      // Call retry callback if provided
      if (onRetry) {
        onRetry(7 - retries, error) // Pass attempt number and error
      }
      
      // Wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Retry with increased delay (exponential backoff)
      return retryWithBackoff(fn, retries - 1, Math.min(delay * 1.5, 10000), onRetry)
    }
    
    throw error
  }
}

// Enhanced submit contact with retry and user feedback
export const submitContact = async (contactData, onRetry = null) => {
  const makeRequest = () => api.post('/contact', contactData)
  
  try {
    const response = await retryWithBackoff(makeRequest, 6, 2000, onRetry)
    return response.data
  } catch (error) {
    console.error('Contact submission failed after all retries:', error)
    
    // Provide user-friendly error messages
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('Server is taking too long to respond. Please try again later.')
    } else if (error.response?.status === 503 || error.response?.status === 502) {
      throw new Error('Server is temporarily unavailable. Please try again in a few moments.')
    } else if (error.response?.status >= 500) {
      throw new Error('Server error occurred. Please try again later.')
    } else if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.')
    } else {
      throw new Error('Failed to send message. Please try again later.')
    }
  }
}

export default api
