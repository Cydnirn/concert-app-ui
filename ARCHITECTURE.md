# Concert App Architecture

## Overview

This application uses a proxy pattern to handle images in containerized environments, ensuring images are accessible regardless of the deployment setup.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser/Client                          │
│                                                                 │
│  Requests:                                                      │
│  - GET /                (Home page)                            │
│  - GET /concert/123     (Concert detail)                       │
│  - GET /images/123.jpeg (Concert image - PROXIED)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│               React Router App (Port 3001)                      │
│                                                                 │
│  Routes:                                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ / (home.tsx)                                             │  │
│  │ - Server-side loader fetches concerts from API           │  │
│  │ - Returns HTML with concert data                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /concert/:id (concert.$id.tsx)                           │  │
│  │ - Server-side loader fetches single concert from API     │  │
│  │ - Returns HTML with concert details                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /images/:id.jpeg (images.$id[.]jpeg.tsx)                 │  │
│  │ - Resource route (no HTML)                               │  │
│  │ - Fetches image from API backend                         │  │
│  │ - Streams image back to browser                          │  │
│  │ - Adds cache headers for performance                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ Server-to-Server
                                 │ (Docker Internal Network)
                                 │ API_ENDPOINT=http://api:3000
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Concert API (Port 3000)                      │
│                                                                 │
│  Endpoints:                                                     │
│  - GET /concert           (List all concerts)                  │
│  - GET /concert/:id       (Get single concert)                 │
│  - GET /images/:id.jpeg   (Get concert image)                  │
└─────────────────────────────────────────────────────────────────┘
```

## Why Image Proxying?

### The Problem

When running in Docker Compose:
- The React Router app runs in one container
- The API runs in another container
- They communicate via an internal Docker network (e.g., `http://api:3000`)
- The browser **cannot** access the internal Docker network directly

If we used direct image URLs like `<img src="http://api:3000/images/123.jpeg">`:
- ❌ The browser would try to connect to `api:3000`
- ❌ DNS resolution would fail (no such host)
- ❌ Images would not load

### The Solution

By proxying images through the React Router app:
1. ✅ Browser requests: `http://localhost:3001/images/123.jpeg`
2. ✅ React Router app fetches from API: `http://api:3000/images/123.jpeg`
3. ✅ React Router app streams the image to the browser
4. ✅ Images load successfully!

### Additional Benefits

- **Caching**: Add aggressive cache headers (`Cache-Control: public, max-age=31536000, immutable`)
- **Error Handling**: Return proper 404 responses or placeholder images
- **Security**: API can be completely internal, not exposed to the internet
- **Flexibility**: Easy to add image processing, resizing, or transformations
- **Same-Origin**: No CORS issues since images come from the same domain

## Data Flow Examples

### Loading the Home Page

```
Browser → GET / → React Router App
                   ↓
                   Loader runs server-side
                   ↓
                   GET http://api:3000/concert
                   ↓
                   API responds with concert list
                   ↓
                   React Router renders HTML
                   ↓
Browser ← HTML with <img src="/images/123.jpeg">
```

### Loading a Concert Image

```
Browser → GET /images/123.jpeg → React Router App
                                   ↓
                                   Loader runs (resource route)
                                   ↓
                                   GET http://api:3000/images/123.jpeg
                                   ↓
                                   API responds with image binary
                                   ↓
Browser ← JPEG image data with cache headers
```

## Environment Variables

- **Local Development**: `API_ENDPOINT=http://localhost:3000`
- **Docker Compose**: `API_ENDPOINT=http://api:3000` (internal network)
- **Production**: `API_ENDPOINT=https://api.example.com` (your production API)

The same code works in all environments without changes!

## Docker Networking

In `docker-compose.yml`:

```yaml
networks:
  concert-network:
    driver: bridge

services:
  api:
    networks:
      - concert-network
  
  app:
    networks:
      - concert-network
    environment:
      - API_ENDPOINT=http://api:3000  # Uses service name!
```

Service names (`api`, `app`) become hostnames within the Docker network.

## Performance Considerations

1. **Caching**: Images are cached for 1 year (`max-age=31536000`)
2. **Immutability**: `immutable` directive prevents revalidation
3. **CDN-Ready**: Easy to add CloudFront/CloudFlare in front
4. **Streaming**: Images are streamed, not buffered entirely in memory
