# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

#### Public Pages
- Public landing page with hero section, feature highlights, latest posts preview, and footer.
- Public navigation bar with WriteSpace logo, Login and Get Started buttons for guests, and dashboard link for authenticated users.

#### Authentication
- Login page with username and password form on gradient background.
- Registration page with display name, username, password, and confirm password fields.
- Hard-coded admin account (`admin` / `admin123`) with automatic recognition on login.
- Case-insensitive username matching for both login and registration.
- Session management via `localStorage` with `getSession`, `setSession`, and `clearSession` utilities.
- Automatic redirect for already-authenticated users away from login and register pages.

#### Role-Based Access Control
- `ProtectedRoute` component enforcing authentication and role-based route guarding.
- Admin-only routes for the admin dashboard (`/admin`) and user management (`/users`).
- Authenticated routes for blog listing (`/blogs`), blog creation (`/blog/new`), blog reading (`/blog/:id`), and blog editing (`/blog/:id/edit`).
- Non-admin users redirected to `/blogs` when attempting to access admin routes.
- Unauthenticated users redirected to `/login` when attempting to access protected routes.

#### Blog CRUD
- Blog creation form at `/blog/new` with title and content fields, inline validation, and character counter (5000 character limit).
- Blog reading view at `/blog/:id` with full post content, author avatar, formatted date, and back navigation.
- Blog editing form at `/blog/:id/edit` with pre-populated fields and ownership enforcement (authors edit own posts, admins edit any).
- Blog deletion with `window.confirm()` confirmation dialog and redirect to dashboard.
- Blog listing on the Home page (`/blogs`) with responsive grid of `BlogCard` components sorted newest first.
- Empty state with call-to-action when no posts exist.

#### Admin Dashboard
- Admin dashboard at `/admin` with gradient welcome header and personalized greeting.
- Four `StatCard` components displaying Total Posts, Total Users, Admins count, and Users count.
- Quick action buttons for creating new posts and managing users.
- Recent posts section showing the latest 5 posts with edit and delete controls.

#### User Management
- Admin-only user management page at `/users` with create user form.
- Create user form with display name, username, password, and role (user/admin) fields.
- Username uniqueness validation against both hard-coded admin and existing `localStorage` users.
- User listing displayed as a table on desktop and stacked cards on mobile via `UserRow` component.
- Hard-coded admin included in the displayed user list.
- User deletion with `window.confirm()` confirmation and cascading deletion of the user's posts.
- Protection against deleting the hard-coded admin account or the currently logged-in user.

#### Avatar System
- Role-based `Avatar` component displaying crown emoji (👑) for admins and book emoji (📖) for users.
- Violet color scheme for admin avatars and indigo color scheme for user avatars.
- `getAvatar` utility function for inline avatar rendering across components.
- Accessible `role="img"` and `aria-label` attributes on avatar elements.

#### UI Components
- `Navbar` component with logo, role-based navigation links, avatar chip with display name, logout dropdown, and mobile hamburger menu.
- `PublicNavbar` component for unauthenticated pages with conditional rendering based on session state.
- `BlogCard` component with colored top border cycling, truncated content preview, author info, and conditional edit icon.
- `StatCard` component with configurable color schemes (indigo, violet, green, red, amber, blue).
- `UserRow` component with desktop table row and mobile card layouts, role badge pills, and conditional delete button.

#### Data Persistence
- `localStorage`-based persistence for posts (`writespace_posts` key) and users (`writespace_users` key).
- `getPosts`, `savePosts`, `getUsers`, and `saveUsers` utility functions with error handling for corrupted data and unavailable storage.
- Session persistence via `writespace_session` key in `localStorage`.

#### Styling & Responsive Design
- Tailwind CSS utility-first styling throughout all components and pages.
- Responsive layouts using `sm:`, `md:`, and `lg:` breakpoints.
- Gradient backgrounds on authentication pages and admin dashboard header.
- Consistent design system with indigo/violet color palette, rounded corners, shadows, and transitions.

#### Deployment
- Vercel SPA deployment configuration with catch-all rewrite rule in `vercel.json`.
- Vite build tooling with React plugin.
- PostCSS configuration with Tailwind CSS and Autoprefixer.

#### Testing
- Unit tests for `auth` utilities (`getSession`, `setSession`, `clearSession`) with round-trip integration tests.
- Unit tests for `storage` utilities (`getPosts`, `savePosts`, `getUsers`, `saveUsers`) with round-trip integration tests.
- Component tests for `Avatar` and `getAvatar` covering both roles, styling, and accessibility.
- Page tests for `Home` covering rendering, empty state, sorting, edit icon visibility, and navigation links.
- Page tests for `LoginPage` covering form rendering, validation, successful login flows, failed login, redirects, and error clearing.
- Vitest configuration with jsdom environment, global test APIs, and `localStorage` mock in setup file.