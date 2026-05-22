import React from 'react';
import PropTypes from 'prop-types';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

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
 * User table row (desktop) or stacked card (mobile) component.
 * Shows avatar, display name, username, role badge pill, created date, and delete button.
 * Delete button is hidden for the hard-coded admin (username "admin") and the currently logged-in user.
 * @param {Object} props
 * @param {Object} props.user - The user object.
 * @param {string} props.user.id - The user's unique ID.
 * @param {string} props.user.displayName - The user's display name.
 * @param {string} props.user.username - The user's username.
 * @param {string} props.user.role - The user's role ("admin" or "user").
 * @param {string} props.user.createdAt - The user's creation date (ISO8601).
 * @param {Function} props.onDelete - Callback invoked with the user's ID when the delete button is clicked.
 * @returns {JSX.Element}
 */
function UserRow({ user, onDelete }) {
  const session = getSession();

  const isHardCodedAdmin = user.username === 'admin';
  const isCurrentUser = session && session.userId === user.id;
  const canDelete = !isHardCodedAdmin && !isCurrentUser;

  const roleBadge =
    user.role === 'admin' ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
        Admin
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
        User
      </span>
    );

  return (
    <>
      {/* Desktop row */}
      <tr className="hidden md:table-row border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          {roleBadge}
        </td>
        <td className="px-6 py-4">
          <span className="text-sm text-gray-500">{formatDate(user.createdAt)}</span>
        </td>
        <td className="px-6 py-4 text-right">
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(user.id)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              aria-label={`Delete ${user.displayName}`}
            >
              Delete
            </button>
          )}
        </td>
      </tr>

      {/* Mobile card */}
      <div className="md:hidden bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getAvatar(user.role)}
            <div>
              <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
            </div>
          </div>
          {roleBadge}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Joined {formatDate(user.createdAt)}</span>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(user.id)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              aria-label={`Delete ${user.displayName}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;