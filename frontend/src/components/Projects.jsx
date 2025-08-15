import React, { useState, useEffect } from 'react'
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa'

const Projects = () => {
  const [visibleProjects, setVisibleProjects] = useState([])

  const projects = [
    {
      id: 1,
      title: 'Interview Preparation Platform',
      description: 'A full-stack web platform that helps job seekers prepare for interviews by offering personalized AI-generated questions, resume-based skill analysis, and progress tracking. Features secure user authentication, intelligent resume parsing with PyMuPDF, AI-powered question generation using OpenAI API, real-time feedback, and comprehensive progress tracking dashboard.',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop&auto=format&q=80',
      technologies: ['React.js', 'Vue.js', 'Node.js', 'Express.js', 'MongoDB Atlas', 'Firebase', 'PyMuPDF', 'OpenAI API', 'Tailwind CSS'],
      status: 'Completed',
      github: 'https://github.com/harshavardhan-hub/interview-prep-platform',
      demo: 'https://github.com/harshavardhan-hub/interview-prep-platform'
    },
    {
      id: 2,
      title: 'Travel Planner App',
      description: 'A full-stack travel itinerary planner designed for effortless trip organization. Features secure Firebase Authentication for user sign-up and login, customizable trip planning with categories for accommodation, activities, and transport, favorite marking system for quick access to preferred destinations, and comprehensive itinerary management with real-time editing capabilities across all devices.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=450&fit=crop&auto=format&q=80',
      technologies: ['React.js', 'Tailwind CSS', 'Firebase', 'Firebase Authentication', 'Firebase Firestore'],
      status: 'Completed',
      github: 'https://github.com/harshavardhan-hub/travel-planner',
      demo: 'https://github.com/harshavardhan-hub/travel-planner'
    },
    {
      id: 3,
      title: 'Harsha Vardhan Portfolio Website',
      description: 'A full-stack personal portfolio designed to showcase skills, projects, and professional journey in an interactive and visually appealing way. Built for potential employers, clients, and collaborators, featuring React 18.2.0 with Vite for fast modular UI, custom typography with Playfair Display and Inter fonts, real-time WhatsApp alerts for contact form submissions, and optimized performance with accessibility focus.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=450&fit=crop&auto=format&q=80',
      technologies: ['React 18.2.0', 'Vite', 'Tailwind CSS 3.3.5', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'React Icons 4.11.0', 'React Toastify 9.1.3'],
      status: 'Completed',
      github: 'https://github.com/harshavardhan-hub/portfolio-website',
      demo: 'https://harshavardhan-portfolio.com'
    }
  ]

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const projectId = entry.target.getAttribute('data-project-id')
            setVisibleProjects(prev => [...new Set([...prev, projectId])])
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const projectCards = document.querySelectorAll('.project-card')
    projectCards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  return (
    <section id="projects" className="py-12 bg-gray-50 min-h-screen flex items-center">
      <div className="max-w-8xl mx-auto px-8 md:px-16 lg:px-24 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
            Featured Projects
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-medium-gray leading-relaxed text-center max-w-4xl mx-auto">
            A curated selection of my most impactful work, showcasing expertise across various technologies and industries.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {projects.map((project, index) => (
            <div
              key={project.id}
              data-project-id={project.id}
              className={`project-card transition-all duration-700 ease-out flex flex-col h-full ${
                visibleProjects.includes(project.id.toString()) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 150}ms`,
                transformOrigin: 'center bottom'
              }}
            >
              {/* Project Image */}
              <div className="project-image-container">
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-image"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="project-overlay">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overlay-btn transform hover:scale-105"
                  >
                    <FaExternalLinkAlt size={14} />
                    View Live
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overlay-btn transform hover:scale-105"
                  >
                    <FaGithub size={14} />
                    View Code
                  </a>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Project Title */}
                <h3 className="text-xl font-bold text-charcoal mb-3 leading-tight font-serif">
                  {project.title}
                </h3>

                {/* Project Description */}
                <p className="text-sm text-medium-gray leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Status Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {project.status}
                  </span>
                </div>

                {/* Technology Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span 
                      key={techIndex} 
                      className="tech-tag transition-colors duration-200 hover:bg-charcoal hover:text-white"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons - Now pushed to bottom */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-charcoal hover:text-medium-gray transition-all duration-200 font-bold text-sm flex items-center gap-2 transform hover:translate-x-1"
                  >
                    View Project
                    <FaExternalLinkAlt size={12} />
                  </a>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-medium-gray hover:text-charcoal transition-all duration-200 transform hover:scale-110"
                  >
                    <FaGithub size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
