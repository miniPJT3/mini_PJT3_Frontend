import { useState, useEffect } from 'react';
import axios from 'axios'; 

const SellerPaymentApproval = ({ sellerId }) => {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🥊 1. 목록 조회: 데이터 구조를 확인하기 위한 로그 추가
  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/payments/seller/${sellerId}/pending`);
      console.log("✅ 판매자 승인 대기 데이터:", response.data); // 브라우저 콘솔에서 데이터 구조 확인용
      setPendingList(response.data);
    } catch (error) {
      console.error("❌ 대기 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) fetchPendingPayments();
  }, [sellerId]);

  // 🥊 2. 승인 처리: @PostMapping("/api/payments/approve/{payUuid}")
  const handleApprove = async (payUuid) => {
    if (!window.confirm("실제 계좌에 입금된 것을 확인하셨습니까? 승인 시 결제가 최종 완료됩니다.")) return;
    
    try {
      await axios.post(`/api/payments/approve/${payUuid}`); 
      alert("성공적으로 승인되었습니다. 결제 이력에 기록됩니다.");
      fetchPendingPayments(); // 목록 새로고침
    } catch (error) {
      console.error("승인 오류:", error);
      alert("승인 처리 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <section className="seller-filter-section" style={{ marginTop: '2rem' }}>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔔</span>
          <h2 className="text-2xl font-black text-slate-900">입금 확인 승인 대기</h2>
        </div>
        <p className="text-slate-500 mt-1">구매자가 입금 보고를 완료한 내역입니다. 실제 입금 여부를 확인 후 승인 버튼을 눌러주세요.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-400 font-bold animate-pulse">데이터 로딩 중...</div>
        ) : pendingList.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200 text-slate-400">
            <p className="text-4xl mb-4">Empty</p>
            <p className="font-bold">현재 승인 대기 중인 내역이 없습니다. 🥊</p>
          </div>
        ) : (
          pendingList.map((item) => (
            <div key={item.payUuid} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-blue-300 transition-all">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Deposited</span>
                  <span className="text-slate-400 text-xs">UUID: {item.payUuid?.slice(0, 8)}...</span>
                </div>
                
                {/* 🥊 데이터 매핑 안전장치: productName 혹은 name 둘 다 체크 */}
                <h3 className="font-black text-2xl text-slate-800 tracking-tight">
                  {item.productName || item.name || "상품 정보 없음"}
                </h3>
                
                <div className="flex items-center gap-4 text-sm font-bold">
                  <p className="text-slate-500">
                    입금 금액: <span className="text-blue-600 text-lg">
                      {/* 🥊 totalAmount 혹은 depositedAmount 유연하게 대응 */}
                      {(item.totalAmount || item.depositedAmount || 0).toLocaleString()}원
                    </span>
                  </p>
                  {item.memberName && (
                    <p className="text-slate-400 border-l pl-4">구매자: {item.memberName}</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => handleApprove(item.payUuid)}
                className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
              >
                입금 확인 승인
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default SellerPaymentApproval;