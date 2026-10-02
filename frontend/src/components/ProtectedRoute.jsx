import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ currentUser, allowedRole, children }) => {
  // If not logged in, redirect to Login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Role Protection
  if (allowedRole && currentUser.role !== allowedRole) {
    if (currentUser.role === 'admin') {
      return <Navigate to="/admin-dashboard" replace />;
    } else {
      return <Navigate to="/employee-dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
