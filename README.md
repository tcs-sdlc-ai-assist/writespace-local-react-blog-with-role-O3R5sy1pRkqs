# WriteSpace

A clean, distraction-free blogging platform built with React 18 and Vite. All data is stored locally in your browser using `localStorage` — no backend required.

## Tech Stack

- **React 18** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first CSS framework
- **React Router v6** — Client-side routing
- **localStorage** — Data persistence (posts, users, sessions)
- **Vitest** — Unit and component testing
- **Testing Library** — React component testing utilities

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Default Admin Credentials

A hard-coded admin account is available out of the box:

| Username | Password   |
|----------|------------|
| `admin`  | `admin123` |

Username matching is case-insensitive (e.g., `Admin`, `ADMIN`, and `admin` all work).

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── vitest.setup.js             # Test setup (jest-dom, localStorage mock)
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment configuration
├── public/
│   └── vite.svg                # Favicon
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Router and route definitions
    ├── index.css               # Tailwind directives
    ├── components/
    │   ├── Avatar.jsx          # Role-based avatar component (👑 admin, 📖 user)
    │   ├── Avatar.test.jsx     # Avatar component tests
    │   ├── BlogCard.jsx        # Blog post card for grid layouts
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── ProtectedRoute.jsx  # Route guard with role-based access
    │   ├── PublicNavbar.jsx     # Public navigation bar for guests
    │   ├── StatCard.jsx        # Dashboard stat tile component
    │   └── UserRow.jsx         # User table row / mobile card component
    ├── pages/
    │   ├── AdminDashboard.jsx  # Admin dashboard with stats and recent posts
    │   ├── Home.jsx            # Blog listing page (authenticated)
    │   ├── Home.test.jsx       # Home page tests
    │   ├── LandingPage.jsx     # Public landing page
    │   ├── LoginPage.jsx       # Login form
    │   ├── LoginPage.test.jsx  # Login page tests
    │   ├── ReadBlog.jsx        # Full post reading view
    │   ├── RegisterPage.jsx    # Registration form
    │   ├── UserManagement.jsx  # Admin user management page
    │   └── WriteBlog.jsx       # Blog create and edit form
    └── utils/
        ├── auth.js             # Session management (getSession, setSession, clearSession)
        ├── auth.test.js        # Auth utility tests
        ├── storage.js          # localStorage helpers (getPosts, savePosts, getUsers, saveUsers)
        └── storage.test.js     # Storage utility tests
```

## Route Map

### Public Routes

| Path        | Page            | Description                          |
|-------------|-----------------|--------------------------------------|
| `/`         | LandingPage     | Public landing page with hero section |
| `/login`    | LoginPage       | Login form                           |
| `/register` | RegisterPage    | Registration form                    |

### Authenticated Routes

Requires an active session. Unauthenticated users are redirected to `/login`.

| Path              | Page      | Description                        |
|-------------------|-----------|------------------------------------|
| `/blogs`          | Home      | Blog listing with post grid        |
| `/blog/new`       | WriteBlog | Create a new blog post             |
| `/blog/:id`       | ReadBlog  | Read a full blog post              |
| `/blog/:id/edit`  | WriteBlog | Edit an existing blog post         |

### Admin-Only Routes

Requires an active session with `role: "admin"`. Non-admin users are redirected to `/blogs`.

| Path     | Page            | Description                          |
|----------|-----------------|--------------------------------------|
| `/admin` | AdminDashboard  | Admin dashboard with stats overview  |
| `/users` | UserManagement  | Create and manage user accounts      |

## Usage Guide

### For Users

1. **Register** — Visit `/register` to create an account with a display name, username, and password.
2. **Login** — Visit `/login` and sign in with your credentials.
3. **Browse Posts** — The `/blogs` dashboard shows all posts sorted newest first.
4. **Create a Post** — Click "New Post" to write and publish a blog post (5000 character limit).
5. **Read a Post** — Click any post title to view the full content.
6. **Edit Your Posts** — You can edit or delete posts you authored.

### For Admins

1. **Login** — Use the default admin credentials or any admin-role account.
2. **Admin Dashboard** — View community stats (total posts, users, admins) at `/admin`.
3. **Manage Users** — Create new user accounts and delete existing ones at `/users`.
4. **Edit Any Post** — Admins can edit and delete any post in the system.
5. **Cascading Deletion** — Deleting a user also removes all of their posts.

### Data Persistence

All data is stored in your browser's `localStorage` under the following keys:

| Key                    | Description              |
|------------------------|--------------------------|
| `writespace_session`   | Current user session     |
| `writespace_posts`     | All blog posts           |
| `writespace_users`     | All registered users     |

Clearing your browser data will remove all stored content.

## Deployment

### Vercel

The project includes a `vercel.json` configuration with a catch-all rewrite rule for SPA routing:

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

Deploy by connecting your repository to [Vercel](https://vercel.com/) or using the Vercel CLI:

```bash
npx vercel
```

### Other Platforms

For any static hosting platform, build the project with `npm run build` and serve the `dist/` directory. Ensure all routes are redirected to `index.html` for client-side routing to work.

## License

Private