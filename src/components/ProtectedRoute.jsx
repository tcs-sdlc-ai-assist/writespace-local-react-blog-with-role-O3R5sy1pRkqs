import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../utils/auth';

/**
 * Route guard component that checks for an active session and enforces role-based access.
 * @param {Object} props
 * @param {string} [props.role] - Required role to access the route ("admin" or "user").
 * @param {React.ReactNode} [props.children] - Optional children to render instead of Outlet.
 * @returns {JSX.Element}
 */
function ProtectedRoute({ role, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && session.role !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']),
  children: PropTypes.node,
};

export default ProtectedRoute;