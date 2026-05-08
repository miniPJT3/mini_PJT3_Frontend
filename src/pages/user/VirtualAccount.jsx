import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VirtualAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Payment 페이지에서 전달받은 데이터 (없을 경우를 대비해 기본값 설정)
  const { 
    payUuid = "발급 오류", 
    maskedAccount = "000-000-00000", 
    depositedAmount = 0, 
    productName = "선택 상품 없음" 
  } = location.state || {};

  // 입금 확인 처리 함수(가상)
  const handleDepositConfirm = () => {
    // 1. 입금 완료 알림
    alert(`${productName} 입금이 완료되었습니다! 결제 내역으로 이동합니다.`);

    // 2. 결제 내역 페이지로 이동 (필요 시 홈 '/home'으로 변경 가능)
    navigate('/history');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* 상단 헤더: 성공 아이콘 */}
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="inline-block p-4 bg-blue-500 rounded-full mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h1 className="text-2xl font-bold">가상계좌 발급 완료</h1>
          <p className="opacity-80 mt-2">3시간 이내에 입금해 주시면 결제가 완료됩니다.</p>
        </div>

        {/* 상세 정보 섹션 */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center pb-4 border-bottom border-slate-50">
            <span className="text-slate-500">주문 상품</span>
            <span className="font-bold text-slate-800">{productName}</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 space-y-4 text-center">
            <div>
              <p className="text-sm text-slate-500 mb-1">입금하실 금액</p>
              <p className="text-3xl font-extrabold text-blue-600">
                {depositedAmount.toLocaleString()}원
              </p>
            </div>
            <hr className="border-slate-200" />
            <div>
              <p className="text-sm text-slate-500 mb-1">입금 계좌 (신한은행)</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl font-bold text-slate-800 tracking-wider">
                  {maskedAccount}
                </p>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(maskedAccount);
                    alert("계좌번호가 복사되었습니다.");
                  }}
                  className="text-xs bg-slate-200 px-2 py-1 rounded hover:bg-slate-300 transition-colors"
                >
                  복사
                </button>
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-400 bg-blue-50 p-4 rounded-xl">
            <ul className="list-disc ml-4 space-y-1">
              <li>입금자명은 본인 성함으로 입금이 가능합니다.</li>
              <li>정확한 금액을 입금하셔야 실시간 승인이 완료됩니다.</li>
              <li>발급 후 3시간이 지나면 해당 계좌는 만료됩니다.</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => navigate('/home')}
              className="flex-1 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              홈으로 이동
            </button>
            <button 
              onClick={handleDepositConfirm} // 수정된 함수 연결
              className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              입금 하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualAccount;