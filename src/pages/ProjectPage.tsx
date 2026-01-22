import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import TeXRenderer from '../components/TeXRenderer'
import type { Project } from '../types'

export default function ProjectPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const basePath = import.meta.env.BASE_URL
    fetch(`${basePath}projectIndex.json`)
      .then((res) => res.json())
      .then((projects: Project[]) => {
        const found = projects.find((p) => p.slug === slug)
        if (found) {
          setProject(found)
        } else {
          setError('Project not found')
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load project:', err)
        setError('Failed to load project')
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-900">
        <div className="text-xl text-gray-400">Loading...</div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-cosmic-900 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">{error || 'Project not found'}</h1>
          <Link to="/" className="text-orange-500 hover:text-orange-400">
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cosmic-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Link
              to="/"
              className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors mb-4"
            >
              ← Back to Projects
            </Link>
          </div>
        </header>

        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto px-4 py-12"
        >
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">{project.title}</h1>
            <p className="text-lg text-gray-400 leading-relaxed">{project.summary}</p>
            {project.date && (
              <p className="text-sm text-gray-500 mt-4">{new Date(project.date).toLocaleDateString()}</p>
            )}
          </header>

          <div className="prose-tex">
            <TeXRenderer content={project.content} images={project.images} />
          </div>
        </motion.article>
      </div>
    </div>
  )
}