import { useState, useEffect } from 'react';
import axios from 'axios'; 
import { paymentApi } from '../../api/paymentApi'; 

const SellerPaymentApproval = ({ sellerId }) => {
  const [paymentList, setPaymentList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      // 🥊 [핵심 수정] axios.get 대신 우리가 만든 api를 사용하고 주소를 고칩니다.
      // 백엔드 컨트롤러 주소: /api/payments/seller/history
      const response = await paymentApi.getPendingList(); 
      setPaymentList(response.data);
    } catch (error) {
      console.error("❌ 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) fetchPayments();
  }, [sellerId]);

  // 🥊 데이터 분류: 대기중인 것과 승인된 것을 나눕니다.
  const pendingItems = paymentList.filter(item => item.status === 'DEPOSITED');
  const approvedItems = paymentList.filter(item => item.status === 'PAID');

  const handleApprove = async (payUuid) => {
    if (!window.confirm("실제 계좌에 입금된 것을 확인하셨습니까? 승인 시 결제가 최종 완료됩니다.")) return;
    try {
      await axios.post(`/api/payments/approve/${payUuid}`); 
      alert("성공적으로 승인되었습니다.");
      fetchPayments(); // 목록 새로고침 (상태가 PAID로 변하면서 아래 섹션으로 이동함)
    } catch (error) {
      alert("승인 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <section className="seller-filter-section" style={{ marginTop: '2rem' }}>
      {/* (1) 입금 확인 승인 대기 섹션 */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔔</span>
          <h2 className="text-2xl font-black text-slate-900">입금 확인 승인 대기</h2>
        </div>
        <p className="text-slate-500 mt-1">구매자가 입금 보고를 완료한 내역입니다.</p>
      </div>

      <div className="space-y-4 mb-12">
        {loading ? (
          <div className="text-center py-10 text-slate-400 font-bold animate-pulse">데이터 로딩 중...</div>
        ) : pendingItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-slate-200 text-slate-400 font-bold">
            현재 승인 대기 중인 내역이 없습니다. 🥊
          </div>
        ) : (
          pendingItems.map((item) => (
            <div key={item.payUuid} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex justify-between items-center hover:border-blue-300 transition-all">
              <div className="space-y-2">
                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">Deposited</span>
                <h3 className="font-black text-2xl text-slate-800">{item.productName || item.name}</h3>
                <p className="font-bold text-blue-600">{(item.totalAmount || item.depositedAmount || 0).toLocaleString()}원</p>
              </div>
              <button onClick={() => handleApprove(item.payUuid)} className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                입금 확인 승인
              </button>
            </div>
          ))
        )}
      </div>

      {/* (2) 🥊 승인 완료 내역 섹션 */}
      <hr className="border-slate-200 mb-10" />
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✅</span>
          <h2 className="text-2xl font-black text-slate-400">최근 승인 완료 내역</h2>
        </div>
      </div>

      <div className="space-y-4 opacity-70">
        {approvedItems.length === 0 ? (
          <p className="text-center py-10 text-slate-300 font-bold italic">아직 승인 완료된 내역이 없습니다.</p>
        ) : (
          approvedItems.map((item) => (
            <div key={item.payUuid} className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-200 flex justify-between items-center">
              <div>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">Paid</span>
                <h3 className="font-bold text-lg text-slate-600">{item.productName || item.name}</h3>
                <p className="text-sm text-slate-500">{(item.totalAmount || item.depositedAmount || 0).toLocaleString()}원</p>
              </div>
              <div className="text-emerald-600 font-black flex items-center gap-1">
                <span className="text-xl font-bold">✓</span> 승인 완료
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default SellerPaymentApproval;