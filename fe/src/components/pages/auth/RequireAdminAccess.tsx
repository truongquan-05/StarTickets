import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAdminAccess = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const location = useLocation();

  if (!token || !userData) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const user = JSON.parse(userData);
  const roleId = user?.vai_tro_id;

  if (roleId === 2 || roleId === null) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default RequireAdminAccess;
