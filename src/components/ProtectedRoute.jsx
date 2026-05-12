import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userInfo } = useAuthStore();

  console.log("ProtectedRoute: Checking access...");
  console.log("  isLoggedIn:", isLoggedIn);
  console.log("  userInfo:", userInfo);
  console.log("  allowedRoles:", allowedRoles);

  if (!isLoggedIn) {
    console.log("ProtectedRoute: Not logged in. Redirecting to /login.");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userInfo && !allowedRoles.includes(userInfo.role)) {
    console.log(`ProtectedRoute: Access Denied. User role '${userInfo.role}' not in allowed roles: ${allowedRoles}. Redirecting to /login.`);
    return <Navigate to="/login" replace />; // 임시로 로그인 페이지로 리다이렉트
  }

  console.log("ProtectedRoute: Access Granted.");
  return children;
};

export default ProtectedRoute;