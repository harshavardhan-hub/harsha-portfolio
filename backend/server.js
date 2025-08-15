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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Database connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

// Serve React Static Files
const buildPath = path.join(__dirname, '../frontend/dist')
console.log('📁 Static files path:', buildPath)

// Check if build directory exists
if (fs.existsSync(buildPath)) {
  console.log('✅ Build directory found')
  
  // Serve static files
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
      res.status(404).json({ 
        error: 'Frontend files not found',
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
      res.status(200).json({ 
        message: 'API is running - Frontend build files not found',
        note: 'Deploy frontend files to enable full app',
        path: req.path,
        availableEndpoints: ['/api/health', '/api/contact']
      })
    }
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err)
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: err.message
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully')
  mongoose.connection.close(() => {
    console.log('📊 Database connection closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully')
  mongoose.connection.close(() => {
    console.log('📊 Database connection closed')
    process.exit(0)
  })
})
