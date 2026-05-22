import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { getSession, setSession, clearSession } from '../utils/auth';
import { saveUsers, getUsers } from '../utils/storage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <LoginPage />
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe('form rendering', () => {
    it('renders the login form with username and password fields', () => {
      renderLoginPage();

      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('renders the WriteSpace logo link', () => {
      renderLoginPage();

      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
    });

    it('renders a link to the register page', () => {
      renderLoginPage();

      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });

    it('renders the sign in subtitle text', () => {
      renderLoginPage();

      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });
  });

  describe('validation', () => {
    it('displays error when submitting with empty fields', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('displays error when submitting with only username', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('displays error when submitting with only password', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });

    it('displays error when submitting with whitespace-only fields', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), '   ');
      await user.type(screen.getByLabelText('Password'), '   ');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
    });
  });

  describe('successful login with hard-coded admin', () => {
    it('logs in with admin credentials and navigates to /admin', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'admin123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
      expect(session.username).toBe('admin');
      expect(session.displayName).toBe('Admin');
      expect(session.role).toBe('admin');
    });

    it('logs in with admin credentials case-insensitively', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'Admin');
      await user.type(screen.getByLabelText('Password'), 'admin123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });
  });

  describe('successful login with localStorage user', () => {
    it('logs in with a registered user and navigates to /blogs', async () => {
      const testUser = {
        id: 'user-123',
        displayName: 'Test User',
        username: 'testuser',
        password: 'password123',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      saveUsers([testUser]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'testuser');
      await user.type(screen.getByLabelText('Password'), 'password123');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });

      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.userId).toBe('user-123');
      expect(session.username).toBe('testuser');
      expect(session.displayName).toBe('Test User');
      expect(session.role).toBe('user');
    });

    it('logs in with a registered admin user and navigates to /admin', async () => {
      const adminUser = {
        id: 'admin-user-1',
        displayName: 'Admin User',
        username: 'adminuser',
        password: 'adminpass',
        role: 'admin',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      saveUsers([adminUser]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'adminuser');
      await user.type(screen.getByLabelText('Password'), 'adminpass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('logs in with username case-insensitively for localStorage users', async () => {
      const testUser = {
        id: 'user-456',
        displayName: 'Jane Doe',
        username: 'janedoe',
        password: 'janepass',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      saveUsers([testUser]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'JaneDoe');
      await user.type(screen.getByLabelText('Password'), 'janepass');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  describe('failed login', () => {
    it('displays error for non-existent username', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'nonexistent');
      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('displays error for wrong password on existing user', async () => {
      const testUser = {
        id: 'user-789',
        displayName: 'Bob Smith',
        username: 'bobsmith',
        password: 'correctpassword',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z',
      };
      saveUsers([testUser]);

      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'bobsmith');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('displays error for wrong admin password', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'admin');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();
    });

    it('does not navigate on failed login', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'nonexistent');
      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(mockNavigate).not.toHaveBeenCalledWith('/blogs', expect.anything());
      expect(mockNavigate).not.toHaveBeenCalledWith('/admin', expect.anything());
    });
  });

  describe('redirect for already-authenticated users', () => {
    it('redirects admin session to /admin', () => {
      setSession({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/admin', { replace: true });
    });

    it('redirects user session to /blogs', () => {
      setSession({
        userId: 'user-123',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });

      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  describe('error clearing', () => {
    it('clears previous error when submitting again', async () => {
      const user = userEvent.setup();
      renderLoginPage();

      await user.type(screen.getByLabelText('Username'), 'nonexistent');
      await user.type(screen.getByLabelText('Password'), 'somepassword');
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Invalid username or password.')).toBeInTheDocument();

      await user.clear(screen.getByLabelText('Username'));
      await user.clear(screen.getByLabelText('Password'));
      await user.click(screen.getByRole('button', { name: 'Sign In' }));

      expect(screen.getByText('Please enter both username and password.')).toBeInTheDocument();
      expect(screen.queryByText('Invalid username or password.')).not.toBeInTheDocument();
    });
  });
});