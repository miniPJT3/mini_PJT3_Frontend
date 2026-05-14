import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, userInfo } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && userInfo && !allowedRoles.includes(userInfo.role)) {
      alert("해당 페이지에 접근할 권한이 없습니다.");
      
      // 🥊 navigate(-1) 대신 document.referrer(이전 주소)로 새로고침하며 이동
      if (document.referrer && document.referrer.includes(window.location.host)) {
        window.location.href = document.referrer; 
      } else {
        // 이전 기록이 없으면 그냥 각자의 홈으로 보냄
        const homePath = userInfo.role === 'ADMIN' ? '/admin/dashboard' : 
                         userInfo.role === 'SELLER' ? '/seller/dashboard' : '/user/home';
        window.location.href = homePath;
      }
    }
  }, [isLoggedIn, userInfo, allowedRoles]);

  // 1. 아예 로그인이 안 된 상태면 로그인으로 (이건 유지하는 게 좋습니다)
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 2. 권한 확인 중이거나 권한이 없는 경우, 화면을 일단 비워둠 (useEffect가 처리)
  if (!userInfo || !allowedRoles.includes(userInfo.role)) {
    return null; 
  }

  // 3. 권한이 맞으면 정상 렌더링
  return <Outlet />;
};

export default ProtectedRoute;