import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, userInfo } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const alertShown = useRef(false);

  useEffect(() => {
    if (isLoggedIn && allowedRoles && !allowedRoles.includes(userInfo?.role)) {
      if (alertShown.current) return;

      alert("접근 권한이 없습니다!");
      alertShown.current = true;

      // 🥊 [핵심 로직] 이동하기 전 페이지로 복귀 시도
      // window.history.state가 있고 index가 0보다 크면 '뒤로가기'가 가능하다는 뜻입니다.
      const canGoBack = window.history.length > 1;

      if (canGoBack) {
        navigate(-1); // 🥊 바로 전 페이지로 슝!
      } else {
        // 만약 새 탭에서 바로 주소를 쳐서 들어와서 뒤로 갈 곳이 없다면?
        // 그때만 어쩔 수 없이 각자의 메인으로 보냅니다.
        let redirectPath = '/user/home';
        if (userInfo?.role === 'SELLER') redirectPath = '/seller/dashboard';
        if (userInfo?.role === 'ADMIN') redirectPath = '/admin/dashboard';
        
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isLoggedIn, userInfo, allowedRoles, navigate]);

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userInfo?.role)) {
    return null; 
  }

  return children;
};

export default ProtectedRoute;