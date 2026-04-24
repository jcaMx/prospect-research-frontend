# Prospect Research Frontend

## Local development

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` to the backend base URL if your API is not running on `http://localhost:5000`.

## Render deployment

This project is a Vite frontend and should be deployed on Render as a static site.

Recommended settings:

- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`

The repo also includes [render.yaml](/C:/Projects/prospect-research-frontend/render.yaml) with those settings plus a catch-all rewrite to `index.html`.

## Important

If `VITE_API_BASE_URL` is not set in Render, the app will fall back to `http://localhost:5000`, which will not work from a deployed browser session.
