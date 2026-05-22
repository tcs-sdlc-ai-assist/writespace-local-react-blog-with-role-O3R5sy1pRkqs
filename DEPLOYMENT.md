# Deployment Guide

This document covers deploying WriteSpace as a static single-page application (SPA). Since WriteSpace has no backend server, it can be hosted on any static hosting platform.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build](#build)
- [Vercel Deployment](#vercel-deployment)
  - [Option 1: Git Integration](#option-1-git-integration)
  - [Option 2: Vercel CLI](#option-2-vercel-cli)
  - [vercel.json Configuration](#verceljson-configuration)
- [Other Hosting Platforms](#other-hosting-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Generic Static Hosting](#generic-static-hosting)
- [SPA Rewrite Rules](#spa-rewrite-rules)
- [localStorage Limitations in Production](#localstorage-limitations-in-production)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (included with Node.js)
- All dependencies installed via `npm install`

## Build

Create a production-optimized build:

```bash
npm run build
```

This runs `vite build` under the hood. The output is written to the `dist/` directory, which contains:

- `index.html` — the single HTML entry point
- `assets/` — hashed JavaScript and CSS bundles
- `vite.svg` — the favicon copied from `public/`

The `dist/` directory is the only directory you need to deploy. It is fully self-contained and requires no server-side runtime.

To preview the production build locally before deploying:

```bash
npm run preview
```

This starts a local static server (default `http://localhost:4173`) serving the `dist/` directory.

---

## Vercel Deployment

[Vercel](https://vercel.com/) is the recommended deployment platform. WriteSpace includes a `vercel.json` configuration file that handles SPA routing out of the box.

### Option 1: Git Integration

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Vercel auto-detects the Vite framework. Confirm the following settings:

   | Setting          | Value            |
   |------------------|------------------|
   | Framework Preset | Vite             |
   | Build Command    | `npm run build`  |
   | Output Directory | `dist`           |
   | Install Command  | `npm install`    |

5. Click **Deploy**.

Subsequent pushes to the main branch will trigger automatic redeployments.

### Option 2: Vercel CLI

Install the Vercel CLI globally (or use `npx`):

```bash
npm install -g vercel
```

Deploy from the project root:

```bash
vercel
```

For a production deployment:

```bash
vercel --prod
```

The CLI will prompt you to link the project on first run. It reads `vercel.json` automatically.

### vercel.json Configuration

The project includes the following `vercel.json` at the repository root:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**What this does:**

- The `rewrites` array defines URL rewrite rules that run on the Vercel edge.
- The single rule `"source": "/(.*)"` matches **every** incoming request path.
- It rewrites all requests to `/index.html`, which is the SPA entry point.
- This ensures that deep links like `/blogs`, `/blog/abc123`, `/admin`, and `/users` all serve `index.html` instead of returning a 404.
- Once `index.html` loads, React Router takes over and renders the correct page based on the URL path.
- Static assets (JS, CSS, images in `dist/assets/`) are served directly by Vercel before rewrite rules apply, so they are not affected.

**Why this is necessary:**

WriteSpace uses client-side routing via React Router v6. Without this rewrite rule, navigating directly to any route other than `/` (e.g., refreshing the page on `/blogs` or sharing a link to `/blog/post-id`) would result in a 404 error because no corresponding file exists on the server at that path.

---

## Other Hosting Platforms

### Netlify

Create a `netlify.toml` file in the project root (not included by default):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Alternatively, create a `public/_redirects` file:

```
/*    /index.html   200
```

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. You can work around this with a custom `404.html` that redirects to `index.html`:

1. After building, copy `dist/index.html` to `dist/404.html`.
2. Deploy the `dist/` directory to GitHub Pages.

Note: This approach causes a brief redirect and is not ideal for production use.

### Generic Static Hosting

For any static hosting provider (Apache, Nginx, Caddy, S3 + CloudFront, etc.):

1. Run `npm run build` to generate the `dist/` directory.
2. Upload the contents of `dist/` to your hosting provider.
3. Configure a catch-all rewrite rule so that all paths serve `index.html`.

**Nginx example:**

```nginx
server {
    listen 80;
    root /var/www/writespace/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache example (.htaccess):**

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## SPA Rewrite Rules

WriteSpace defines the following client-side routes:

| Path              | Access Level   | Description                        |
|-------------------|----------------|------------------------------------|
| `/`               | Public         | Landing page                       |
| `/login`          | Public         | Login form                         |
| `/register`       | Public         | Registration form                  |
| `/blogs`          | Authenticated  | Blog listing dashboard             |
| `/blog/new`       | Authenticated  | Create a new blog post             |
| `/blog/:id`       | Authenticated  | Read a blog post                   |
| `/blog/:id/edit`  | Authenticated  | Edit a blog post                   |
| `/admin`          | Admin only     | Admin dashboard                    |
| `/users`          | Admin only     | User management                    |

All of these routes are handled entirely in the browser by React Router. The hosting server must serve `index.html` for every path that does not match a static file. Without a catch-all rewrite rule:

- Direct navigation to any route (typing the URL or refreshing the page) will return a 404.
- Only navigation via in-app links (which use the History API) will work.

The `vercel.json` rewrite rule included in this project solves this for Vercel deployments. For other platforms, configure an equivalent rule as shown above.

---

## localStorage Limitations in Production

WriteSpace stores all data in the browser's `localStorage`. This is important to understand for production deployments:

### Storage Keys

| Key                    | Description              |
|------------------------|--------------------------|
| `writespace_session`   | Current user session     |
| `writespace_posts`     | All blog posts           |
| `writespace_users`     | All registered users     |

### Limitations

1. **Per-browser storage** — Data is stored locally in each user's browser. There is no shared database. Each visitor has their own isolated data. One user's posts are not visible to another user on a different browser or device.

2. **No cross-device sync** — A user who registers on one browser cannot log in from another browser or device. Sessions, posts, and user accounts do not sync across clients.

3. **Storage size limits** — Most browsers limit `localStorage` to approximately **5 MB** per origin. For a text-based blogging platform this is generally sufficient, but extremely prolific usage could approach this limit. The application silently fails if storage quota is exceeded.

4. **Data volatility** — Clearing browser data, using incognito/private browsing mode, or switching browsers will result in complete data loss. There is no backup or recovery mechanism.

5. **No server-side rendering** — Since all data lives in `localStorage`, search engines and social media crawlers cannot index blog post content. The application is fully client-side rendered.

6. **Security considerations** — Passwords are stored in plain text in `localStorage`. This is acceptable for a demo/local application but is **not suitable for production use with real user credentials**. The hard-coded admin credentials (`admin` / `admin123`) are publicly documented and should not be relied upon for any security-sensitive deployment.

### Recommendations for Production Use

If you intend to deploy WriteSpace for real users beyond local/demo purposes, consider:

- Adding a backend API and database for persistent, shared data storage.
- Implementing proper password hashing (e.g., bcrypt).
- Using HTTP-only cookies or JWTs for session management instead of `localStorage`.
- Adding server-side data validation and authorization.

---

## Environment Variables

WriteSpace does not currently require any environment variables. All configuration is embedded in the source code.

If you extend the application with API integrations in the future, Vite exposes environment variables prefixed with `VITE_` via `import.meta.env.VITE_*`. Create a `.env` file in the project root:

```
VITE_API_URL=https://api.example.com
```

Access in code:

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

The `.env` file is listed in `.gitignore` and will not be committed to version control.

---

## Troubleshooting

### Routes return 404 on page refresh

Your hosting platform is not configured with a catch-all rewrite rule. See the [SPA Rewrite Rules](#spa-rewrite-rules) section for platform-specific instructions.

### Blank page after deployment

- Verify the build completed without errors by running `npm run build` locally.
- Check that the **Output Directory** is set to `dist` (not `build` or the project root).
- Open the browser developer console for JavaScript errors.

### Data disappears after redeployment

Redeployment does not affect `localStorage` data. If data disappears, the user likely cleared their browser data or is accessing from a different browser/device. See [localStorage Limitations](#localstorage-limitations-in-production).

### Build fails

- Ensure Node.js v18 or later is installed.
- Delete `node_modules/` and `package-lock.json`, then run `npm install` again.
- Verify all dependencies are listed in `package.json`.