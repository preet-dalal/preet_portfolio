import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import. meta.url))

const requiredImages = {
  'Project-1':  ['SVBH_corner_plot.png', 'SCH_corner_plot.png', 'SVBH_combined.png', 'SCH_combined.png'],
  'Project-2': [],
  'Project-3': ['circular_sch.png', 'precession_timelike.png', 'M_phi.png', 'a_phi.png', 'e_phi.png', 'Q_phi.png'],
}

function generatePlaceholder(filename: string): Buffer {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
    <rect fill="#1a1f3a" width="800" height="400"/>
    <circle cx="400" cy="200" r="50" fill="#fb923c" opacity="0.3"/>
    <text x="400" y="190" font-size="24" fill="#999" text-anchor="middle" font-family="Arial">${filename. replace('.png', '')}</text>
    <text x="400" y="220" font-size="14" fill="#666" text-anchor="middle" font-family="Arial">Placeholder Image</text>
  </svg>`
  return Buffer.from(svg, 'utf-8')
}

function setup() {
  for (const [projectFolder, images] of Object.entries(requiredImages)) {
    const projectPath = path.join(__dirname, `../projects/${projectFolder}`)

    if (!fs.existsSync(projectPath)) {
      fs.mkdirSync(projectPath, { recursive: true })
    }

    for (const img of images) {
      const imgPath = path.join(projectPath, img)
      if (! fs.existsSync(imgPath)) {
        const placeholder = generatePlaceholder(img)
        fs.writeFileSync(imgPath, placeholder)
        console.log(`✓ Generated placeholder:  ${projectFolder}/${img}`)
      }
    }
  }
}

setup()