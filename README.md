# Prospect Research Frontend

## Local development

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` to the prospect backend base URL if your API is not running on `http://localhost:5000`.
Set `VITE_SLIDES_API_BASE_URL` to the slides backend base URL if slide generation is running on a separate service.

## Render deployment

This project is a Vite frontend and should be deployed on Render as a static site.

Recommended settings:

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-prospect-backend.onrender.com`
- Environment variable: `VITE_SLIDES_API_BASE_URL=https://your-slides-backend.onrender.com`

The repo also includes [render.yaml](/C:/Projects/prospect-research-frontend/render.yaml) with those settings plus a catch-all rewrite to `index.html`.

## Important

If `VITE_API_BASE_URL` is not set in Render, the app will fall back to `http://localhost:5000`, which will not work from a deployed browser session. If `VITE_SLIDES_API_BASE_URL` is not set, slide requests will fall back to `VITE_API_BASE_URL`.
