import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';
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
 * Full post reading view at '/blog/:id'.
 * Displays title, author with avatar, date, and full content.
 * Admin sees edit and delete buttons on all posts.
 * User sees edit/delete only on own posts; on others' posts, sees only back link.
 * Delete confirms before removal via window.confirm() and redirects to /blogs.
 * Invalid/missing ID shows 'Post not found' message.
 * @returns {JSX.Element}
 */
function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    const posts = getPosts();
    const foundPost = posts.find((p) => p.id === id);

    if (!foundPost) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setPost(foundPost);
    setLoading(false);
  }, [id, navigate, session]);

  function handleDelete() {
    if (!post) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) return;

    const posts = getPosts();
    const updatedPosts = posts.filter((p) => p.id !== post.id);
    savePosts(updatedPosts);
    navigate('/blogs', { replace: true });
  }

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading...</p>
        </main>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <span
              className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl bg-gray-100 text-gray-400 mb-4"
              role="img"
              aria-label="Not found"
            >
              🔍
            </span>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Post not found
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              The post you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isAdmin = session.role === 'admin';
  const isAuthor = session.userId === post.authorId;
  const canEdit = isAdmin || isAuthor;
  const canDelete = isAdmin || isAuthor;

  const authorRole = isAdmin && post.authorId === session.userId ? 'admin' : 'user';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getAvatar(authorRole)}
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {post.authorName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              {(canEdit || canDelete) && (
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <Link
                      to={`/blog/${post.id}/edit`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
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
                  )}
                  {canDelete && (
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
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
                  )}
                </div>
              )}
            </div>
          </header>

          <div className="border-t border-gray-100 pt-6">
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default ReadBlog;