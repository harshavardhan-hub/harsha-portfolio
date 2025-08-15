import express from 'express'
import Contact from '../models/Contact.js'
import { sendWhatsAppMessage } from '../services/whatsapp.js'
import rateLimit from 'express-rate-limit'

const router = express.Router()

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 contact form submissions per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again later.'
  }
})

// Submit contact form
router.post('/', contactLimiter, async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      })
    }

    // Create contact entry
    const contactData = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

    const savedContact = await contactData.save()

    // Send notification to Harsha only
    try {
      await sendWhatsAppMessage(
        process.env.HARSHA_WHATSAPP_NUMBER,
        `🔔 New Contact Form Submission

👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone || 'Not provided'}
📋 Subject: ${subject}

💬 Message:
${message}

🕐 Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

---
Reply directly to: ${email}`
      )
      console.log('✅ Notification sent to Harsha')
    } catch (whatsappError) {
      console.error('❌ WhatsApp notification failed:', whatsappError)
      // Continue even if WhatsApp fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      contactId: savedContact._id
    })

  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    })
  }
})

// Get all contact entries (for admin)
router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    
    const filter = status ? { status } : {}
    
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')

    const total = await Contact.countDocuments(filter)

    res.json({
      success: true,
      data: {
        contacts,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalContacts: total
      }
    })
  } catch (error) {
    console.error('Get contacts error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    })
  }
})

// Get single contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).select('-__v')
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.json({
      success: true,
      data: contact
    })
  } catch (error) {
    console.error('Get contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact'
    })
  }
})

// Update contact status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      })
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      })
    }

    res.json({
      success: true,
      data: contact
    })
  } catch (error) {
    console.error('Update contact error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update contact'
    })
  }
})

export default router
