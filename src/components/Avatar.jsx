import React from 'react';
import PropTypes from 'prop-types';

/**
 * Returns a styled avatar JSX element based on the user's role.
 * @param {string} role - The user's role ("admin" or "user").
 * @returns {JSX.Element} A styled <span> element with an emoji and role-specific background color.
 */
export function getAvatar(role) {
  const isAdmin = role === 'admin';
  const emoji = isAdmin ? '👑' : '📖';
  const colorClasses = isAdmin
    ? 'bg-violet-100 text-violet-700'
    : 'bg-indigo-100 text-indigo-700';

  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${colorClasses}`}
      role="img"
      aria-label={isAdmin ? 'admin avatar' : 'user avatar'}
    >
      {emoji}
    </span>
  );
}

/**
 * Avatar component that displays a role-based avatar.
 * @param {Object} props
 * @param {string} props.role - The user's role ("admin" or "user").
 * @returns {JSX.Element}
 */
function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

export default Avatar;