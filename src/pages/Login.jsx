import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">로그인</h2>
        <form className="space-y-4">
          <input type="text" placeholder="아이디" className="w-full p-3 border rounded-lg" />
          <input type="password" placeholder="비밀번호" className="w-full p-3 border rounded-lg" />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all">
            로그인하기
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          계정이 없으신가요? <Link to="/register" className="text-indigo-600 font-bold">회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; // 🌟 필수!