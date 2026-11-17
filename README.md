# Bhavya Patel’s portfolio

A Next.js portfolio featuring selected computer science projects, an animated chrome cube, and interactive particle ribbons.

## Development

Use Node.js 24. Install dependencies with `npm ci` and start the development server with `npm run dev`.

## Deployment

GitHub Actions builds the static site from `main` and deploys the `out` directory to GitHub Pages. The workflow reads the repository’s Pages base path so that links and video assets work under the repository URL.

Run `npm run build` to export the site locally.
