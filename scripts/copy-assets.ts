import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectsDir = path.join(__dirname, '../projects')
const publicDir = path.join(__dirname, '../public')
const publicAssetsDir = path.join(__dirname, '../public/assets')

function copyAssets() {
  if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(publicAssetsDir, { recursive: true })
  }

  // Copy projectIndex.json to public
  const projectIndexSrc = path.join(__dirname, '../projectIndex.json')
  const projectIndexDest = path.join(publicDir, 'projectIndex.json')
  if (fs.existsSync(projectIndexSrc)) {
    fs.copyFileSync(projectIndexSrc, projectIndexDest)
  }

  if (!fs.existsSync(projectsDir)) {
    return
  }

  const projectFolders = fs.readdirSync(projectsDir)

  for (const folder of projectFolders) {
    const projectPath = path.join(projectsDir, folder)
    const stat = fs.statSync(projectPath)

    if (!stat.isDirectory()) continue

    const projectAssetDir = path.join(publicAssetsDir, folder)
    if (!fs.existsSync(projectAssetDir)) {
      fs.mkdirSync(projectAssetDir, { recursive: true })
    }

    const files = fs.readdirSync(projectPath)
    const imageRegex = /\.(png|jpg|jpeg|gif|svg|webp)$/i

    for (const file of files) {
      if (imageRegex.test(file)) {
        const src = path.join(projectPath, file)
        const dest = path.join(projectAssetDir, file)
        try {
          fs.copyFileSync(src, dest)
          console.log(`✓ Copied ${folder}/${file}`)
        } catch (err) {
          console.error(`✗ Failed to copy ${file}:`, err)
        }
      }
    }
  }

  console.log('✓ Asset copy complete')
}

copyAssets()