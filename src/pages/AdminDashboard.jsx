import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { getSession } from '../utils/auth';
import { getPosts, savePosts, getUsers } from '../utils/storage';
import { getAvatar } from '../components/Avatar';

/**
 * Formats an ISO8601 date string into a human-readable format.
 * @param {string} dateStr - The ISO8601 date string.
 * @returns {string} The formatted date string.
 */
function formatDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Truncates content to a specified maximum length and appends ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum character length.
 * @returns {string} The truncated text.
 */
function truncate(text, maxLength = 80) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Admin-only dashboard page at '/admin'.
 * Displays gradient header with welcome message, four StatCard components
 * (Total Posts, Total Users, Admins count, Users count), quick action buttons,
 * and a recent 5 posts section with edit/delete controls.
 * @returns {JSX.Element}
 */
function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    setPosts(getPosts());
    setUsers(getUsers());
  }, [navigate, session]);

  if (!session || session.role !== 'admin') {
    return null;
  }

  const totalPosts = posts.length;
  const totalUsers = users.length + 1; // +1 for hard-coded admin
  const adminCount = users.filter((u) => u.role === 'admin').length + 1; // +1 for hard-coded admin
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = posts
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function handleDeletePost(postId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) return;

    const updatedPosts = posts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    setPosts(updatedPosts);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Gradient Header */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {session.displayName}
          </h1>
          <p className="text-sm text-indigo-100">
            Here&apos;s an overview of your WriteSpace community.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard value={totalPosts} label="Total Posts" icon="📝" color="indigo" />
          <StatCard value={totalUsers} label="Total Users" icon="👥" color="violet" />
          <StatCard value={adminCount} label="Admins" icon="👑" color="amber" />
          <StatCard value={userCount} label="Users" icon="📖" color="green" />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
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
          <Link
            to="/users"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Posts</h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View All
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-100">
              {recentPosts.map((post) => {
                const authorRole =
                  post.authorId === session.userId ? 'admin' : 'user';

                return (
                  <div
                    key={post.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {getAvatar(authorRole)}
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors block truncate"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-gray-500 truncate">
                          {truncate(post.content)} — {post.authorName} · {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link
                        to={`/blog/${post.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                        aria-label={`Edit ${post.title}`}
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                        aria-label={`Delete ${post.title}`}
                      >
                        <svg
                          className="w-3.5 h-3.5 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts yet
              </h3>
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
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;