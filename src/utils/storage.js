const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

/**
 * Retrieves all posts from localStorage.
 * @returns {Array<Object>} The array of post objects, or an empty array if not found or on error.
 */
export function getPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Saves an array of post objects to localStorage.
 * @param {Array<Object>} posts - The array of post objects to store.
 * @param {string} posts[].id - The post's unique ID.
 * @param {string} posts[].title - The post's title.
 * @param {string} posts[].content - The post's content.
 * @param {string} posts[].createdAt - The post's creation date (ISO8601).
 * @param {string} posts[].authorId - The post author's user ID.
 * @param {string} posts[].authorName - The post author's display name.
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch {
    // silently fail if localStorage is unavailable
  }
}

/**
 * Retrieves all users from localStorage.
 * @returns {Array<Object>} The array of user objects, or an empty array if not found or on error.
 */
export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Saves an array of user objects to localStorage.
 * @param {Array<Object>} users - The array of user objects to store.
 * @param {string} users[].id - The user's unique ID.
 * @param {string} users[].displayName - The user's display name.
 * @param {string} users[].username - The user's username.
 * @param {string} users[].password - The user's password (plain text).
 * @param {string} users[].role - The user's role ("admin" or "user").
 * @param {string} users[].createdAt - The user's creation date (ISO8601).
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // silently fail if localStorage is unavailable
  }
}