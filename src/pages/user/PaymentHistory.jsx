import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../../api/paymentApi';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 로드 함수
  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await paymentApi.getHistory();
      setHistoryList(response.data);
    } catch (error) {
      console.error("내역 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // 이제 바로 입금 확인 API를 호출하지 않고, 가상계좌 상세 페이지로 데이터를 들고 이동합니다.
  const handleDirectDeposit = (item) => {
    // VirtualAccount 페이지가 필요로 하는 데이터 형식에 맞게 포장
    const stateData = {
      payUuid: item.payUuid,
      maskedAccount: item.maskedAccount || "신한 110-123-456789", // 계좌번호가 있다면 전달
      depositedAmount: item.depositedAmount,
      productName: item.productName
    };

    // navigate를 사용하여 '/user/virtual-account' 경로로 이동하면서 데이터를 전달합니다.
    navigate('/user/virtual-account', { state: stateData });
  };

  // 영수증 보기 핸들러 (차후 모달이나 페이지 연결)
  const handleShowReceipt = (item) => {
    alert(`[영수증]\n상품명: ${item.productName}\n결제금액: ${item.depositedAmount.toLocaleString()}원\n상태: 결제 완료`);
  };

  // 상태별 라벨 및 색상 가공
  const getStatusInfo = (status) => {
    switch (status) {
      case 'PAID': return { label: '결제 완료', color: 'bg-green-100 text-green-600' };
      case 'PENDING': return { label: '입금 대기중', color: 'bg-amber-100 text-amber-600' };
      case 'CANCELLED': return { label: '결제 취소', color: 'bg-red-100 text-red-600' };
      case 'FAILED': return { label: '결제 실패', color: 'bg-slate-100 text-slate-600' };
      default: return { label: status, color: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* 헤더 섹션 */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">결제 내역</h1>
          <p className="text-slate-500 mt-2">전체 주문 및 결제 상태를 확인하세요.</p>
        </div>
        <button
          onClick={() => navigate('/user/home')}
          className="px-5 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
        >
          쇼핑 계속하기
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 animate-pulse font-medium">
          내역을 불러오는 중입니다...
        </div>
      ) : historyList.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-200">
          <span className="text-6xl mb-6 block">🛒</span>
          <p className="text-slate-500 font-bold text-lg">결제 시도 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {historyList.map((item, index) => {
            const statusInfo = getStatusInfo(item.status);
            return (
              <div key={index} className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100 transition-all hover:shadow-lg hover:shadow-slate-100/50">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                      {item.productName.includes('마우스') ? '🖱️' : '🖥️'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-xl mb-1">{item.productName}</h3>
                      <p className="text-sm text-slate-400 font-medium">
                        {item.message || '최근 거래 내역'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">
                      {item.depositedAmount?.toLocaleString()}원
                    </p>
                    <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full mt-3 inline-block shadow-sm ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* 하단 액션 버튼 섹션 (지호님이 요청하신 조건부 렌더링 적용) */}
                <div className="pt-5 border-t border-slate-50 mt-2">

                  {/* 1. 결제 완료(PAID) 상태일 때만 '영수증 보기' 노출 */}
                  {item.status === 'PAID' && (
                    <button
                      onClick={() => handleShowReceipt(item)}
                      className="w-full py-4 bg-slate-50 text-slate-700 font-extrabold rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <span className="text-lg">🧾</span> 영수증 보기
                    </button>
                  )}

                  {/* 2. 결제 대기(PENDING) 상태일 때만 '결제하기' 노출 */}
                  {item.status === 'PENDING' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleDirectDeposit(item)}
                        className="flex-[2] py-4 bg-blue-600 text-white font-extrabold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
                      >
                        지금 바로 입금하기
                      </button>
                      <button
                        onClick={() => alert(`입금 계좌: ${item.maskedAccount || '신한 110-123-456789'}`)}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-extrabold rounded-2xl hover:bg-slate-200 transition-all"
                      >
                        계좌 확인
                      </button>
                    </div>
                  )}

                  {/* 3. 취소나 실패 상태일 때는 버튼 대신 안내 문구 */}
                  {(item.status === 'CANCELLED' || item.status === 'FAILED') && (
                    <p className="text-center text-sm text-slate-400 py-3 font-medium bg-slate-50 rounded-2xl">
                      이 주문은 처리가 중단되었거나 취소되었습니다.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 푸터 안내 */}
      <div className="mt-12 p-8 bg-slate-50 rounded-3xl border border-slate-100">
        <h4 className="text-slate-800 font-bold mb-3 text-sm">안내 사항</h4>
        <ul className="text-xs text-slate-400 space-y-2 list-disc ml-4">
          <li>가상계좌 입금은 발급 후 3시간 동안만 유효합니다.</li>
          <li>입금 확인 후 상품 배송은 영업일 기준 2~3일 소요됩니다.</li>
          <li>영수증은 결제 완료 상태에서만 확인 및 출력이 가능합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentHistory;