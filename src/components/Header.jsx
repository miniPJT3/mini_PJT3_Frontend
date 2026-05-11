import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Header = () => {
  const { isLoggedIn, logout, userInfo } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <header className="bg-white shadow-md mb-6">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* 로고: 클릭 시 홈(로그인)으로 이동 */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-2xl font-bold text-indigo-700 tracking-tight">
            가상계좌 결제 시스템
            <span className="block text-xs font-normal text-gray-400">Virtual Account Payment</span>
          </div>
        </Link>
        
        <div className="flex gap-6 items-center">
          {isLoggedIn ? (
            /*로그인 상태일 때 보여줄 메뉴 */
            <>
              <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
                <Link to="/" className="hover:text-indigo-600">홈</Link>
                <Link to="/order" className="hover:text-indigo-600">주문하기</Link>
                <Link to="/history" className="hover:text-indigo-600">결제 이력</Link>
              </div>

              {/* 사용자 정보 표시: 이름과 역할(Role) */}
              <div className="flex items-center gap-3 border-l pl-6 ml-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{userInfo?.name}님</p>
                  <p className="text-[10px] text-indigo-500 font-semibold uppercase">{userInfo?.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1 bg-gray-50 hover:bg-red-50 text-red-500 text-sm px-3 py-2 rounded-lg border border-red-100 transition-colors"
                >
                  <span className="font-bold">로그아웃</span>
                </button>
              </div>
            </>
          ) : (
            /* 로그아웃 상태일 때 보여줄 메뉴 */
            <div className="flex gap-3">
              <Link 
                to="/login" 
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 px-3 py-2"
              >
                로그인
              </Link>
              <Link 
                to="/register" 
                className="text-sm font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;