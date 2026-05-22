import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, clearSession } from '../utils/auth';
import { getAvatar } from './Avatar';

/**
 * Authenticated navigation bar component.
 * Shows logo, role-based nav links (admin sees Dashboard and Users links),
 * avatar chip with display name, logout dropdown, and mobile hamburger toggle.
 * @returns {JSX.Element}
 */
function Navbar() {
  const session = getSession();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleLogout() {
    clearSession();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/login', { replace: true });
  }

  if (!session) {
    return null;
  }

  const isAdmin = session.role === 'admin';

  const navLinks = (
    <>
      <Link
        to="/blogs"
        className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
        onClick={() => setMobileOpen(false)}
      >
        Dashboard
      </Link>
      {isAdmin && (
        <Link
          to="/users"
          className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          Users
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link
            to="/blogs"
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            WriteSpace
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {navLinks}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {getAvatar(session.role)}
              <span className="text-sm font-medium text-gray-700">
                {session.displayName}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{session.displayName}</p>
                  <p className="text-xs text-gray-500 capitalize">{session.role}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 px-6 py-4 space-y-4">
          <div className="flex flex-col gap-3">
            {navLinks}
          </div>
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center gap-2 mb-3">
              {getAvatar(session.role)}
              <div>
                <p className="text-sm font-medium text-gray-900">{session.displayName}</p>
                <p className="text-xs text-gray-500 capitalize">{session.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;