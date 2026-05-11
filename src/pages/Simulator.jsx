import React, { useState } from 'react';

const Simulator = () => {
  // 입력 필드 상태 관리
  const [account, setAccount] = useState('1234-5678-9012-3456');
  const [amount, setAmount] = useState(150000);
  const [depositor, setDepositor] = useState('홍길동');
  
  //결과 및 로그 상태 관리
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, fail: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  //핵심 로직: 입금 이벤트 발생
  const handleDeposit = () => {
    setIsProcessing(true);
    
    // 실제 서버가 처리하는 것처럼 보이게 1초 뒤 실행
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        account: account,
        amount: amount,
        status: 'success'
      };

      // 주문 금액 불일치 체크 (예시: 15만원이 아니면 실패)
      if (amount !== 150000) {
        alert("금액 불일치: 주문 금액과 입금 금액이 다릅니다.");
        newLog.status = 'fail';
        setStats(prev => ({ ...prev, total: prev.total + 1, fail: prev.fail + 1 }));
      } 
      //중복 입금 체크 (이미 로그에 같은 계좌가 있는 경우)
      else if (logs.some(log => log.account === account && log.status === 'success')) {
        alert("중복 결제 방지: 이미 입금이 완료된 계좌입니다.");
        setIsProcessing(false);
        return; // 리스트에 추가하지 않고 종료
      }
      else {
        newLog.status = 'success';
        setStats(prev => ({ ...prev, total: prev.total + 1, success: prev.success + 1 }));
      }

      setLogs([newLog, ...logs]);
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">⚡ 입금 시뮬레이터</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold mb-4">입금 정보 입력</h3>
            <div className="space-y-3">
              <label className="block text-sm">가상계좌 번호</label>
              <input 
                type="text" 
                value={account} 
                onChange={(e) => setAccount(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <label className="block text-sm">입금 금액 (원)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <button 
              onClick={handleDeposit}
              disabled={isProcessing}
              className={`w-full mt-6 p-3 rounded-lg text-white font-bold ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isProcessing ? '입금 처리 중...' : '💸 입금 이벤트 발생'}
            </button>
          </div>
        </div>

        
        <div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full">
            <h3 className="font-bold mb-4">시뮬레이션 결과</h3>
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-white p-3 rounded shadow-sm">
                <p className="text-xs text-gray-500">총 시도</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <div className="flex-1 bg-white p-3 rounded shadow-sm text-green-600">
                <p className="text-xs text-gray-500">성공</p>
                <p className="text-xl font-bold">{stats.success}</p>
              </div>
              <div className="flex-1 bg-white p-3 rounded shadow-sm text-red-600">
                <p className="text-xs text-gray-500">실패</p>
                <p className="text-xl font-bold">{stats.fail}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className={`p-3 rounded border ${log.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-sm font-medium">
                    {log.status === 'success' ? '✅ 입금 성공' : '❌ 입금 실패'}: {log.amount.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500">{log.time} | {log.account}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;