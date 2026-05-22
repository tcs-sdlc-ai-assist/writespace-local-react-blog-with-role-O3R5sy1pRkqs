import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import { getPosts } from '../utils/storage';
import { getSession } from '../utils/auth';

/**
 * Authenticated blog list page at '/blogs'.
 * Displays all posts from localStorage in a responsive grid of BlogCard components,
 * sorted newest first. Shows empty state with CTA to write first post if no posts exist.
 * @returns {JSX.Element}
 */
function Home() {
  const session = getSession();
  const posts = getPosts();
  const sortedPosts = posts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            {session && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {session.displayName}
              </p>
            )}
          </div>
          <Link
            to="/blog/new"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Post
          </Link>
        </div>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <span
              className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl bg-gray-100 text-gray-400 mb-4"
              role="img"
              aria-label="No posts"
            >
              📝
            </span>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              No posts yet
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Be the first to write something! Share your thoughts with the community.
            </p>
            <Link
              to="/blog/new"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;