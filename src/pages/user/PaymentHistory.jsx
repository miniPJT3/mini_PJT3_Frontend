import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // 테스트용 가짜 데이터
  const [history] = useState([
    {
      id: "PAY001",
      orderNo: "ORD1714567890123",
      product: "프리미엄 헤드폰",
      price: 150000,
      bank: "KB국민은행: 1234-5678-9012-3456",
      orderDate: "2026. 5. 6. 오후 2:30:00",
      completeDate: "2026. 5. 6. 오후 2:45:00",
      status: "결제완료"
    },
    {
      id: "PAY003",
      orderNo: "ORD1714545678901",
      product: "게이밍 마우스",
      price: 65000,
      bank: "우리은행: 9012-3456-7890-2345",
      orderDate: "2026. 5. 7. 오전 9:15:00",
      status: "입금대기"
    },
    {
      id: "PAY004",
      orderNo: "ORD1714534567890",
      product: "웹캠 HD",
      price: 120000,
      bank: "하나은행: 3456-7890-1234-6789",
      orderDate: "2026. 5. 3. 오후 4:00:00",
      status: "만료"
    }
  ]);

  // 영수증 보기 함수
  const handleOpenReceipt = (item) => {
    setSelectedItem(item);
    setIsReceiptOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8 relative">
      {/* 페이지 헤더 */}
      <header className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <span className="text-2xl font-bold">🕒</span>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">결제 이력</h1>
          <p className="text-slate-500">과거 결제 내역을 확인하세요</p>
        </div>
      </header>

      {/* 결제 내역 리스트 */}
      <div className="space-y-6">
        {history.map((item) => (
          <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-xl font-bold text-slate-800">{item.product}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.status === '결제완료' ? 'bg-green-100 text-green-600' :
                    item.status === '입금대기' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-sm text-slate-500 font-medium space-y-1">
                  <p>주문번호: {item.orderNo}</p>
                  <p>{item.bank}</p>
                  <p>주문일시: {item.orderDate}</p>
                </div>
              </div>

              <div className="text-right space-y-4">
                <p className="text-3xl font-extrabold text-blue-600">{item.price.toLocaleString()}원</p>
                <div className="flex justify-end gap-2">
                  {item.status === '결제완료' && (
                    <button 
                      onClick={() => handleOpenReceipt(item)}
                      className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      영수증 보기
                    </button>
                  )}
                  {item.status === '입금대기' && (
                    <button 
                      onClick={() => navigate('/virtual-account', { state: item })}
                      className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      입금하러 가기
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 영수증 모달 (팝업) */}
      {isReceiptOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 relative border-t-8 border-green-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
              <h2 className="text-2xl font-bold text-slate-800">결제 영수증</h2>
              <p className="text-slate-400 text-sm">정상적으로 결제가 완료되었습니다.</p>
            </div>

            <div className="border-y border-dashed border-slate-200 py-4 space-y-3">
              <div className="flex justify-between text-sm"><span className="text-slate-500">상품명</span><span className="font-bold">{selectedItem.product}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">결제금액</span><span className="font-bold">{selectedItem.price.toLocaleString()}원</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">주문번호</span><span className="text-xs">{selectedItem.orderNo}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">완료일시</span><span className="text-xs">{selectedItem.completeDate}</span></div>
            </div>

            <button 
              onClick={() => setIsReceiptOpen(false)}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;