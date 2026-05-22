import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, setSession } from '../utils/auth';
import { getUsers } from '../utils/storage';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

/**
 * Login page component at '/login'.
 * Form with username and password fields on gradient background.
 * Validates credentials against hard-coded admin first, then localStorage users.
 * On success, writes session via setSession() and redirects by role.
 * Already-authenticated users are redirected to their home.
 * @returns {JSX.Element}
 */
function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (session.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError('Please enter both username and password.');
      return;
    }

    // Check hard-coded admin credentials first
    if (trimmedUsername.toLowerCase() === ADMIN_USERNAME && trimmedPassword === ADMIN_PASSWORD) {
      setSession({
        userId: 'admin',
        username: ADMIN_USERNAME,
        displayName: 'Admin',
        role: 'admin',
      });
      navigate('/admin', { replace: true });
      return;
    }

    // Check localStorage users
    const users = getUsers();
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (!foundUser) {
      setError('Invalid username or password.');
      return;
    }

    if (foundUser.password !== trimmedPassword) {
      setError('Invalid username or password.');
      return;
    }

    setSession({
      userId: foundUser.id,
      username: foundUser.username,
      displayName: foundUser.displayName,
      role: foundUser.role,
    });

    if (foundUser.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/blogs', { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            WriteSpace
          </Link>
          <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Get Started
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;