import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const Header = () => {
  const { isLoggedIn, logout, userInfo } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate('/login');
  };

  // 디버깅용: 콘솔에서 데이터가 어떻게 찍히는지 확인 (나중에 지우세요)
  console.log("로그인 여부:", isLoggedIn);
  console.log("유저 정보:", userInfo);

  return (
    <header className="bg-white shadow-md mb-6">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* 로고: 로그인 상태면 홈으로, 아니면 로그인창으로 */}
        <Link to={isLoggedIn ? "/user/home" : "/login"} className="flex items-center gap-2">
          <div className="text-2xl font-bold text-indigo-700 tracking-tight">
            가상계좌 결제 시스템
            <span className="block text-xs font-normal text-gray-400">Virtual Account Payment</span>
          </div>
        </Link>
        
        <div className="flex gap-6 items-center">
          {/* ⭐ isLoggedIn이 true일 때만 메뉴 노출 */}
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex gap-8 text-sm font-bold text-gray-600">
                {/* role이 'USER'인 경우만 메뉴 출력 */}
                {userInfo?.role === 'USER' && (
                  <>
                    <Link to="/user/history" className="hover:text-indigo-600 transition-colors">나의 결제이력</Link>
                    <Link to="/user/payment" className="hover:text-indigo-600 transition-colors">주문하기</Link>
                  </>
                )}
                
                {userInfo?.role === 'SELLER' && (
                  <Link to="/seller/dashboard" className="hover:text-indigo-600 transition-colors">판매 대시보드</Link>
                )}
              </div>

              {/* 유저 정보 및 로그아웃 버튼 */}
              <div className="flex items-center gap-4 border-l pl-6 ml-2">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">{userInfo?.name}님</p>
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
            /* isLoggedIn이 false일 때 */
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