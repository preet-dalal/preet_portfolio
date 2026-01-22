import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import LaTeXDocument from '../components/LaTeXDocument'
import BlackHoleBackground from '../components/BlackHoleBackground'
import type { Project } from '../types'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [mainContent, setMainContent] = useState<string>('')

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL
    Promise.all([
      fetch(`${basePath}projectIndex.json`)
        .then((res) => res.json())
        .catch(() => []),
      fetch(`${basePath}main.tex`)
        .then((res) => res.text())
        .catch(() => ''),
    ])
      .then(([projectsData, mainTexData]) => {
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setMainContent(mainTexData || '')
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load content:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-900">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cosmic-900 relative overflow-hidden">
      <BlackHoleBackground />
      
      <div className="relative z-10">
        <header className="pt-16 pb-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-gradient text-6xl md:text-7xl font-bold mb-2 leading-tight">
              Preet Dalal
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light">
              Physics Research & Academic Portfolio
            </p>
          </motion.div>
        </header>

        <main className="max-w-4xl mx-auto px-4 pb-20 space-y-16">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-3">About</h2>
            <div className="glass-card p-8 rounded-xl">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Image Column - 40% */}
                <div className="w-full md:w-2/5 flex-shrink-0">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg shadow-2xl">
                    <img 
                      src={`${import.meta.env.BASE_URL}assets/preet-photo.jpg`}
                      alt="Preet Dalal"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 400%22%3E%3Crect fill=%22%231a1f3a%22 width=%22300%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3EPreet Dalal%3C/text%3E%3C/svg%3E'
                      }}
                    />
                  </div>
                </div>
                
                {/* Content Column - 60% */}
                <div className="w-full md:w-3/5 flex flex-col justify-center">
                  <p className="text-gray-200 text-lg leading-relaxed mb-4">
                    I am a physics graduate student at CHARUSAT University, India, pursuing my M.Sc. in Physics with a focus on General Relativity, Astrophysics, and Computational Physics. I am currently working on testing the spacetime geometry of Sgr A* using the relativistic orbit of the S2 star.
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed mb-4">
                    My research interests include black hole physics, modified gravity theories, cosmological parameter estimation, and computational astrophysics. I am passionate about using numerical methods and Bayesian analysis to constrain theoretical models with observational data.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>📧 <a href="mailto:pdalal2003@gmail.com" className="text-orange-400 hover:text-orange-300">pdalal2003@gmail.com</a></span>
                    <span>📍 Gujarat, India</span>
                    <span>🔗 <a href="https://www.linkedin.com/in/preet-dalal/" className="text-orange-400 hover:text-orange-300" target="_blank" rel="noopener noreferrer">LinkedIn</a></span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Education Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-3">Education</h2>
            <div className="space-y-4">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">M.Sc. in Physics</h3>
                  <span className="text-sm text-orange-400">2024 – 2026 (Expected)</span>
                </div>
                <p className="text-gray-400 mb-2">CHARUSAT University, India</p>
                <p className="text-gray-300 text-sm mb-2">Cumulative GPA: 8.26 / 10 (Semesters I–III)</p>
                <p className="text-gray-300 text-sm italic">Core Focus: General Relativity and Astrophysics, Computational Physics, Classical Mechanics, Electrodynamics, Quantum Mechanics</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white">B.Sc. in Physics</h3>
                  <span className="text-sm text-orange-400">2021 – 2024</span>
                </div>
                <p className="text-gray-400 mb-2">Sardar Patel University, India</p>
                <p className="text-gray-300 text-sm">Cumulative GPA: 9.3 / 10 • <span className="text-orange-400 font-semibold">Institute Gold Medalist</span></p>
              </div>
            </div>
          </motion.section>

          {/* Research Interests */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6 border-b-2 border-orange-500 pb-3">Research Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Black Hole Physics</h3>
                <p className="text-gray-300 text-sm">Regular black holes, naked singularities, and relativistic stellar orbits (S2 star)</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Galactic Center Physics</h3>
                <p className="text-gray-300 text-sm">Spacetime geometry testing around Sgr A* using stellar dynamics</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Cosmology</h3>
                <p className="text-gray-300 text-sm">Cosmological parameter estimation, interacting dark energy models, and ΛCDM</p>
              </div>
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-lg font-bold text-orange-400 mb-2">Modified Gravity & Computational Methods</h3>
                <p className="text-gray-300 text-sm">f(Q) gravity, mathematical modeling, Bayesian MCMC, and numerical simulations</p>
              </div>
            </div>
          </motion.section>

          {/* Projects Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-orange-500 pb-3">Research Projects</h2>
            {projects.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-xl">No projects found. Add .tex files to /projects to get started.</p>
              </div>
            ) : (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max">
                {projects.map((project, idx) => (
                  <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Link to={`/project/${project.slug}`}>
                      <div className="glass-card group cursor-pointer h-full overflow-hidden flex flex-col shadow-2xl hover:shadow-orange-500/20 transition-all duration-300">
                        <div className="relative overflow-hidden bg-cosmic-800 aspect-video">
                          <img
                            src={project.previewImage}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 200%22%3E%3Crect fill=%22%231a1f3a%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2224%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3ENo Image%3C/text%3E%3C/svg%3E'
                            }}
                          />
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-400 text-sm leading-relaxed flex-grow line-clamp-3">
                            {project.summary}
                          </p>
                          <div className="mt-4 flex items-center text-orange-500 group-hover:text-orange-400 transition-colors">
                            <span className="text-sm font-medium">Read More →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </main>
      </div>
    </div>
  )
}
