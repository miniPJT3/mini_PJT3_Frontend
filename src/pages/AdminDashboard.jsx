import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, Search, ShieldCheck, PlayCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

// [수정] 초기 데이터는 비워두거나 0으로 설정하여 실제 연결 여부를 확인하기 쉽게 합니다.
const initialLineData = [
  { time: '현재', threat: 0 }
];

const barData = [
  { name: '계좌', val: 0 },
  { name: '이름', val: 0 },
  { name: '이메일', val: 0 },
  { name: '전화번호', val: 0 },
];

const Dashboard = () => {
  // --- 상태 관리 ---
  const [showAlert, setShowAlert] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  // [수정] 초기 로그를 비워 실제 백엔드 데이터가 들어오는지 확인합니다.
  const [securityLogs, setSecurityLogs] = useState([]);

  // --- SSE 연결 로직 ---
  useEffect(() => {
    // [수정] 위드 크리덴셜(withCredentials) 설정을 명시적으로 제외하거나 포함하여 CORS 이슈를 방지합니다.
    // 현재 백엔드 SecurityConfig에서 .permitAll()을 했으므로, 시크릿 창에서도 에러가 난다면 주소를 확인해야 합니다.
    const eventSource = new EventSource('http://localhost:8080/api/sse/connect/admin');

    eventSource.onopen = () => {
      console.log("SSE 연결 채널이 열렸습니다.");
    };

    // 서버의 'security-alert' 이벤트 수신
    eventSource.addEventListener('security-alert', (event) => {
      console.log("새 보안 로그 수신:", event.data);
      
      const currentTime = new Date().toLocaleTimeString();
      
      // 1. 알림 배너 활성화 및 카운트 증가
      setShowAlert(true);
      setAlertCount(prev => prev + 1);

      // 2. 로그 테이블에 실시간 추가
      // event.data가 단순 문자열일 경우를 대비한 파싱 로직
      const newLog = {
        id: Date.now(),
        time: currentTime,
        endpoint: event.data.includes('/admin') ? '/admin/security' : '/api/test/forbidden',
        status: 403,
        risk: 'HIGH'
      };
      
      setSecurityLogs(prevLogs => [newLog, ...prevLogs]);
    });

    eventSource.onerror = (err) => {
      // 302 Found 에러가 날 경우 브라우저가 자동으로 재연결을 시도하므로 
      // 에러가 너무 자주 찍히면 잠시 닫았다가 일정 시간 후 재연결하는 로직이 필요할 수 있습니다.
      console.error("SSE 연결 상태 확인 중... (재연결 시도 중)");
    };

    return () => {
      eventSource.close();
      console.log("SSE 연결 종료");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* 제목 영역 */}
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

      {/* 실시간 경고 배너 */}
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

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="차단된 접근" value={`${securityLogs.length}건`} sub="전체 누적" color="bg-red-500" icon={<ShieldAlert size={20}/>} />
        <StatCard title="고위험 위협" value={`${securityLogs.filter(l => l.risk === 'HIGH').length}건`} sub="즉시 조치 필요" color="bg-orange-500" icon={<Activity size={20}/>} />
        <StatCard title="마스킹 성공률" value="97.3%" sub="개인정보 보호" color="bg-green-500" icon={<ShieldCheck size={20}/>} />
        <StatCard title="평균 응답 시간" value="0.3초" sub="탐지부터 차단까지" color="bg-blue-500" icon={<Search size={20}/>} />
      </div>

      {/* 차트 영역 */}
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

      {/* 보안 탐지 로그 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">보안 탐지 로그</h3>
          <button className="text-xs text-blue-600 hover:underline">전체보기</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="p-4 font-semibold">시간</th>
                <th className="p-4 font-semibold">엔드포인트</th>
                <th className="p-4 font-semibold">상태</th>
                <th className="p-4 font-semibold">위험도</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {securityLogs.length > 0 ? (
                securityLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-400">{log.time}</td>
                    <td className="p-4 font-mono text-blue-600">{log.endpoint}</td>
                    <td className="p-4"><span className="text-red-500 font-medium">{log.status}</span></td>
                    <td className="p-4">
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                        {log.risk}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-10 text-center text-gray-400">
                    실시간 보안 위협을 대기 중입니다...
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

export default Dashboard;