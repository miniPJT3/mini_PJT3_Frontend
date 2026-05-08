import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  // 회원가입에 필요한 6가지 필수 항목 상태 관리
  const [formData, setFormData] = useState({
    loginId: '', 
    password: '', 
    name: '', 
    email: '', 
    phone: '', 
    role: 'USER'
  });

  const handleJoin = async () => {
    // 필수 값 입력 여부 확인
    if (!formData.loginId || !formData.password || !formData.name || !formData.email) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    try {
      // 백엔드 AuthController의 /api/auth/join으로 데이터 전송
      await axios.post('/api/auth/join', formData);
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      navigate('/login'); // 회원가입 성공 시 로그인 페이지로 리다이렉트
    } catch (error) {
      // 백엔드에서 던지는 에러 메시지 처리
      const errorMsg = error.response?.data || '회원가입 중 에러가 발생했습니다.';
      alert(errorMsg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[90vh]">
      {/* 영상의 로그인 카드와 통일감을 주는 3xl 라운드 카드 디자인 */}
      <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">새 계정 만들기</h2>
          <p className="text-gray-400 mt-2 text-sm">가상계좌 결제 시스템의 회원이 되어보세요</p>
        </div>
        
        {/* 사용자/판매자 권한 선택 버튼 그룹 */}
        <div className="flex gap-2 mb-8">
          {(['USER', 'SELLER'].map((r) => (
            <button
              key={r}
              onClick={() => setFormData({...formData, role: r})}
              className={`flex-1 py-3 rounded-xl font-bold transition-all duration-200 ${
                formData.role === r 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
            >
              {r === 'USER' ? '일반 사용자' : '판매자'}
            </button>
          )))}
        </div>

        <div className="grid grid-cols-1 gap-5">
          {/* 입력 필드 레이아웃: 라벨과 인풋 조합 */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">이메일 주소</label>
            <input 
              type="email" 
              placeholder="example@email.com" 
              onChange={(e)=>setFormData({...formData, email: e.target.value})} 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">아이디</label>
            <input 
              type="text" 
              placeholder="사용할 아이디 입력" 
              onChange={(e)=>setFormData({...formData, loginId: e.target.value})} 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">비밀번호</label>
            <input 
              type="password" 
              placeholder="8자 이상 입력" 
              onChange={(e)=>setFormData({...formData, password: e.target.value})} 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">이름(닉네임)</label>
            <input 
              type="text" 
              placeholder="실명 또는 활동명" 
              onChange={(e)=>setFormData({...formData, name: e.target.value})} 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 ml-1">전화번호</label>
            <input 
              type="tel" 
              placeholder="010-1234-5678" 
              onChange={(e)=>setFormData({...formData, phone: e.target.value})} 
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none" 
            />
          </div>

          <button 
            onClick={handleJoin} 
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            가입하기
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          이미 계정이 있으신가요? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">로그인 페이지로</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;