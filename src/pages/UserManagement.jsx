import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import UserRow from '../components/UserRow';
import { getSession } from '../utils/auth';
import { getUsers, saveUsers, getPosts, savePosts } from '../utils/storage';

const ADMIN_USERNAME = 'admin';

/**
 * Admin-only user management page at '/users'.
 * Displays a create user form with display name, username, password, and role fields.
 * Shows user table (desktop) / stacked cards (mobile) using UserRow components.
 * Includes the hard-coded admin in the displayed list.
 * Delete with window.confirm(). Hard-coded admin cannot be deleted.
 * Currently logged-in admin cannot delete own account.
 * @returns {JSX.Element}
 */
function UserManagement() {
  const navigate = useNavigate();
  const session = getSession();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    setUsers(getUsers());
  }, [navigate, session]);

  if (!session || session.role !== 'admin') {
    return null;
  }

  const hardCodedAdmin = {
    id: 'admin',
    displayName: 'Admin',
    username: ADMIN_USERNAME,
    role: 'admin',
    createdAt: new Date(0).toISOString(),
  };

  const allUsers = [hardCodedAdmin, ...users];

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (trimmedUsername.toLowerCase() === ADMIN_USERNAME) {
      setError('Username is already taken.');
      return;
    }

    const currentUsers = getUsers();
    const existingUser = currentUsers.find(
      (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
    );

    if (existingUser) {
      setError('Username is already taken.');
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: trimmedPassword,
      role: role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...currentUsers, newUser];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${newUser.displayName}" created successfully.`);
  }

  function handleDelete(userId) {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${userToDelete.displayName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    // Also remove posts by this user
    const posts = getPosts();
    const updatedPosts = posts.filter((p) => p.authorId !== userId);
    savePosts(updatedPosts);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage user accounts.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Create New User
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter display name"
                  autoComplete="name"
                />
              </div>

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
                  placeholder="Choose a username"
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
                  placeholder="Enter password"
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
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
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Users ({allUsers.length})
            </h2>
          </div>

          {allUsers.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onDelete={handleDelete}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <span
                className="inline-flex items-center justify-center w-16 h-16 rounded-full text-3xl bg-gray-100 text-gray-400 mb-4"
                role="img"
                aria-label="No users"
              >
                👥
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No users yet
              </h3>
              <p className="text-sm text-gray-500">
                Create a new user using the form above.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;