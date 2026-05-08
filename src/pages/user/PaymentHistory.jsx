import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../../api/paymentApi';
import { FiSearch, FiFilter, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. 검색어와 필터 상태를 위한 state 추가
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("전체 상태");

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

  const handleDirectDeposit = (item) => {
    const stateData = {
      payUuid: item.payUuid,
      maskedAccount: item.maskedAccount || "신한 110-123-456789",
      bankName: item.bankName,
      depositedAmount: item.depositedAmount,
      productName: item.productName
    };
    navigate('/user/virtual-account', { state: stateData });
  };

  const handleShowReceipt = (item) => {
    alert(`[영수증]\n상품명: ${item.productName}\n결제금액: ${item.depositedAmount.toLocaleString()}원\n상태: 결제 완료`);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PAID': return { label: '결제 완료', color: 'bg-green-50 text-green-600', icon: <FiCheckCircle className="w-4 h-4" /> };
      case 'PENDING': return { label: '입금 대기중', color: 'bg-amber-50 text-amber-600', icon: <FiClock className="w-4 h-4" /> };
      case 'CANCELLED': return { label: '결제 취소', color: 'bg-red-50 text-red-600', icon: <FiAlertCircle className="w-4 h-4" /> };
      default: return { label: status, color: 'bg-gray-100 text-gray-600', icon: <FiAlertCircle className="w-4 h-4" /> };
    }
  };


  const totalPaidAmount = historyList
    .filter(item => item.status === 'PAID')
    .reduce((sum, item) => sum + (item.depositedAmount || 0), 0);

  const completedCount = historyList.filter(item => item.status === 'PAID').length;
  const averageAmount = completedCount > 0 ? Math.round(totalPaidAmount / completedCount) : 0;

  // 2. 실시간 필터링 로직 (중요!)
  const filteredList = historyList.filter((item) => {
    // 검색어 체크 (상품명에 검색어가 포함되어 있는지)
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase());

    // 상태 체크 (전체 상태가 아니면 선택된 상태와 일치하는지)
    const matchesStatus =
      filterStatus === "전체 상태" ||
      (filterStatus === "결제 완료" && item.status === "PAID") ||
      (filterStatus === "입금 대기중" && item.status === "PENDING") ||
      (filterStatus === "만료됨" && item.status === "EXPIRED") ||
      (filterStatus === "결제 실패" && item.status === "FAILED");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 bg-slate-50 min-h-screen font-sans">
      {/* (1) 헤더 섹션: 타이틀 옆으로 버튼 이동 및 크기 확대 */}
      <div className="flex items-center justify-between mb-10"> {/* justify-between으로 양끝 배치 */}
        <div className="flex items-start gap-4">
          <span className="text-4xl mt-1 text-blue-600">🔄</span>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">결제 이력</h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">과거 결제 내역을 확인하세요</p>
          </div>
        </div>

        {/* 쇼핑 계속하기 버튼: 위치 이동 및 크기 확대(py-4, px-8, text-base) */}
        <button
          onClick={() => navigate('/user/home')}
          className="px-8 py-4 text-base font-black text-blue-600 bg-white border-2 border-blue-100 rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-sm flex items-center gap-2"
        >
          <span className="text-xl">🛍️</span> 쇼핑 계속하기
        </button>
      </div>

      {/* 상단 요약 카드: 요청하신 '멋있는 색' (그라데이션) 적용 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200 transition-transform hover:scale-[1.02]">
          <p className="text-blue-100 text-sm font-bold mb-2">총 결제 금액</p>
          <p className="text-4xl font-black">{totalPaidAmount.toLocaleString()}원</p>
          <p className="text-blue-200 text-xs mt-4 font-bold opacity-80 underline underline-offset-4">누적 합계</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-100 transition-transform hover:scale-[1.02]">
          <p className="text-emerald-50 text-sm font-bold mb-2">완료된 결제</p>
          <p className="text-4xl font-black">{completedCount}건</p>
          <p className="text-emerald-100 text-xs mt-4 font-bold opacity-80">성공적으로 완료</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-purple-100 transition-transform hover:scale-[1.02]">
          <p className="text-purple-50 text-sm font-bold mb-2">평균 결제 금액</p>
          <p className="text-4xl font-black">{averageAmount.toLocaleString()}원</p>
          <p className="text-purple-100 text-xs mt-4 font-bold opacity-80">1건당 평균</p>
        </div>
      </div>

      {/* (3) 검색 및 필터 바: 실시간 필터링 연결 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="상품명 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-2xl py-5 pl-16 pr-6 border border-slate-100 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white rounded-2xl py-5 pl-16 pr-10 border border-slate-100 shadow-sm text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium cursor-pointer"
          >
            <option>전체 상태</option>
            <option>결제 완료</option>
            <option>입금 대기중</option>
            <option>만료됨</option>
            <option>결제 실패</option>
          </select>
        </div>
      </div>

      {/* (4) 결제 이력 리스트: filteredList 기반 렌더링 */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold animate-pulse">내역 로드 중...</div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-black text-xl">검색 결과가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredList.map((item, index) => {
            const statusInfo = getStatusInfo(item.status);

            // 1. 거래일시 예쁘게 포맷팅 (T와 나노초 제거)
            const formattedDate = item.message
              ? new Date(item.message).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
              : '시간 정보 없음';

            return (
              <div key={index} className="bg-white rounded-[1.5rem] p-8 shadow-lg shadow-slate-200/50 border border-slate-100 transition-all hover:border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-slate-900 text-2xl tracking-tight">{item.productName}</h3>
                      <span className={`flex items-center gap-1.5 text-[11px] font-black px-3 py-1.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-slate-500 font-bold">
                        입금은행: <span className="text-slate-700 font-bold">{item.bankName || "정보 없음"}</span>
                      </p>
                      <p className="text-sm text-slate-500 font-bold">
                        계좌번호: <span className="text-slate-700 font-bold">{item.maskedAccount || "정보 없음"}</span>
                      </p>
                      <p className="text-sm text-slate-500 font-bold">
                        {/* 2. 가공된 formattedDate 적용 */}
                        거래일시: <span className="text-slate-400 font-medium">{formattedDate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-4">
                    <p className="text-4xl font-black text-blue-600 tracking-tighter">
                      {item.depositedAmount?.toLocaleString()}원
                    </p>

                    <div>
                      {item.status === 'PAID' && (
                        <button
                          onClick={() => handleShowReceipt(item)}
                          className="px-6 py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 active:scale-95"
                        >
                          🧾 영수증 보기
                        </button>
                      )}
                      {item.status === 'PENDING' && (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleDirectDeposit(item)}
                            className="px-6 py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                          >
                            지금 바로 입금하기
                          </button>
                          <button
                            onClick={() => alert(`입금 정보: [${item.bankName}] ${item.maskedAccount}`)}
                            className="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                          >
                            계좌 확인
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 푸터 안내 */}
      <div className="mt-12 p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
        <h4 className="text-slate-800 font-black mb-4 text-sm tracking-widest uppercase">Payment Info Notice</h4>
        <ul className="text-sm text-slate-400 space-y-3 font-medium">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> 가상계좌 입금은 발급 후 3시간 동안만 유효합니다.</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> 영수증은 결제 완료 상태에서만 확인 및 출력이 가능합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentHistory;