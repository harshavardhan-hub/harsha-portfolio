import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER

let client = null

if (accountSid && authToken) {
  client = twilio(accountSid, authToken)
  console.log('✅ Twilio client initialized')
} else {
  console.warn('⚠️ Twilio credentials not found - WhatsApp notifications disabled')
}

export const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!client) {
      console.warn('Twilio client not configured. WhatsApp message not sent.')
      return { success: false, error: 'WhatsApp service not configured' }
    }

    // Format phone number for WhatsApp
    let formattedNumber = to.toString().replace(/\D/g, '')
    
    // Add country code for Indian numbers
    if (!formattedNumber.startsWith('91') && formattedNumber.length === 10) {
      formattedNumber = '91' + formattedNumber
    }
    
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+' + formattedNumber
    }

    const messageResponse = await client.messages.create({
      body: message,
      from: `whatsapp:${whatsappNumber}`,
      to: `whatsapp:${formattedNumber}`
    })

    console.log('✅ WhatsApp message sent:', messageResponse.sid)
    return { success: true, messageId: messageResponse.sid }

  } catch (error) {
    console.error('❌ WhatsApp Error:', error)
    return { success: false, error: error.message }
  }
}

export default { sendWhatsAppMessage }
