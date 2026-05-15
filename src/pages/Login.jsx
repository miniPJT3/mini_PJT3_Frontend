import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore(); 

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = () => {
    window.location.href = "/oauth2/authorization/google";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. 로그인 요청
      const response = await axios.post('/api/auth/login', {
        loginId: loginId,
        password: password
      }, {
        withCredentials: true 
      });

      const userData = response.data;
      console.log("로그인 성공! 유저 정보:", userData);

      login(userData);

      // 리다이렉트 분기 로직 대폭 단순화
      // Role이 GUEST(신규 가입자)인 경우만 추가 정보 페이지로 
      
      if (userData.role === 'GUEST') {
        navigate('/additional-info');
      } else {
        // 이미 가입된 사용자는 각 권한에 맞는 페이지로 즉시 이동
        switch (userData.role) {
          case 'ADMIN':
            navigate('/admin/dashboard');
            break;
          case 'SELLER':
            navigate('/seller/dashboard');
            break;
          case 'USER':
            navigate('/user/home');
            break;
          default:
            navigate('/');
        }
      }

    } catch (error) {
      console.error("로그인 실패:", error);
      const message = error.response?.data?.message || "아이디 또는 비밀번호가 일치하지 않습니다.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">로그인</h2>
          <p className="text-sm text-gray-500 mt-1">서비스 이용을 위해 로그인 해주세요.</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              placeholder="아이디"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
              isSubmitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중...' : '로그인하기'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-400">또는</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
        >
          <img 
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" 
            alt="Google" 
            className="w-5 h-5" 
          />
          구글로 로그인하기
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          계정이 없으신가요? <Link to="/register" className="text-indigo-600 font-bold hover:underline">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;