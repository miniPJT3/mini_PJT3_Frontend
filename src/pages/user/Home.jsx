import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
      {/* 상단 타이틀 섹션 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900">
          안전하고 편리한 <span className="text-blue-600">결제 경험</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          일회용 가상계좌로 안전하게 결제하고 내역을 관리하세요
        </p>
      </div>

      {/* 메인 이동 카드 섹션 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl px-4">
        
        {/* 1. 주문하기 카드 */}
        <div 
          onClick={() => navigate('/payment')}
          className="group cursor-pointer p-10 bg-white rounded-3xl border-2 border-slate-100 shadow-sm hover:border-blue-500 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 text-center space-y-6"
        >
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">🛒</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">주문 시작하기</h2>
            <p className="text-slate-500">원하는 상품을 선택하고<br/>가상계좌를 발급받습니다.</p>
          </div>
          <div className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full font-bold group-hover:bg-blue-700">
            바로가기
          </div>
        </div>

        {/* 2. 결제 내역 보기 카드 */}
        <div 
          onClick={() => navigate('/history')} // 이동할 경로는 프로젝트에 맞게 수정하세요
          className="group cursor-pointer p-10 bg-white rounded-3xl border-2 border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 text-center space-y-6"
        >
          <div className="text-6xl group-hover:scale-110 transition-transform duration-300">📋</div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">결제 내역 보기</h2>
            <p className="text-slate-500">이전 주문 내역과<br/>입금 상태를 확인합니다.</p>
          </div>
          <div className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full font-bold group-hover:bg-indigo-700">
            조회하기
          </div>
        </div>

      </div>

      {/* 푸터 영역 */}
      <footer className="border-t border-gray-100 w-full pt-12 pb-8 mt-10">
        <div className="text-center space-y-2">
          <p className="text-slate-400 text-sm">
            © 2026 Virtual Account Payment System. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-slate-500">
            <span>Current Role:</span>
            <span className="font-bold text-blue-600 uppercase">User</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;