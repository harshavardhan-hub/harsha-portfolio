const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}))
app.use(express.json())

// Simple contact route for now
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Contact form submission:', req.body)
    res.json({ success: true, message: 'Message received!' })
  } catch (error) {
    console.error('Contact error:', error)
    res.status(500).json({ success: false, error: 'Failed to send message' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() })
})

// Serve static files
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../frontend/dist')
  console.log('Serving static files from:', buildPath)
  
  app.use(express.static(buildPath))
  
  app.get('*', (req, res) => {
    console.log('Serving index.html for route:', req.path)
    res.sendFile(path.join(buildPath, 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'API is running in development mode' })
  })
}

// Database connection (optional for now)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err))
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
