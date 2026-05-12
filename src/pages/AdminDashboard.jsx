import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Search, ShieldCheck, PlayCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import axios from 'axios'; // API 호출을 위해 axios 추가

// 초기 데이터
const initialLineData = [
  { time: '현재', threat: 0 }
];

const barData = [
  { name: '계좌', val: 0 },
  { name: '이름', val: 0 },
  { name: '이메일', val: 0 },
  { name: '전화번호', val: 0 },
];

const AdminDashboard = () => {
  // --- 상태 관리 ---
  const [showAlert, setShowAlert] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [securityLogs, setSecurityLogs] = useState([]);

  // 데이터 포맷 변환 공통 함수
  const formatLogData = (data) => ({
    id: data.id || Date.now(),
    time: new Date(data.createdAt).toLocaleString(), // 날짜와 시간 모두 표시
    endpoint: data.requestPath,
    status: data.statusCode,
    risk: data.statusCode === 403 ? 'HIGH' : 'MEDIUM',
    violationType: data.violationType
  });

  // --- 데이터 로드 및 SSE 연결 로직 ---
  useEffect(() => {
    // 1. [추가] 초기 DB 로그 로드 (새로고침 시 데이터 유지 목적)
    const fetchExistingLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/sse/logs', { 
          withCredentials: true 
        });
        const formattedLogs = response.data.map(log => formatLogData(log));
        setSecurityLogs(formattedLogs); // DB 데이터를 상태에 저장
      } catch (error) {
        console.error("기존 로그를 불러오는데 실패했습니다:", error);
      }
    };

    fetchExistingLogs();

    // 2. SSE 연결 설정
    const eventSource = new EventSource('http://localhost:8080/api/sse/connect/admin', {
      withCredentials: true 
    });

    eventSource.onopen = () => {
      console.log("✅ [AdminDashboard] 보안 서버와 실시간 연결이 수립되었습니다.");
    };

    // 'security-alert' 커스텀 이벤트 수신
    eventSource.addEventListener('security-alert', (event) => {
      const data = JSON.parse(event.data);
      console.log("🚨 실시간 보안 알림 수신:", data);
      
      setShowAlert(true);
      setAlertCount(prev => prev + 1);

      // 실시간 수신 로그 추가 (기존 로그 리스트 앞에 추가)
      setSecurityLogs(prevLogs => [formatLogData(data), ...prevLogs].slice(0, 50));
    });

    eventSource.onerror = (err) => {
      console.error("❌ SSE 연결 오류 발생 (재연결 시도 중...):", err);
    };

    return () => {
      eventSource.close();
      console.log("🔌 AdminDashboard SSE 연결을 해제합니다.");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* 상단 헤더 영역 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-blue-600" /> 보안 관제 센터
        </h1>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/simulator" 
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            <PlayCircle size={18} className="text-blue-600" />
            입금 시뮬레이터
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">자동 갱신 ON</span>
            <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 실시간 경고 알림 배너 */}
      {showAlert && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex justify-between items-center animate-pulse">
          <div className="flex items-center">
            <ShieldAlert className="text-red-500 mr-3" />
            <p className="text-red-700 font-bold">실시간 경고: 새로운 보안 위협이 {alertCount}건 감지되었습니다.</p>
          </div>
          <button 
            onClick={() => { setShowAlert(false); setAlertCount(0); }} 
            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-200"
          >
            확인
          </button>
        </div>
      )}

      {/* 핵심 보안 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* value를 securityLogs.length로 설정하여 누적 건수 표시 */}
        <StatCard title="차단된 접근" value={`${securityLogs.length}건`} sub="전체 누적(DB 포함)" color="bg-red-500" icon={<ShieldAlert size={20}/>} />
        <StatCard title="고위험 위협" value={`${securityLogs.filter(l => l.risk === 'HIGH').length}건`} sub="즉시 조치 필요" color="bg-orange-500" icon={<Activity size={20}/>} />
        <StatCard title="마스킹 성공률" value="97.3%" sub="개인정보 보호" color="bg-green-500" icon={<ShieldCheck size={20}/>} />
        <StatCard title="평균 응답 시간" value="0.3초" sub="탐지부터 차단까지" color="bg-blue-500" icon={<Search size={20}/>} />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">실시간 위험 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={initialLineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="threat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4">데이터 마스킹 감사</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#999" fontSize={12} />
                <YAxis stroke="#999" fontSize={12} />
                <Tooltip cursor={{fill: '#f9fafb'}} />
                <Bar dataKey="val" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 보안 탐지 히스토리 테이블 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">보안 탐지 히스토리 (최근 50건)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4 font-semibold">탐지 시간</th>
                <th className="p-4 font-semibold">위험 엔드포인트</th>
                <th className="p-4 font-semibold">상태</th>
                <th className="p-4 font-semibold">위험 등급</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {securityLogs.length > 0 ? (
                securityLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors animate-in fade-in duration-500">
                    <td className="p-4 text-gray-400">{log.time}</td>
                    <td className="p-4 font-mono text-blue-600">{log.endpoint}</td>
                    <td className="p-4"><span className="text-red-500 font-medium">{log.status}</span></td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        log.risk === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {log.risk}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400">
                    탐지된 기록이 없습니다. 실시간 모니터링 중...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, sub, color, icon }) => (
  <div className={`${color} text-white p-5 rounded-2xl shadow-lg relative overflow-hidden`}>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm opacity-80 font-medium">{title}</p>
        <div className="opacity-60">{icon}</div>
      </div>
      <h2 className="text-3xl font-extrabold mb-1">{value}</h2>
      <p className="text-xs opacity-70">{sub}</p>
    </div>
    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
  </div>
);

export default AdminDashboard;