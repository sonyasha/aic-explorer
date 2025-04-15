# 🎨 AIC Explorer

A modern, responsive, and interactive gallery app that explores artwork from the [Art Institute of Chicago API](https://api.artic.edu/docs/). Built with **React**, **TypeScript**, **Vite**, and **CSS Modules**, and containerized using **Docker**. The app allows users to browse artwork by category, search and filter results, and view detailed pages with collapsible metadata.
Live application can be accessed at [https://aic-explorer.onrender.com](https://aic-explorer.onrender.com)

---

## 🖼️ Features

- Browse artworks by category (fetched from API)
- Infinite scroll (pagination)
- Search and filter artworks (coming soon)
- Responsive layout with sidebar navigation
- Artwork detail pages with collapsible sections
- Light/dark theme support
- Shareable deep links (e.g. `/art/123?type=45`)

---

## 🛠️ Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Routing:** React Router v6
- **State:** useState/useEffect
- **Styling:** CSS Modules + Flexbox/Grid
- **Testing:** Vitest + React Testing Library
- **Deployment:** Docker + Render (CD enabled)

---

## 🚀 Local Development

```bash
# Install dependencies
npm ci

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### 🧪 Run Tests

```bash
npm run test
```

---

## 📦 Docker

### Build and run locally:

```bash
docker build -t aic-explorer .
docker run -p 8080:80 aic-explorer
```

Open [http://localhost:8080](http://localhost:8080)

### With Docker Compose (recommended):

```bash
docker-compose up --build
```

### File overview:

- `Dockerfile`: Multi-stage build and NGINX serve
- `nginx.conf`: SPA routing fallback (`/ -> /index.html`)
- `docker-compose.yml`: Simplified local dev & deployment
- `.dockerignore`: Speeds up builds

---

## 🚀 Deployment via Render (Docker Web Service)

1. Push your repo to GitHub
2. Go to [Render.com](https://render.com)
3. Click **New → Web Service**
4. Choose **Docker** as Environment
5. Set **Dockerfile** as build path
6. Set **Port** to `80`
7. (Optional) Create a **Deploy Hook** to use with CI/CD

### Example GitHub Actions deploy file:

```yaml
on:
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Render Deploy
        env:
          RENDER_DEPLOY_HOOK: ${{ secrets.RENDER_DEPLOY_HOOK }}
        run: |
          curl -X POST "$RENDER_DEPLOY_HOOK"
```

---

## 🧠 Developer Notes

- All artwork and category data is live from [Art Institute of Chicago API](https://api.artic.edu/docs/)
- Cached responses in `localStorage` for performance
- App is mobile-first and supports light/dark system themes

---

## 📁 Folder Structure (simplified)

```
src/
├── api/                  # API functions
├── components/           # Reusable UI components
│   ├── Sidebar/
│   ├── Gallery/
│   └── ArtworkDetail/
├── pages/                # Route-level components
│   └── artwork/
│   └── home/
├── styles/               # Shared styles (e.g. .error class)
├── test/                 # Mock data and setup files
├── types/                # TypeScript interfaces
├── App.tsx
├── main.tsx
```

---

## 📝 License

MIT
