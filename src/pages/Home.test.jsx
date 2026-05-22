import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { setSession, clearSession } from '../utils/auth';
import { savePosts } from '../utils/storage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const userSession = {
  userId: 'user-1',
  username: 'testuser',
  displayName: 'Test User',
  role: 'user',
};

const adminSession = {
  userId: 'admin',
  username: 'admin',
  displayName: 'Admin',
  role: 'admin',
};

const mockPosts = [
  {
    id: 'post-1',
    title: 'First Post',
    content: 'Content of the first post',
    createdAt: '2024-01-01T00:00:00.000Z',
    authorId: 'user-1',
    authorName: 'Test User',
  },
  {
    id: 'post-2',
    title: 'Second Post',
    content: 'Content of the second post',
    createdAt: '2024-01-03T00:00:00.000Z',
    authorId: 'user-2',
    authorName: 'Another User',
  },
  {
    id: 'post-3',
    title: 'Third Post',
    content: 'Content of the third post',
    createdAt: '2024-01-02T00:00:00.000Z',
    authorId: 'user-1',
    authorName: 'Test User',
  },
];

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/blogs']}>
      <Home />
    </MemoryRouter>
  );
}

describe('Home page', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe('rendering with posts', () => {
    it('renders the Dashboard heading', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders the welcome message with display name', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      expect(screen.getByText('Welcome back, Test User')).toBeInTheDocument();
    });

    it('renders all blog post titles', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
      expect(screen.getByText('Third Post')).toBeInTheDocument();
    });

    it('renders the New Post button', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      expect(screen.getByText('New Post')).toBeInTheDocument();
    });

    it('renders author names on blog cards', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      const testUserNames = screen.getAllByText('Test User');
      expect(testUserNames.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Another User')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('renders empty state message when no posts exist', () => {
      setSession(userSession);
      savePosts([]);
      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('renders the empty state description text', () => {
      setSession(userSession);
      savePosts([]);
      renderHome();

      expect(
        screen.getByText('Be the first to write something! Share your thoughts with the community.')
      ).toBeInTheDocument();
    });

    it('renders the Write Your First Post CTA in empty state', () => {
      setSession(userSession);
      savePosts([]);
      renderHome();

      expect(screen.getByText('Write Your First Post')).toBeInTheDocument();
    });

    it('renders the no posts emoji icon', () => {
      setSession(userSession);
      savePosts([]);
      renderHome();

      expect(screen.getByRole('img', { name: 'No posts' })).toBeInTheDocument();
    });

    it('does not render blog cards in empty state', () => {
      setSession(userSession);
      savePosts([]);
      renderHome();

      expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    });
  });

  describe('sorting (newest first)', () => {
    it('renders posts sorted by newest first', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      const postTitles = screen.getAllByRole('link').filter((link) => {
        const text = link.textContent;
        return text === 'First Post' || text === 'Second Post' || text === 'Third Post';
      });

      const titleTexts = postTitles.map((el) => el.textContent);

      expect(titleTexts.indexOf('Second Post')).toBeLessThan(titleTexts.indexOf('Third Post'));
      expect(titleTexts.indexOf('Third Post')).toBeLessThan(titleTexts.indexOf('First Post'));
    });
  });

  describe('edit icon visibility based on ownership', () => {
    it('shows edit icon on posts authored by the current user', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      expect(screen.getByLabelText('Edit First Post')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit Third Post')).toBeInTheDocument();
    });

    it('does not show edit icon on posts not authored by the current user', () => {
      setSession(userSession);
      savePosts(mockPosts);
      renderHome();

      expect(screen.queryByLabelText('Edit Second Post')).not.toBeInTheDocument();
    });

    it('shows edit icon on all posts when logged in as admin', () => {
      setSession(adminSession);
      savePosts(mockPosts);
      renderHome();

      expect(screen.getByLabelText('Edit First Post')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit Second Post')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit Third Post')).toBeInTheDocument();
    });
  });

  describe('New Post link', () => {
    it('renders the New Post link pointing to /blog/new', () => {
      setSession(userSession);
      savePosts([]);
      renderHome();

      const newPostLink = screen.getByText('New Post').closest('a');
      expect(newPostLink).toHaveAttribute('href', '/blog/new');
    });

    it('renders Write Your First Post link pointing to /blog/new in empty state', () => {
      setSession(userSession);
      savePosts([]);
      renderHome();

      const ctaLink = screen.getByText('Write Your First Post').closest('a');
      expect(ctaLink).toHaveAttribute('href', '/blog/new');
    });
  });

  describe('with single post', () => {
    it('renders a single blog card correctly', () => {
      setSession(userSession);
      savePosts([mockPosts[0]]);
      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.queryByText('No posts yet')).not.toBeInTheDocument();
    });
  });
});