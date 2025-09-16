import React from 'react'

const Skills = () => {
  const skillCategories = [
    {
      title: 'Frontend',
      skills: [
        { name: 'React', level: 90 },
        { name: 'JavaScript', level: 95 },
        { name: 'TypeScript', level: 85 },
        { name: 'HTML/CSS', level: 95 },
        { name: 'Tailwind CSS', level: 90 },
        { name: 'Bootstrap', level: 85 }
      ]
    },
    {
      title: 'Backend',
      skills: [
        { name: 'Node.js', level: 90 },
        { name: 'Express.js', level: 85 },
        { name: 'MongoDB', level: 80 },
        { name: 'SQL', level: 80 },
        { name: 'RESTful APIs', level: 90 },
        { name: 'Python', level: 85 }
      ]
    },
    {
      title: 'Tools & Others',
      skills: [
        { name: 'Git/GitHub', level: 90 },
        { name: 'VS Code', level: 95 },
        { name: 'Vercel', level: 90 },
        { name: 'Render', level: 95 },
        { name: 'MongoDB Atlas', level: 80 },
        { name: 'Firebase', level: 80 }
      ]
    }
  ]

  return (
    <section id="skills" className="py-20 bg-light-gray/30 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-charcoal mb-6">
            Skills & Experience
          </h2>
          {/* Mobile text - shorter version with smaller font */}
          <p className="block md:hidden text-base text-medium-gray max-w-3xl mx-auto leading-relaxed">
            Tools I use to build amazing projects.
          </p>
          {/* Desktop text - full version with original font size */}
          <p className="hidden md:block text-xl text-medium-gray max-w-3xl mx-auto leading-relaxed">
            Technologies and tools I use to bring ideas to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div 
              key={categoryIndex} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-light-gray/50 card-hover animate-fade-in-up"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              <h3 className="text-2xl font-serif font-bold text-charcoal mb-8 text-center">{category.title}</h3>
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-charcoal font-medium">{skill.name}</span>
                      <span className="text-medium-gray text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-light-gray rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-charcoal h-2 rounded-full smooth-transition"
                        style={{ 
                          width: `${skill.level}%`,
                          animationDelay: `${(categoryIndex * 0.1) + (skillIndex * 0.05)}s`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
