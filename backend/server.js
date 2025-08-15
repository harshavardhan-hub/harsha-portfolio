import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import contactRoutes from './routes/contact.js'
import path from 'path'
import { fileURLToPath } from 'url'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Trust proxy (important for Render)
app.set('trust proxy', 1)

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:"],
    },
  },
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// CORS configuration - Updated for Render deployment
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
  process.env.FRONTEND_URL,
  // Add your Render frontend URL here when you get it
  // 'https://your-app-name.onrender.com'
].filter(Boolean) // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parser middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/harsha_portfolio'
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    // Don't exit in production, keep trying to reconnect
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1)
    }
  }
}

// Connect to database
connectDB()

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed.')
  process.exit(0)
})

// API Routes
app.use('/api/contact', contactRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  })
})

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Harsha Portfolio API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact'
    }
  })
})

// Serve static files from the React app build directory (only in production)
if (process.env.NODE_ENV === 'production') {
  // Serve static files
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  
  // Handle React routing - catch all handler
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return next()
    }
    
    // Serve React app for all non-API routes
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), (err) => {
      if (err) {
        console.error('Error serving index.html:', err)
        res.status(500).send('Error loading page')
      }
    })
  })
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `API endpoint ${req.path} not found` 
  })
})

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  
  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS: Origin not allowed'
    })
  }
  
  // Rate limit error
  if (err.status === 429) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later'
    })
  }
  
  res.status(err.status || 500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
})

export default app
