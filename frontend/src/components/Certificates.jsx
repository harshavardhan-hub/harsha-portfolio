import React, { useState, useEffect } from 'react'

const Certificates = () => {
  const [showAll, setShowAll] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const certificates = [
    'https://media-content.ccbp.in/certificates/share/IIYBIHSQAD.png',
    'https://media-content.ccbp.in/certificates/share/NQUYIYCZTR.png',
    'https://media-content.ccbp.in/certificates/share/EFZNPGPJYM.png',
    'https://media-content.ccbp.in/certificates/share/AUOMVYSKJS.png',
    'https://media-content.ccbp.in/certificates/share/DWLGKLFLZI.png',
    'https://media-content.ccbp.in/certificates/share/CCKZUQZLAL.png',
    'https://media-content.ccbp.in/certificates/share/NHYVZKECZO.png',
    'https://media-content.ccbp.in/certificates/share/GJYQQMZAVH.png'
  ]

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const section = document.getElementById('certificates')
    if (section) observer.observe(section)
    
    return () => observer.disconnect()
  }, [])

  const visibleCertificates = showAll ? certificates : certificates.slice(0, 3)

  const handleCertificateClick = (certUrl) => {
    window.open(certUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section 
      id="certificates" 
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-charcoal mb-6">
            Certifications
          </h2>
          <p className="text-lg sm:text-xl text-medium-gray max-w-2xl mx-auto">
            Professional certifications that showcase my commitment to continuous learning and excellence.
          </p>
        </div>

        {/* Desktop: Marquee Animation */}
        <div className="hidden lg:block">
          <div className="certificate-marquee-container">
            <div className="certificate-marquee">
              {/* First set */}
              {certificates.map((cert, index) => (
                <div 
                  key={`first-${index}`} 
                  className="certificate-item cursor-pointer"
                  onClick={() => handleCertificateClick(cert)}
                >
                  <img 
                    src={cert} 
                    alt={`Certificate ${index + 1}`}
                    className="certificate-image"
                    loading="lazy"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {certificates.map((cert, index) => (
                <div 
                  key={`second-${index}`} 
                  className="certificate-item cursor-pointer"
                  onClick={() => handleCertificateClick(cert)}
                >
                  <img 
                    src={cert} 
                    alt={`Certificate ${index + 1}`}
                    className="certificate-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Grid with Show More */}
        <div className="lg:hidden">
          <div className={`grid grid-cols-1 xs:grid-cols-2 gap-6 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
            {visibleCertificates.map((cert, index) => (
              <div 
                key={index} 
                className="certificate-card group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleCertificateClick(cert)}
              >
                <div className="certificate-image-wrapper">
                  <img 
                    src={cert} 
                    alt={`Certificate ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="certificate-overlay">
                    <div className="certificate-overlay-content">
                      <span className="text-white font-medium">View Certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {certificates.length > 3 && (
            <div className="text-center mt-12">
              <button
                onClick={() => setShowAll(!showAll)}
                className="btn-primary px-8 py-4 rounded-lg font-medium text-base hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                {showAll ? 'Show Less' : `View All ${certificates.length} Certificates`}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Certificates
