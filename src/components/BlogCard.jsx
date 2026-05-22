import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

const BORDER_COLORS = [
  'border-indigo-500',
  'border-violet-500',
  'border-green-500',
  'border-amber-500',
  'border-blue-500',
  'border-red-500',
];

/**
 * Truncates content to a specified maximum length and appends ellipsis if needed.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - The maximum character length.
 * @returns {string} The truncated text.
 */
function truncate(text, maxLength = 120) {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  return text.slice(0, maxLength).trimEnd() + '…';
}

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
 * Reusable blog post card component.
 * Displays title, excerpt (truncated content), date, author avatar, and an edit icon
 * if the current user is an admin or the post author. Links to /blog/:id.
 * @param {Object} props
 * @param {Object} props.post - The blog post object.
 * @param {string} props.post.id - The post's unique ID.
 * @param {string} props.post.title - The post's title.
 * @param {string} props.post.content - The post's content.
 * @param {string} props.post.createdAt - The post's creation date (ISO8601).
 * @param {string} props.post.authorId - The post author's user ID.
 * @param {string} props.post.authorName - The post author's display name.
 * @param {number} props.index - The index used for cycling the top border color.
 * @returns {JSX.Element}
 */
function BlogCard({ post, index }) {
  const session = getSession();
  const borderColor = BORDER_COLORS[index % BORDER_COLORS.length];

  const isAdmin = session && session.role === 'admin';
  const isAuthor = session && session.userId === post.authorId;
  const canEdit = isAdmin || isAuthor;

  const authorRole = isAdmin && post.authorId === session.userId ? 'admin' : 'user';

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 border-t-4 ${borderColor} overflow-hidden flex flex-col`}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link
            to={`/blog/${post.id}`}
            className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {post.title}
          </Link>
          {canEdit && (
            <Link
              to={`/blog/${post.id}`}
              className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-indigo-600"
              aria-label={`Edit ${post.title}`}
            >
              <svg
                className="w-4 h-4"
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
            </Link>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 flex-1">
          {truncate(post.content)}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {getAvatar(authorRole)}
            <span className="text-sm font-medium text-gray-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default BlogCard;