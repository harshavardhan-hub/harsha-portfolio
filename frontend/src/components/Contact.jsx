import React, { useState } from 'react'
import { FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaArrowRight, FaLinkedin } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { submitContact } from '../utils/api'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await submitContact(formData)
      
      if (response.success) {
        toast.success(`Thank you ${formData.name}! Your message has been sent successfully. I will get back to you soon!`, {
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        })
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Contact form error:', error)
    }

    setLoading(false)
  }

  const contactInfo = [
    {
      icon: <FaWhatsapp size={16} className="lg:hidden" />,
      iconLg: <FaWhatsapp size={20} className="hidden lg:block" />,
      title: 'WhatsApp',
      value: '+91 9441591443',
      link: 'https://wa.me/919441591443'
    },
    {
      icon: <FaEnvelope size={16} className="lg:hidden" />,
      iconLg: <FaEnvelope size={20} className="hidden lg:block" />,
      title: 'Email',
      value: 'yanakandlaharshavardhan@gmail.com',
      link: 'mailto:yanakandlaharshavardhan@gmail.com'
    },
    {
      icon: <FaMapMarkerAlt size={16} className="lg:hidden" />,
      iconLg: <FaMapMarkerAlt size={20} className="hidden lg:block" />,
      title: 'Location',
      value: 'Anantapur, Andhra Pradesh, India',
      link: '#'
    },
    {
      icon: <FaLinkedin size={16} className="lg:hidden" />,
      iconLg: <FaLinkedin size={20} className="hidden lg:block" />,
      title: 'LinkedIn',
      value: 'harsha-vardhan-yanakandla',
      link: 'https://www.linkedin.com/in/harsha-vardhan-yanakandla/'
    }
  ]

  return (
    <section id="contact" className="py-20 bg-pure-white relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-charcoal mb-6">
            Let's Work Together
          </h2>
          <p className="text-xl text-medium-gray max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? I'd love to hear about it.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Info - Left Side */}
          <div className="lg:col-span-5 animate-fade-in-up">
            {/* Mobile: 2x2 Grid, Desktop: Vertical Stack */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6 contact-info-grid">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.link}
                  className="contact-info-card flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3 lg:gap-4 p-4 lg:p-6 bg-white/80 backdrop-blur-sm rounded-xl lg:rounded-2xl border border-light-gray/50 card-hover group"
                  target={info.link.startsWith('http') ? '_blank' : '_self'}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                >
                  <div className="contact-icon w-10 h-10 lg:w-14 lg:h-14 bg-charcoal text-white rounded-lg lg:rounded-xl flex items-center justify-center group-hover:scale-110 smooth-transition flex-shrink-0">
                    {info.icon}
                    {info.iconLg}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-charcoal text-sm lg:text-lg contact-title">{info.title}</div>
                    <div className="text-medium-gray text-xs lg:text-sm contact-value break-words">{info.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-7 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-light-gray/50">

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-light-gray rounded-xl focus:border-charcoal smooth-transition"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-light-gray rounded-xl focus:border-charcoal smooth-transition"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-light-gray rounded-xl focus:border-charcoal smooth-transition"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-3">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white border-2 border-light-gray rounded-xl focus:border-charcoal smooth-transition"
                      placeholder="Project inquiry"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-charcoal mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white border-2 border-light-gray rounded-xl focus:border-charcoal smooth-transition resize-none"
                    placeholder="Tell me about your project requirements, timeline, and budget..."
                  ></textarea>
                </div>

                {/* Send Message Note */}
                <div className="mb-6 text-center">
                  <div className="mb-6 text-center">
                    <p className="text-sm text-medium-gray">
                      <FaWhatsapp className="text-green-600 text-lg inline mr-1" /> Your message will be sent directly to Harsha's WhatsApp with instant notification
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-4 md:px-8 py-3 md:py-4 rounded-full font-semibold text-sm md:text-lg flex items-center gap-2 md:gap-3 smooth-transition group disabled:opacity-50 w-full md:w-auto justify-center"
                >
                  <span className="block md:hidden">
                    {loading ? 'Sending...' : 'Send to Harsha'}
                  </span>
                  <span className="hidden md:block">
                    {loading ? 'Sending Direct Message...' : 'Send Direct Message to Harsha'}
                  </span>
                  {!loading && <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 text-sm md:text-base" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
