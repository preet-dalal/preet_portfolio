import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsDir = path.join(__dirname, '../projects')
const outputFile = path.join(__dirname, '../projectIndex.json')

interface Project {
  slug: string
  title: string
  summary: string
  content: string
  images: Record<string, string>
  previewImage: string
  date: string
}

function extractTeXMetadata(texContent: string): {
  title: string
  summary: string
  content: string
} {
  const titleMatch = texContent.match(/\\title\{\\textbf\{([^}]+)\}\}/)
  let title = titleMatch ? titleMatch[1] : 'Untitled'
  title = title.replace(/\$([^$]*)\$/g, (match) => match.slice(1, -1))

  const overviewMatch = texContent.match(/\\section\*?\{Overview\}([\s\S]*?)(?=\\section|\\begin\{figure\}|\\end\{document\})/i)
  let summary = ''
  if (overviewMatch) {
    summary = overviewMatch[1]
      .replace(/\\footnote\{[^}]*\}/g, '')
      .replace(/\\cite\{[^}]*\}/g, '')
      .replace(/\\\\/g, ' ')
      .split('\n')
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .join(' ')
      .substring(0, 300)
      .trim()
  }

  const documentMatch = texContent.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/)
  const content = documentMatch ? documentMatch[1]. trim() : texContent

  return { title, summary, content }
}

function extractImages(texContent: string, projectDir: string): Record<string, string> {
  const images: Record<string, string> = {}
  const imgRegex = /\\includegraphics(?:\s*\[[^\]]*\])?\{([^}]+)\}/g
  const publicAssetsDir = path.join(__dirname, '../public/assets')

  let match
  while ((match = imgRegex.exec(texContent)) !== null) {
    let imagePath = match[1].trim()
    // Extract the Project-X/filename.ext part from the path
    const parts = imagePath.split('/')
    if (parts.length >= 2) {
      const projectFolder = parts[0] // e.g., "Project-1"
      const fileName = parts[parts.length - 1] // e.g., "image.jpeg"
      const assetsPath = path.join(publicAssetsDir, projectFolder, fileName)
      
      if (fs.existsSync(assetsPath)) {
        images[fileName] = `/assets/${projectFolder}/${fileName}`
      }
    }
  }

  return images
}

function getPreviewImage(images: Record<string, string>, slug: string): string {
  // Use space-themed cover images for projects
  const coverImages: Record<string, string> = {
    'project-1': `/assets/project1-cover.jpg`,  // Black hole/galactic center
    'project-2': `/assets/project2-cover.jpg`,  // Cosmic/deep space
    'project-3': `/assets/project3-cover.jpg`,  // Planetary orbits
  }
  
  // Return cover image if available
  if (coverImages[slug]) {
    return coverImages[slug]
  }
  
  // Fall back to project research figures
  const imageFiles = Object.keys(images)
  if (imageFiles.length > 0) {
    return images[imageFiles[0]]
  }
  
  return `${baseUrl}/assets/placeholder.svg`
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50)
}

async function ingestProjects() {
  const projects: Project[] = []

  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true })
    console.log('Created projects directory.  Add your . tex files to /projects')
    fs.writeFileSync(outputFile, JSON. stringify([], null, 2))
    return
  }

  const projectFolders = fs.readdirSync(projectsDir).sort()

  for (const folder of projectFolders) {
    const projectPath = path.join(projectsDir, folder)
    const stat = fs.statSync(projectPath)

    if (! stat.isDirectory()) continue

    const files = fs.readdirSync(projectPath)
    const texFile = files.find((f) => f.endsWith('.tex'))

    if (!texFile) {
      console.warn(`⚠ No .tex file found in ${folder}`)
      continue
    }

    const texPath = path.join(projectPath, texFile)
    const texContent = fs.readFileSync(texPath, 'utf-8')

    const { title, summary, content } = extractTeXMetadata(texContent)
    const images = extractImages(texContent, projectPath)
    const slug = slugify(folder)
    const previewImage = getPreviewImage(images, slug)

    projects.push({
      slug,
      title,
      summary,
      content,
      images,
      previewImage,
      date: new Date().toISOString().split('T')[0],
    })

    console.log(`✓ Ingested:  ${title}`)
  }

  projects.sort((a, b) => a.slug.localeCompare(b. slug))

  fs.writeFileSync(outputFile, JSON.stringify(projects, null, 2))
  console.log(`\n✓ Generated projectIndex.json with ${projects.length} projects`)
}

ingestProjects().catch(console.error)