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

// API Routes FIRST (before static files)
app.use('/api/contact', require('./routes/contact'))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!', timestamp: new Date().toISOString() })
})

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const buildPath = path.join(__dirname, '../frontend/dist')
  console.log('Serving static files from:', buildPath)
  
  app.use(express.static(buildPath))
  
  // Catch all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    console.log('Serving index.html for route:', req.path)
    res.sendFile(path.join(buildPath, 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'API is running in development mode' })
  })
}

// Database connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err))
} else {
  console.warn('MONGODB_URI not provided, running without database')
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
