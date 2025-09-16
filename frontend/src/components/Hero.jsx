import React, { useState } from 'react'
import { FaMapMarkerAlt, FaLinkedin, FaGithub, FaInstagram, FaArrowRight, FaDownload, FaSpinner, FaCheck } from 'react-icons/fa'
import MorphingParticleBackground from './MorphingParticleBackground'

const Hero = () => {
  const [downloadState, setDownloadState] = useState('idle') // 'idle', 'downloading', 'downloaded'

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDownload = async () => {
    if (downloadState !== 'idle') return

    setDownloadState('downloading')
    
    try {
      // Create download link
      const link = document.createElement('a')
      link.href = '/Harsha Vardhan Yanakandla - PF Resume.pdf'
      link.download = 'Harsha_Vardhan_Yanakandla_Resume.pdf'
      
      // Simulate download time for better UX
      setTimeout(() => {
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Show downloaded state
        setDownloadState('downloaded')
        
        // Reset to idle after 3 seconds
        setTimeout(() => {
          setDownloadState('idle')
        }, 3000)
      }, 1500) // 1.5 second download simulation
      
    } catch (error) {
      console.error('Download failed:', error)
      setDownloadState('idle')
    }
  }

  const getDownloadButtonContent = () => {
    switch (downloadState) {
      case 'downloading':
        return (
          <>
            <FaSpinner size={14} className="flex-shrink-0 animate-spin" />
            <span className="transition-all duration-300">Downloading...</span>
          </>
        )
      case 'downloaded':
        return (
          <>
            <FaCheck size={14} className="flex-shrink-0 text-green-500 animate-bounce" />
            <span className="transition-all duration-300">Downloaded!</span>
          </>
        )
      default:
        return (
          <>
            <FaDownload size={14} className="flex-shrink-0" />
            <span className="transition-all duration-300">Download CV</span>
          </>
        )
    }
  }

  const getDownloadButtonClasses = () => {
    const baseClasses = "px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-3 w-full sm:w-auto min-w-[160px] sm:min-w-[180px] transition-all duration-500 transform"
    
    switch (downloadState) {
      case 'downloading':
        return `${baseClasses} bg-blue-50 border-2 border-blue-200 text-blue-700 cursor-wait scale-[0.98] shadow-inner`
      case 'downloaded':
        return `${baseClasses} bg-green-50 border-2 border-green-200 text-green-700 cursor-default scale-105 shadow-lg animate-pulse`
      default:
        return `${baseClasses} btn-secondary hover:scale-105 hover:shadow-lg active:scale-95`
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden hero-custom-bg">
      <MorphingParticleBackground />

      {/* Mobile Availability Status - Centered */}
      <div className="lg:hidden absolute top-6 left-1/2 transform -translate-x-1/2 z-20 animate-fade-in">
        <div className="mobile-status-card">
          <div className="flex items-center justify-center gap-2 mb-1 transition-all duration-300 hover:scale-105">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
            <span className="text-xs font-medium text-gray-700">Available for work</span>
          </div>
          <p className="text-xs text-gray-500 text-center transition-all duration-300 hover:text-gray-600">Open to new opportunities</p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 relative z-10">
        <div className="flex items-center justify-between min-h-screen py-16 sm:py-20">
          
          {/* Left Content - Main Hero Content */}
          <div className="flex-1 max-w-5xl space-y-6 sm:space-y-8 animate-fade-in-up">
            
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
              <div className="flex items-center gap-4 sm:gap-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                  <img
                    src="/harsha-photo.png"
                    alt="Harsha Vardhan Yanakandla"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-2 text-medium-gray">
                  <FaMapMarkerAlt className="text-charcoal flex-shrink-0" size={14} />
                  <span className="text-sm font-medium whitespace-nowrap">Anantapur, Andhra Pradesh, India</span>
                </div>
              </div>
            </div>
            
            {/* Main Content Section - Full Name */}
            <div className="w-full space-y-4 sm:space-y-6">
              <div className="text-left">
                <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-charcoal leading-tight tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                  Harsha Vardhan Yanakandla
                </h1>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-sans font-medium text-medium-gray mt-2 sm:mt-3 md:mt-4">
                  Full Stack Developer
                </h2>
              </div>
              
              {/* Description */}
              <div className="w-full max-w-2xl lg:max-w-3xl">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-medium-gray leading-relaxed">
                  I’m Harsha Vardhan Yanakandla, a Full Stack Developer who creates fast, scalable, and reliable web applications. I build with modern technologies like React, Node.js, 
                  and PostgreSQL, and enhance them with AI-powered features to deliver smarter solutions. I focus on writing clean, maintainable code, collaborating effectively with teams, 
                  and turning ideas into real products. My goal is to craft digital experiences that are user-friendly, high-performing, and impactful.
                </p>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full sm:w-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <button
                onClick={scrollToContact}
                className="btn-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base flex items-center justify-center gap-3 w-full sm:w-auto group min-w-[160px] sm:min-w-[180px]"
              >
                Get In Touch
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300 flex-shrink-0" />
              </button>
              
              <button
                onClick={handleDownload}
                disabled={downloadState === 'downloading'}
                className={getDownloadButtonClasses()}
              >
                {getDownloadButtonContent()}
              </button>
            </div>

            {/* Download Status Message */}
            {downloadState !== 'idle' && (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 text-sm">
                  {downloadState === 'downloading' && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <div className="w-4 h-1 bg-blue-200 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-blue-500 rounded-full animate-pulse"></div>
                      </div>
                      <span className="font-medium">Preparing to Download...</span>
                    </div>
                  )}
                  {downloadState === 'downloaded' && (
                    <div className="flex items-center gap-2 text-green-600 animate-fade-in">
                      <FaCheck size={12} className="animate-bounce" />
                      <span className="font-medium">Resume Downloaded Successfully!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Social Integration */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <span className="text-medium-gray text-sm font-medium">Follow:</span>
              <div className="flex items-center gap-3 sm:gap-4">
                <a 
                  href="https://www.linkedin.com/in/harsha-vardhan-yanakandla/" 
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-charcoal text-white rounded-full flex items-center justify-center smooth-transition hover:-translate-y-2 hover:shadow-lg flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                >
                  <FaLinkedin size={16} />
                </a>
                <a 
                  href="https://github.com/harshavardhan-hub" 
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-charcoal text-white rounded-full flex items-center justify-center smooth-transition hover:-translate-y-2 hover:shadow-lg flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                >
                  <FaGithub size={16} />
                </a>
                <a 
                  href="https://www.instagram.com/harsha_royal_117/" 
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-charcoal text-white rounded-full flex items-center justify-center smooth-transition hover:-translate-y-2 hover:shadow-lg flex-shrink-0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Profile"
                >
                  <FaInstagram size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Simple Availability Status (Desktop Only) */}
          <div className="hidden lg:flex flex-col justify-center items-center ml-8 xl:ml-12 relative h-full animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <div className="text-center">
              
              {/* Availability Status */}
              <div className="simple-status-card">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Available for work</span>
                </div>
                <p className="text-xs text-gray-500">Open to new opportunities</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
