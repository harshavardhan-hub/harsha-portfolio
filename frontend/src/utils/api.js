import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  import.meta.env.PROD 
    ? '/api'  // Production: same domain
    : 'http://localhost:5000/api'  // Development: backend server

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

export const submitContact = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData)
    return response.data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export default api
