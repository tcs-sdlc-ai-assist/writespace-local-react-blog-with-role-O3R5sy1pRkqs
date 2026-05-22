import { getPosts, savePosts, getUsers, saveUsers } from './storage';

describe('storage utilities', () => {
  const POSTS_KEY = 'writespace_posts';
  const USERS_KEY = 'writespace_users';

  const mockPosts = [
    {
      id: 'post-1',
      title: 'First Post',
      content: 'Hello world',
      createdAt: '2024-01-01T00:00:00.000Z',
      authorId: 'user-1',
      authorName: 'Test User',
    },
    {
      id: 'post-2',
      title: 'Second Post',
      content: 'Another post',
      createdAt: '2024-01-02T00:00:00.000Z',
      authorId: 'user-2',
      authorName: 'Another User',
    },
  ];

  const mockUsers = [
    {
      id: 'user-1',
      displayName: 'Test User',
      username: 'testuser',
      password: 'password123',
      role: 'user',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: 'user-2',
      displayName: 'Admin User',
      username: 'adminuser',
      password: 'admin456',
      role: 'admin',
      createdAt: '2024-01-02T00:00:00.000Z',
    },
  ];

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns the parsed posts array when valid data exists', () => {
      localStorage.setItem(POSTS_KEY, JSON.stringify(mockPosts));

      const result = getPosts();
      expect(result).toEqual(mockPosts);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem(POSTS_KEY, '{invalid json!!!');

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains an empty string', () => {
      localStorage.setItem(POSTS_KEY, '');

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('reads from the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getPosts();
      expect(spy).toHaveBeenCalledWith(POSTS_KEY);
      spy.mockRestore();
    });

    it('returns a single post correctly', () => {
      const singlePost = [mockPosts[0]];
      localStorage.setItem(POSTS_KEY, JSON.stringify(singlePost));

      const result = getPosts();
      expect(result).toEqual(singlePost);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('post-1');
    });
  });

  describe('savePosts', () => {
    it('stores the posts array as JSON in localStorage', () => {
      savePosts(mockPosts);

      const stored = localStorage.getItem(POSTS_KEY);
      expect(stored).toBe(JSON.stringify(mockPosts));
    });

    it('stores an empty array correctly', () => {
      savePosts([]);

      const stored = localStorage.getItem(POSTS_KEY);
      expect(stored).toBe('[]');
    });

    it('overwrites previous posts when called again', () => {
      savePosts(mockPosts);
      const newPosts = [mockPosts[0]];
      savePosts(newPosts);

      const stored = localStorage.getItem(POSTS_KEY);
      const parsed = JSON.parse(stored);
      expect(parsed).toEqual(newPosts);
      expect(parsed).toHaveLength(1);
    });

    it('writes to the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      savePosts(mockPosts);
      expect(spy).toHaveBeenCalledWith(POSTS_KEY, JSON.stringify(mockPosts));
      spy.mockRestore();
    });

    it('does not throw when localStorage throws an error', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => savePosts(mockPosts)).not.toThrow();
      spy.mockRestore();
    });
  });

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns the parsed users array when valid data exists', () => {
      localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));

      const result = getUsers();
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem(USERS_KEY, 'not valid json{{{');

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains an empty string', () => {
      localStorage.setItem(USERS_KEY, '');

      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('reads from the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'getItem');
      getUsers();
      expect(spy).toHaveBeenCalledWith(USERS_KEY);
      spy.mockRestore();
    });

    it('returns users with correct role values', () => {
      localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));

      const result = getUsers();
      expect(result[0].role).toBe('user');
      expect(result[1].role).toBe('admin');
    });
  });

  describe('saveUsers', () => {
    it('stores the users array as JSON in localStorage', () => {
      saveUsers(mockUsers);

      const stored = localStorage.getItem(USERS_KEY);
      expect(stored).toBe(JSON.stringify(mockUsers));
    });

    it('stores an empty array correctly', () => {
      saveUsers([]);

      const stored = localStorage.getItem(USERS_KEY);
      expect(stored).toBe('[]');
    });

    it('overwrites previous users when called again', () => {
      saveUsers(mockUsers);
      const newUsers = [mockUsers[0]];
      saveUsers(newUsers);

      const stored = localStorage.getItem(USERS_KEY);
      const parsed = JSON.parse(stored);
      expect(parsed).toEqual(newUsers);
      expect(parsed).toHaveLength(1);
    });

    it('writes to the correct localStorage key', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem');
      saveUsers(mockUsers);
      expect(spy).toHaveBeenCalledWith(USERS_KEY, JSON.stringify(mockUsers));
      spy.mockRestore();
    });

    it('does not throw when localStorage throws an error', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => saveUsers(mockUsers)).not.toThrow();
      spy.mockRestore();
    });
  });

  describe('round-trip integration', () => {
    it('can save and retrieve posts in sequence', () => {
      expect(getPosts()).toEqual([]);

      savePosts(mockPosts);
      expect(getPosts()).toEqual(mockPosts);

      savePosts([]);
      expect(getPosts()).toEqual([]);
    });

    it('can save and retrieve users in sequence', () => {
      expect(getUsers()).toEqual([]);

      saveUsers(mockUsers);
      expect(getUsers()).toEqual(mockUsers);

      saveUsers([]);
      expect(getUsers()).toEqual([]);
    });

    it('posts and users do not interfere with each other', () => {
      savePosts(mockPosts);
      saveUsers(mockUsers);

      expect(getPosts()).toEqual(mockPosts);
      expect(getUsers()).toEqual(mockUsers);

      savePosts([]);
      expect(getUsers()).toEqual(mockUsers);

      saveUsers([]);
      expect(getPosts()).toEqual([]);
    });
  });
});