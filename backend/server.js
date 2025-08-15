const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 10000

console.log('🚀 Starting server...')
console.log('🌐 Environment:', process.env.NODE_ENV || 'development')
console.log('📡 Port:', PORT)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// API Routes - Define BEFORE static files
app.post('/api/contact', async (req, res) => {
  try {
    console.log('📧 Contact form submission:', req.body)
    
    // Simple success response for now
    res.status(200).json({ 
      success: true, 
      message: 'Message received successfully!' 
    })
  } catch (error) {
    console.error('❌ Contact error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message' 
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  })
})

// Serve React Static Files
const buildPath = path.join(__dirname, '../frontend/dist')
console.log('📁 Static files path:', buildPath)

// Check if build directory exists
const fs = require('fs')
if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found')
  console.log('📄 Files in build:', fs.readdirSync(buildPath))
} else {
  console.log('❌ Build directory not found at:', buildPath)
}

// Always serve static files (regardless of NODE_ENV)
app.use(express.static(buildPath, {
  dotfiles: 'deny',
  index: false,
  redirect: false
}))

// Handle React Router - Catch all handler for non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(buildPath, 'index.html')
  
  if (fs.existsSync(indexPath)) {
    console.log('📄 Serving index.html for route:', req.path)
    res.sendFile(indexPath)
  } else {
    console.log('❌ index.html not found, serving development message')
    res.status(200).json({ 
      message: 'API is running in development mode',
      note: 'Frontend build files not found',
      path: req.path
    })
  }
})

// Database connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err))
} else {
  console.log('⚠️ MONGODB_URI not provided, running without database')
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully')
  process.exit(0)
})
