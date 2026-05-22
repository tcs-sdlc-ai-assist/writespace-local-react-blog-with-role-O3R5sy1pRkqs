import React from 'react';
import { render, screen } from '@testing-library/react';
import Avatar, { getAvatar } from './Avatar';

describe('Avatar component', () => {
  describe('getAvatar', () => {
    describe('admin role', () => {
      it('returns a span with crown emoji for admin role', () => {
        const { container } = render(getAvatar('admin'));
        const span = container.querySelector('span');

        expect(span).toBeInTheDocument();
        expect(span).toHaveTextContent('👑');
      });

      it('applies violet styling classes for admin role', () => {
        const { container } = render(getAvatar('admin'));
        const span = container.querySelector('span');

        expect(span).toHaveClass('bg-violet-100');
        expect(span).toHaveClass('text-violet-700');
      });

      it('has correct aria-label for admin avatar', () => {
        render(getAvatar('admin'));
        const img = screen.getByRole('img', { name: 'admin avatar' });

        expect(img).toBeInTheDocument();
      });

      it('includes common layout classes for admin avatar', () => {
        const { container } = render(getAvatar('admin'));
        const span = container.querySelector('span');

        expect(span).toHaveClass('inline-flex');
        expect(span).toHaveClass('items-center');
        expect(span).toHaveClass('justify-center');
        expect(span).toHaveClass('w-8');
        expect(span).toHaveClass('h-8');
        expect(span).toHaveClass('rounded-full');
      });
    });

    describe('user role', () => {
      it('returns a span with book emoji for user role', () => {
        const { container } = render(getAvatar('user'));
        const span = container.querySelector('span');

        expect(span).toBeInTheDocument();
        expect(span).toHaveTextContent('📖');
      });

      it('applies indigo styling classes for user role', () => {
        const { container } = render(getAvatar('user'));
        const span = container.querySelector('span');

        expect(span).toHaveClass('bg-indigo-100');
        expect(span).toHaveClass('text-indigo-700');
      });

      it('has correct aria-label for user avatar', () => {
        render(getAvatar('user'));
        const img = screen.getByRole('img', { name: 'user avatar' });

        expect(img).toBeInTheDocument();
      });

      it('includes common layout classes for user avatar', () => {
        const { container } = render(getAvatar('user'));
        const span = container.querySelector('span');

        expect(span).toHaveClass('inline-flex');
        expect(span).toHaveClass('items-center');
        expect(span).toHaveClass('justify-center');
        expect(span).toHaveClass('w-8');
        expect(span).toHaveClass('h-8');
        expect(span).toHaveClass('rounded-full');
      });
    });

    describe('styling distinction', () => {
      it('admin and user avatars have different background classes', () => {
        const { container: adminContainer } = render(getAvatar('admin'));
        const { container: userContainer } = render(getAvatar('user'));

        const adminSpan = adminContainer.querySelector('span');
        const userSpan = userContainer.querySelector('span');

        expect(adminSpan).toHaveClass('bg-violet-100');
        expect(adminSpan).not.toHaveClass('bg-indigo-100');

        expect(userSpan).toHaveClass('bg-indigo-100');
        expect(userSpan).not.toHaveClass('bg-violet-100');
      });

      it('admin and user avatars have different text color classes', () => {
        const { container: adminContainer } = render(getAvatar('admin'));
        const { container: userContainer } = render(getAvatar('user'));

        const adminSpan = adminContainer.querySelector('span');
        const userSpan = userContainer.querySelector('span');

        expect(adminSpan).toHaveClass('text-violet-700');
        expect(adminSpan).not.toHaveClass('text-indigo-700');

        expect(userSpan).toHaveClass('text-indigo-700');
        expect(userSpan).not.toHaveClass('text-violet-700');
      });
    });
  });

  describe('Avatar component', () => {
    it('renders admin avatar when role prop is admin', () => {
      render(<Avatar role="admin" />);
      const img = screen.getByRole('img', { name: 'admin avatar' });

      expect(img).toBeInTheDocument();
      expect(img).toHaveTextContent('👑');
      expect(img).toHaveClass('bg-violet-100');
      expect(img).toHaveClass('text-violet-700');
    });

    it('renders user avatar when role prop is user', () => {
      render(<Avatar role="user" />);
      const img = screen.getByRole('img', { name: 'user avatar' });

      expect(img).toBeInTheDocument();
      expect(img).toHaveTextContent('📖');
      expect(img).toHaveClass('bg-indigo-100');
      expect(img).toHaveClass('text-indigo-700');
    });

    it('renders a single span element', () => {
      const { container } = render(<Avatar role="user" />);
      const spans = container.querySelectorAll('span');

      expect(spans).toHaveLength(1);
    });
  });
});