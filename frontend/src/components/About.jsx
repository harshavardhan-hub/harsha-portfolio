import React from 'react'

const About = () => {
  return (
    <section id="about" className="py-20 bg-pure-white relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gray-50 to-transparent rounded-full opacity-30 -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-gray-100 to-transparent rounded-full opacity-20 translate-y-20 -translate-x-20"></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-8 leading-tight">
              About Me
            </h2>
            <div className="space-y-6 text-medium-gray leading-relaxed">
              <p className="text-base lg:text-lg">
                I have gained hands-on experience from a <strong>paid internship at Raizzify </strong> 
                and an internship at <strong>FlashFire Private Limited</strong>, where I worked on 
                real-world full-stack projects that focused on innovation, scalability, and solving 
                practical challenges.
              </p>
              <p className="text-base lg:text-lg">
                During these experiences, I contributed to building complete web applications, integrated 
                AI-powered features to enhance functionality, and collaborated closely with teams to deliver 
                reliable and high-performing solutions that meet real business needs.
              </p>
              <p className="text-base lg:text-lg">
                My passion lies in transforming ideas into impactful digital products that deliver value 
                to both users and businesses. Whether developing from the ground up or improving existing 
                systems, I approach every project with curiosity, creativity, and a results-driven mindset.
              </p>

            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="w-16 h-1 bg-charcoal rounded-full"></div>
              <span className="text-sm text-medium-gray font-medium italic">Building the future, one line at a time</span>
            </div>
          </div>

          {/* Right Content - Education Journey */}
          <div className="animate-fade-in-up lg:animate-fade-in-right" style={{animationDelay: '0.2s'}}>
            <div className="relative">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-light-gray/30 card-hover shadow-lg">
                <div className="space-y-8">
                  <h3 className="text-xl font-semibold text-charcoal mb-8 text-center">Education Journey</h3>

                  <div className="space-y-8">
                    {/* University */}
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1 w-3 h-3 bg-charcoal rounded-full"></div>
                      <div className="absolute left-1.5 top-4 w-px h-full bg-gradient-to-b from-charcoal/30 to-transparent"></div>
                      <div>
                        <h4 className="font-semibold text-charcoal text-base mb-1">
                          Jawaharlal Nehru Technological University Anantapur
                        </h4>
                        <p className="text-sm text-medium-gray font-medium mb-1">Bachelor of Technology, Electronics & Communication Engineering</p>
                        <span className="text-xs text-medium-gray italic">2022 - 2026</span>
                      </div>
                    </div>

                    {/* Junior College */}
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1 w-3 h-3 bg-charcoal/70 rounded-full"></div>
                      <div className="absolute left-1.5 top-4 w-px h-full bg-gradient-to-b from-charcoal/20 to-transparent"></div>
                      <div>
                        <h4 className="font-semibold text-charcoal text-base mb-1">Narayana Junior College</h4>
                        <p className="text-sm text-medium-gray font-medium mb-1">Intermediate, MPC</p>
                        <span className="text-xs text-medium-gray italic">2020 - 2022</span>
                      </div>
                    </div>

                    {/* School */}
                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1 w-3 h-3 bg-charcoal/50 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-charcoal text-base mb-1">Sri Chaithanya School</h4>
                        <p className="text-sm text-medium-gray font-medium mb-1">High School</p>
                        <span className="text-xs text-medium-gray italic">2016 - 2020</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Excellence indicator */}
                  <div className="mt-8 p-4 bg-gray-50/50 rounded-xl text-center">
                    <div className="text-xs font-semibold text-charcoal mb-1">Academic Excellence</div>
                    <div className="text-xs text-medium-gray">Consistent performer with strong technical foundation</div>
                  </div>
                </div>

                {/* Floating accent */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-charcoal rounded-full opacity-10 floating-badge"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-medium-gray rounded-full opacity-20 floating-badge floating-delay-3"></div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-light-gray/20 rounded-full opacity-30"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-gray-100/30 to-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
