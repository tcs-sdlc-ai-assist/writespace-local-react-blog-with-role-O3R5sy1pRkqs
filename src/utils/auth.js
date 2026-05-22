const SESSION_KEY = 'writespace_session';

/**
 * Retrieves the current session from localStorage.
 * @returns {Object|null} The session object, or null if not found or on error.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Saves a session object to localStorage.
 * @param {Object} session - The session object to store.
 * @param {string} session.userId - The user's unique ID.
 * @param {string} session.username - The user's username.
 * @param {string} session.displayName - The user's display name.
 * @param {string} session.role - The user's role ("admin" or "user").
 */
export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // silently fail if localStorage is unavailable
  }
}

/**
 * Clears the current session from localStorage.
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // silently fail if localStorage is unavailable
  }
}