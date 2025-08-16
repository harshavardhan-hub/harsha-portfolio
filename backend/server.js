import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import dotenv from 'dotenv'
import contactRoutes from './routes/contact.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()

// SINGLE LINE - Trust Railway's proxy
app.set('trust proxy', 1)

const PORT = process.env.PORT || 10000

console.log('🚀 Starting server...')
console.log('🌐 Environment:', process.env.NODE_ENV || 'development')
console.log('📡 Port:', PORT)

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Request logging middleware (only log API requests to reduce noise)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  }
  next()
})

// Database connection with better error handling
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    maxPoolSize: 10, // Maintain up to 10 socket connections
  })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err))
} else {
  console.log('⚠️ MONGODB_URI not provided, running without database')
}

// API Routes
app.use('/api/contact', contactRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is running!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Serve React Static Files - Simplified logic
const buildPath = path.join(__dirname, '../frontend/dist')
console.log('📁 Static files path:', buildPath)

// Check if build directory exists
if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found')
  
  // Serve static files with better caching
  app.use(express.static(buildPath, {
    dotfiles: 'deny',
    index: false,
    redirect: false,
    maxAge: '1d' // Cache static assets for 1 day
  }))
  
  // Handle React Router - Catch all handler for non-API routes
  app.get('*', (req, res) => {
    try {
      const indexPath = path.join(buildPath, 'index.html')
      res.sendFile(indexPath)
    } catch (error) {
      console.error('Error serving index.html:', error)
      res.status(500).json({ 
        error: 'Unable to serve application',
        path: req.path
      })
    }
  })
} else {
  console.log('❌ Build directory not found at:', buildPath)
  
  // Fallback for missing build files
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'API endpoint not found' })
    } else {
      res.status(503).json({ 
        message: 'Application is starting up',
        note: 'Please refresh in a moment',
        path: req.path,
        availableEndpoints: ['/api/health', '/api/contact']
      })
    }
  })
}

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err)
  res.status(500).json({ 
    success: false,
    error: 'Internal server error'
  })
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err)
  process.exit(1)
})

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`)
})

// Set server timeout to handle slow requests
server.timeout = 30000 // 30 seconds

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully')
  server.close(() => {
    mongoose.connection.close(() => {
      console.log('📊 Database connection closed')
      process.exit(0)
    })
  })
})

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully')
  server.close(() => {
    mongoose.connection.close(() => {
      console.log('📊 Database connection closed')
      process.exit(0)
    })
  })
})
