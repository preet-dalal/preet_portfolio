import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProjectPage from './pages/ProjectPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project/:slug" element={<ProjectPage />} />
      <Route path="*" element={<div className="text-center py-20">404 - Not Found</div>} />
    </Routes>
  )
}