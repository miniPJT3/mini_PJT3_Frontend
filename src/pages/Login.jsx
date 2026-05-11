import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. 로그인 요청
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        loginId: loginId,
        password: password
      });

      // 2. 응답 데이터 확인
      const { role } = response.data;
      console.log("로그인 성공! 역할(Role):", role);

      // 3. App.jsx에 정의된 경로에 맞춰 이동
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'SELLER') {
        // App.jsx의 <Route path="/seller"><Route path="dashboard" ... /> 에 따라 이동
        navigate('/seller/dashboard');
      } else if (role === 'USER') {
        // ★중요★ App.jsx에서 사용자 홈은 /user/home 으로 설정되어 있습니다.
        navigate('/user/home'); 
      } else {
        console.warn("알 수 없는 권한:", role);
        navigate('/login');
      }
      
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">로그인</h2>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          <input 
            type="text" 
            placeholder="아이디" 
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required
          />
          <input 
            type="password" 
            placeholder="비밀번호" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required
          />
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all"
          >
            로그인하기
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        <button 
          type="button"
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