# Physics Portfolio

A modern, interactive portfolio website showcasing physics research projects with LaTeX-rendered mathematical content and KaTeX equations.

## Features

- 🌌 Beautiful cosmic-themed UI with animations
- 📐 LaTeX document rendering with KaTeX math support
- 🖼️ Image galleries with subfigures and captions
- 📱 Fully responsive design
- ⚡ Fast Vite + React + TypeScript build

## Projects Included

1. **S2 Star Orbital Dynamics** - Relativistic orbit fitting in Simpson-Visser spacetime
2. **ΛCDM MCMC Analysis** - Bayesian cosmological parameter estimation
3. **Relativistic Precession** - Perihelion precession in Schwarzschild and Reissner-Nordström spacetimes

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- KaTeX (math rendering)
- Framer Motion (animations)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deploying to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., `physics-portfolio` or `cv`)
3. Don't initialize with README (we already have one)

### Step 2: Update Base Path

Edit `vite.config.ts` and update the `base` path to match your repository name:

```typescript
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
```

For example, if your repo is `cv`, keep it as `/cv/`.

### Step 3: Build the Project

```bash
npm run build
```

This creates a `dist` folder with the production build.

### Step 4: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 5: Deploy to GitHub Pages

**Option A: Using GitHub Actions (Recommended)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Then enable GitHub Pages in repository Settings → Pages → Source: `gh-pages` branch.

**Option B: Manual Deploy**

```bash
npm run build
npx gh-pages -d dist
```

Then in repository Settings → Pages → Source: `gh-pages` branch.

### Step 6: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

## Adding New Projects

1. Create a new folder in `projects/Project-N/`
2. Add your `Project_N.tex` file
3. Add images to `projects/Project-N/` folder
4. Run `npm run ingest` to update the project index
5. Rebuild and deploy

## License

MIT License
