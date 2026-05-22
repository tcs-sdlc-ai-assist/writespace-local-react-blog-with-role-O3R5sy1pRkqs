import React from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Public navigation bar component.
 * Shows WriteSpace logo, 'Login' and 'Get Started' buttons for guests.
 * If user is logged in (session exists), shows avatar chip and 'Go to Dashboard' CTA.
 * @returns {JSX.Element}
 */
function PublicNavbar() {
  const session = getSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <Link to="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
        WriteSpace
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <div className="flex items-center gap-2">
              {getAvatar(session.role)}
              <span className="text-sm font-medium text-gray-700">
                {session.displayName}
              </span>
            </div>
            <Link
              to="/blogs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;