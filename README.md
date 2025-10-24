# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Environment Variables

This application uses environment variables for configuration. Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Configure the following variables in your `.env` file:

- `API_ENDPOINT` - The base URL for the concert API backend (default: `http://localhost:3000`)

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Architecture

This application uses an image proxy architecture to handle images in containerized environments:

- **Server-side data fetching**: Concert data is fetched server-side using the `API_ENDPOINT` environment variable
- **Image proxying**: Images are proxied through the React Router app at `/images/:id.jpeg`
  - The browser requests images from the React Router app (same origin)
  - The app fetches images from the API backend using internal Docker networking
  - The app streams the images back to the browser

This approach ensures images work correctly when deployed with Docker Compose, where the API is only accessible within the Docker network.

### Docker Deployment

To build and run using Docker:

```bash
docker build -t concert-app .

# Run the container with environment variables
docker run -p 3001:3000 -e API_ENDPOINT=http://your-api-url:3000 concert-app
```

### Docker Compose (Recommended)

The included `docker-compose.yml` sets up both the app and API with proper networking:

```bash
# Update docker-compose.yml with your API image
# Then start all services
docker-compose up

# Or run in detached mode
docker-compose up -d
```

**Key points:**
- The app connects to the API using `http://api:3000` (internal Docker network)
- External access to the app is on port `3001`
- External access to the API is on port `3000`
- Images are automatically proxied through the app, so they work from the browser

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
