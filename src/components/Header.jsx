import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';

const Header = () => {
  const { isLoggedIn, logout, userInfo, login } = useAuthStore();
  const navigate = useNavigate();
  // 정보 로딩 중 상태 (새로고침 시 UI 깜빡임 방지)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // 이미 Zustand 스토어에 데이터가 있다면 중복 호출 방지
      if (isLoggedIn) {
        setIsLoading(false);
        return;
      }

      try {
        // 서버에서 현재 로그인된 유저 정보를 가져오는 API
        const response = await axios.get('/api/member/me', {
          withCredentials: true
        }); 
        
        if (response.data) {
          login(response.data); 
          console.log("세션 복구 성공:", response.data.name);
        }
      } catch (error) {
        // 401 Unauthorized 등이 발생하면 자연스럽게 로그인되지 않은 상태로 간주
        console.log("로그인 세션이 없거나 만료되었습니다.");
      } finally {
        setIsLoading(false); 
      }
    };

    fetchUser();
  }, [isLoggedIn, login]);

  const handleLogout = async () => {
    if (!window.confirm("로그아웃 하시겠습니까?")) return;
    
    try {
      //] 서버 측 로그아웃 처리 (쿠키 만료 요청)
      // POST 요청 시에도 쿠키를 함께 보내야 서버에서 어떤 사용자인지 알고 로그 남김
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error("서버 로그아웃 요청 실패:", err);
    } finally {
      //서버 응답 여부와 상관없이 클라이언트 상태는 무조건 초기화
      logout();
      alert("로그아웃 되었습니다.");
      navigate('/login');
    }
  };

  const getHomePath = () => {
    if (!isLoggedIn) return '/login';
    switch (userInfo?.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'SELLER': return '/seller/dashboard';
      case 'USER': return '/user/home';
      default: return '/';
    }
  };

  // 로딩 중 스켈레톤 UI (깜빡임 방지)
  if (isLoading) return (
    <header className="bg-white shadow-md mb-6 h-[72px] animate-pulse">
      <div className="container mx-auto h-full flex items-center px-4">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
      </div>
    </header>
  );

  return (
    <header className="bg-white shadow-md mb-6">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* 서비스 로고: 역할별 메인으로 이동 */}
        <Link to={getHomePath()} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="text-2xl font-bold text-indigo-700 tracking-tight">
            가상계좌 결제 시스템
            <span className="block text-xs font-normal text-gray-400">Virtual Account Payment</span>
          </div>
        </Link>
        
        <div className="flex gap-6 items-center">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
                {/* 관리자(ADMIN) 메뉴 */}
                {userInfo?.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="hover:text-indigo-600 transition-colors">홈</Link>
                )}

                {/* 판매자(SELLER) 메뉴 */}
                {userInfo?.role === 'SELLER' && (
                  <Link to="/seller/dashboard" className="hover:text-indigo-600 transition-colors">홈</Link>
                )}

                {/* 일반 사용자(USER) 메뉴 */}
                {userInfo?.role === 'USER' && (
                  <>
                    <Link to="/user/home" className="hover:text-indigo-600 transition-colors">홈</Link>
                    <Link to="/user/history" className="hover:text-indigo-600 transition-colors">나의 결제이력</Link>
                    <Link to="/user/payment" className="hover:text-indigo-600 transition-colors">주문하기</Link>
                  </>
                )}
              </div>

              {/* 유저 정보 및 로그아웃 버튼 */}
              <div className="flex items-center gap-4 border-l pl-6 ml-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{userInfo?.name || '사용자'}님</p>
                  <p className="text-[10px] text-indigo-500 font-semibold uppercase">{userInfo?.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-50 hover:bg-red-50 text-red-500 text-sm px-4 py-2 rounded-lg border border-red-100 transition-all font-bold"
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-2">로그인</Link>
              <Link to="/register" className="text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all">회원가입</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;