import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';

/**
 * Public landing page component.
 * Displays hero section, features section, latest posts preview, and footer.
 * @returns {JSX.Element}
 */
function LandingPage() {
  const posts = getPosts();
  const latestPosts = posts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            WriteSpace
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            A clean, distraction-free space to write, share, and discover stories. Your words, your space.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-indigo-700 bg-white rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white border border-white rounded-lg hover:bg-white hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
          Why WriteSpace?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl bg-indigo-100 text-indigo-700 mb-4"
              role="img"
              aria-label="Write Freely"
            >
              ✍️
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Write Freely</h3>
            <p className="text-sm text-gray-600">
              A distraction-free editor that lets you focus on what matters most — your words.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl bg-violet-100 text-violet-700 mb-4"
              role="img"
              aria-label="Private & Local"
            >
              🔒
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Private & Local</h3>
            <p className="text-sm text-gray-600">
              Your data stays in your browser. No servers, no tracking — complete privacy.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <span
              className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl bg-green-100 text-green-700 mb-4"
              role="img"
              aria-label="Instant & Fast"
            >
              ⚡
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant & Fast</h3>
            <p className="text-sm text-gray-600">
              No loading spinners, no waiting. Everything happens instantly in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* Latest Posts Preview */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
          Latest Posts
        </h2>
        {latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <span
              className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl bg-gray-100 text-gray-400 mb-4"
              role="img"
              aria-label="No posts"
            >
              📝
            </span>
            <p className="text-gray-500 text-sm mb-4">No posts yet. Be the first to write something!</p>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Get Started
            </Link>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Link
              to="/"
              className="text-lg font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              WriteSpace
            </Link>
            <div className="flex items-center gap-6">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Register
              </Link>
            </div>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;