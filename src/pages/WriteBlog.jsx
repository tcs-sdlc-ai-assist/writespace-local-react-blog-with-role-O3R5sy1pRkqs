import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getSession } from '../utils/auth';
import { getPosts, savePosts } from '../utils/storage';

const MAX_CONTENT_LENGTH = 5000;

/**
 * Blog create and edit form page.
 * Create mode at '/blog/new', edit mode at '/blog/:id/edit'.
 * In edit mode, loads existing post and enforces ownership
 * (user can only edit own posts; admin can edit any).
 * Title and content fields with inline validation errors.
 * Character counter for content. Cancel returns to previous page.
 * On save, persists to localStorage via savePosts() and redirects to /blog/:id.
 * @returns {JSX.Element}
 */
function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(isEditMode);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === id);

      if (!post) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const isAdmin = session.role === 'admin';
      const isAuthor = session.userId === post.authorId;

      if (!isAdmin && !isAuthor) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
  }, [id, isEditMode, navigate, session]);

  function validate() {
    const newErrors = { title: '', content: '' };
    let valid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required.';
      valid = false;
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required.';
      valid = false;
    } else if (content.length > MAX_CONTENT_LENGTH) {
      newErrors.content = `Content must be ${MAX_CONTENT_LENGTH} characters or less.`;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const posts = getPosts();

    if (isEditMode) {
      const updatedPosts = posts.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            title: title.trim(),
            content: content.trim(),
          };
        }
        return p;
      });
      savePosts(updatedPosts);
      navigate(`/blog/${id}`, { replace: true });
    } else {
      const newPost = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        authorId: session.userId,
        authorName: session.displayName,
      };
      savePosts([...posts, newPost]);
      navigate(`/blog/${newPost.id}`, { replace: true });
    }
  }

  function handleCancel() {
    navigate(-1);
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
              The post you are trying to edit does not exist.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs', { replace: true })}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Post' : 'New Post'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isEditMode
              ? 'Update your post below.'
              : 'Share your thoughts with the community.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
        >
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your post title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) {
                  setErrors((prev) => ({ ...prev, content: '' }));
                }
              }}
              rows={12}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Write your post content here..."
            />
            <div className="flex items-center justify-between mt-1">
              {errors.content ? (
                <p className="text-sm text-red-600">{errors.content}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs ${
                  content.length > MAX_CONTENT_LENGTH
                    ? 'text-red-600'
                    : 'text-gray-400'
                }`}
              >
                {content.length}/{MAX_CONTENT_LENGTH}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              {isEditMode ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default WriteBlog;