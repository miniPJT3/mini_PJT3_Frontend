import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowLeft, Activity } from 'lucide-react';

const Simulator = () => {
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState(0);
  const [email, setEmail] = useState(''); // 이메일 상태 추가

  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, success: 0, fail: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    if (!account || !email) {
      alert("계좌번호와 이메일을 모두 입력해주세요.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await axios.post('http://localhost:8080/api/simulator/validate', {
        accountNumber: account,
        amount: amount,
        email: email // 이메일 데이터 추가 전송
      });

      const { status, message } = response.data;
      const isActuallySuccess = (status === 'SUCCESS');

      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        account: account,
        amount: amount,
        status: isActuallySuccess ? 'success' : 'fail',
        message: message
      };

      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        success: isActuallySuccess ? prev.success + 1 : prev.success,
        fail: isActuallySuccess ? prev.fail : prev.fail + 1
      }));
      setLogs([newLog, ...logs]);

    } catch (error) {
      let errorMessage = "서버 통신 오류가 발생했습니다.";

      // 403 에러(Forbidden) 처리: 이메일 불일치 케이스
      if (error.response && error.response.status === 403) {
        errorMessage = "❌ 권한 오류: 계좌 소유자 정보(이메일)가 일치하지 않습니다.";
      }

      const errorLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        account: account,
        amount: amount,
        status: 'fail',
        message: errorMessage
      };

      setLogs([errorLog, ...logs]);
      setStats(prev => ({ ...prev, total: prev.total + 1, fail: prev.fail + 1 }));
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white min-h-screen">
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-all mb-3"
      >
        <ArrowLeft size={18} />
        보안 관제 센터로 돌아가기
      </Link>
      <h1 className="text-2xl font-bold mb-6">⚡ 입금 시뮬레이터 (보안 검증 모드)</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="font-bold mb-4">입금 정보 입력</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium">입금자 이메일 (Member Email)</label>
              <input
                type="email"
                placeholder="가입 시 사용한 이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-red-400 outline-none mb-2"
              />

              <label className="block text-sm font-medium">가상계좌 번호</label>
              <input
                type="text"
                placeholder="예: 1234-5678-..."
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="block text-sm font-medium">입금 금액 (원)</label>
              <input
                type="text" // number에서 text로 변경 (화살표 제거)
                inputMode="numeric" // 모바일에서 숫자 키패드 활성화
                placeholder="입금할 금액을 입력하세요"
                value={amount === 0 ? '' : amount} // 0일 때 빈 칸으로 표시
                onChange={(e) => {
                  const value = e.target.value;
                  // 숫자만 입력 가능하도록 정규식 처리
                  if (/^\d*$/.test(value)) {
                    setAmount(value === '' ? 0 : Number(value));
                  }
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              onClick={handleDeposit}
              disabled={isProcessing}
              className={`w-full mt-6 p-3 rounded-lg text-white font-bold transition-colors ${isProcessing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isProcessing ? '보안 검사 중...' : '💸 입금 이벤트 발생'}
            </button>
          </div>
        </div>

        <div>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full">
            <h3 className="font-bold mb-4">시뮬레이션 결과</h3>
            <div className="flex gap-4 mb-6 text-center">
              <div className="flex-1 bg-white p-3 rounded shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500">총 시도</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
              <div className="flex-1 bg-white p-3 rounded shadow-sm border border-gray-100 text-green-600">
                <p className="text-xs text-gray-500">성공</p>
                <p className="text-xl font-bold">{stats.success}</p>
              </div>
              <div className="flex-1 bg-white p-3 rounded shadow-sm border border-gray-100 text-red-600">
                <p className="text-xs text-gray-500">실패</p>
                <p className="text-xl font-bold">{stats.fail}</p>
              </div>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[400px]">
              {logs.length === 0 && <p className="text-center text-gray-400 py-10">테스트 로그가 없습니다.</p>}
              {logs.map(log => (
                <div key={log.id} className={`p-3 rounded border transition-all ${log.status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-bold">
                      {log.status === 'success' ? '✅ 검증 성공' : '❌ 검증 실패'}
                    </p>
                    <span className="text-[10px] text-gray-400">{log.time}</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-700 font-medium whitespace-pre-wrap">
                    {log.message}
                  </p>
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