import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  // 구글 로그인 버튼 클릭 시 실행될 함수
  const handleGoogleLogin = () => {
    // 백엔드(Spring Boot)의 OAuth2 인증 시작 주소입니다.
    // 8080 포트에서 실행 중인 백엔드로 직접 리다이렉트합니다.
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">로그인</h2>
        
        {/* 일반 로그인 폼 */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="아이디" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="password" placeholder="비밀번호" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all">
            로그인하기
          </button>
        </form>

        {/* 구분선 */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* 구글 로그인 버튼 추가 */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all mb-4"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" className="w-5 h-5" />
          구글로 로그인하기
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          계정이 없으신가요? <Link to="/register" className="text-indigo-600 font-bold">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;