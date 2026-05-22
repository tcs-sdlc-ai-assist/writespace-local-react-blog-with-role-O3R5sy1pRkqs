import { getSession, setSession, clearSession } from './auth';

describe('auth utilities', () => {
  const SESSION_KEY = 'writespace_session';

  const mockSession = {
    userId: 'user-123',
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

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns the parsed session object when a valid session exists', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(mockSession));

      const result = getSession();
      expect(result).toEqual(mockSession);
    });

    it('returns an admin session correctly', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminSession));

      const result = getSession();
      expect(result).toEqual(adminSession);
      expect(result.role).toBe('admin');
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      localStorage.setItem(SESSION_KEY, '{invalid json!!!');

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when localStorage contains an empty string', () => {
      localStorage.setItem(SESSION_KEY, '');

      const result = getSession();
      expect(result).toBeNull();
    });

    it('reads from the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getSession();
      expect(spy).toHaveBeenCalledWith(SESSION_KEY);
      spy.mockRestore();
    });
  });

  describe('setSession', () => {
    it('stores the session object as JSON in localStorage', () => {
      setSession(mockSession);

      const stored = localStorage.getItem(SESSION_KEY);
      expect(stored).toBe(JSON.stringify(mockSession));
    });

    it('stores an admin session correctly', () => {
      setSession(adminSession);

      const stored = localStorage.getItem(SESSION_KEY);
      const parsed = JSON.parse(stored);
      expect(parsed).toEqual(adminSession);
      expect(parsed.role).toBe('admin');
    });

    it('overwrites a previous session when called again', () => {
      setSession(mockSession);
      setSession(adminSession);

      const stored = localStorage.getItem(SESSION_KEY);
      const parsed = JSON.parse(stored);
      expect(parsed).toEqual(adminSession);
    });

    it('writes to the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      setSession(mockSession);
      expect(spy).toHaveBeenCalledWith(SESSION_KEY, JSON.stringify(mockSession));
      spy.mockRestore();
    });

    it('does not throw when localStorage throws an error', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => setSession(mockSession)).not.toThrow();
      spy.mockRestore();
    });
  });

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      localStorage.setItem(SESSION_KEY, JSON.stringify(mockSession));

      clearSession();

      const stored = localStorage.getItem(SESSION_KEY);
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('removes the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'removeItem');
      clearSession();
      expect(spy).toHaveBeenCalledWith(SESSION_KEY);
      spy.mockRestore();
    });

    it('results in getSession returning null', () => {
      setSession(mockSession);
      expect(getSession()).toEqual(mockSession);

      clearSession();
      expect(getSession()).toBeNull();
    });

    it('does not throw when localStorage throws an error', () => {
      const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });

      expect(() => clearSession()).not.toThrow();
      spy.mockRestore();
    });
  });

  describe('round-trip integration', () => {
    it('can set, get, and clear a session in sequence', () => {
      expect(getSession()).toBeNull();

      setSession(mockSession);
      expect(getSession()).toEqual(mockSession);

      setSession(adminSession);
      expect(getSession()).toEqual(adminSession);

      clearSession();
      expect(getSession()).toBeNull();
    });
  });
});