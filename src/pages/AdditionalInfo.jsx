import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const AdditionalInfo = () => {
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('USER'); // 기본값: 일반 사용자
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthStore(); // 정보 업데이트 후 스토어 갱신용

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  백엔드 MemberController의 PATCH API 호출
      const response = await axios.patch(
        '/api/member/additional-info',
        { 
          phone: phone, 
          role: role 
        },
        { 
          withCredentials: true // JWT 쿠키를 함께 전송하여 본인 확인
        }
      );

      if (response.status === 200) {
        alert("회원가입이 완료되었습니다!");
        
        // Zustand 스토어 업데이트 (선택 사항: 업데이트된 유저 정보를 다시 저장)
        // 백엔드 응답에 업데이트된 데이터가 포함되어 있다면 login(response.data) 호출
        
        // 역할에 따른 페이지 이동
        if (role === 'SELLER') {
          navigate('/seller/dashboard');
        } else {
          navigate('/user/home');
        }
      }
    } catch (error) {
      console.error("추가 정보 저장 실패:", error);
      alert("정보 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">추가 정보 입력</h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          안전한 거래를 위해 추가 정보를 입력해주세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 전화번호 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* 역할 선택 (라디오 버튼 스타일) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              회원 유형 선택
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('USER')}
                className={`py-3 rounded-lg border font-medium transition-all ${
                  role === 'USER'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                일반 사용자
              </button>
              <button
                type="button"
                onClick={() => setRole('SELLER')}
                className={`py-3 rounded-lg border font-medium transition-all ${
                  role === 'SELLER'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-600'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                판매자
              </button>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
              loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? '저장 중...' : '가입 완료하기'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdditionalInfo;