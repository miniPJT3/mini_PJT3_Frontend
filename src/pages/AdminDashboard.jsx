import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldAlert, Activity, Search, ShieldCheck, PlayCircle, Wallet,
  ShoppingCart, CheckCircle2, XCircle, Percent, Users, Store,
  UserCog, UserRound, ListChecks
} from 'lucide-react';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Cell
} from 'recharts';

// ======================================
// Helper Functions
// ======================================
const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString('ko-KR', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });
};

const ROLE_LABELS = {
  ALL: '전체',
  USER: '사용자',
  SELLER: '판매자',
  ADMIN: '관리자',
};

const ROLE_FILTERS = [
  { value: 'ALL', label: '전체' },
  { value: 'USER', label: '사용자' },
  { value: 'SELLER', label: '판매자' },
  { value: 'ADMIN', label: '관리자' },
];

const ROLE_BADGE_STYLES = {
  USER: 'bg-green-100 text-green-700 border border-green-200',
  SELLER: 'bg-purple-100 text-purple-700 border border-purple-200',
  ADMIN: 'bg-red-100 text-red-700 border border-red-200',
};

// ======================================
// Main Dashboard Component
// ======================================
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('MONITORING');
  const [showAlert, setShowAlert] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [securityLogs, setSecurityLogs] = useState([]);
  const [totalViolationCount, setTotalViolationCount] = useState(0);
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isAuditing, setIsAuditing] = useState(false);

  // 실시간 위험 추이 데이터를 저장할 상태
  const [threatTrendData, setThreatTrendData] = useState([{ time: '연결중', threat: 0 }]);

  // 요약 데이터 상태 선언
  const [summaryData, setSummaryData] = useState({
    maskingSuccessRate: 0,
    totalMaskingAuditCount: 0,
    violationsLast24Hours: 0,
    accountRate: 0,
    nameRate: 0,
    emailRate: 0,
    phoneRate: 0
  });

  // 시스템 현황 상태
  const [systemStatus, setSystemStatus] = useState({
    activeVirtualAccountCount: 0,
    todayTotalOrderCount: 0,
    todayPaidOrderCount: 0,
    todayFailedPaymentCount: 0,
    todayPaymentSuccessRate: 0,
  });

  // 계정 현황 상태
  const [accountCounts, setAccountCounts] = useState({
    totalCount: 0, userCount: 0, sellerCount: 0, adminCount: 0
  });
  const [accounts, setAccounts] = useState([]);

  const formatLogData = (data) => ({
    id: data.id || Date.now() + Math.random(),
    time: new Date(data.createdAt).toLocaleString(),
    endpoint: data.requestPath,
    status: data.statusCode,
    risk: data.statusCode === 403 ? 'HIGH' : 'MEDIUM',
    violationType: data.violationType
  });

  // 위험 추이 데이터를 가져오는 함수
  const fetchThreatTrend = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/security/threat-trend', { withCredentials: true });
      setThreatTrendData(response.data);
    } catch (error) {
      console.error("위험 추이 로드 실패:", error);
    }
  };

  useEffect(() => {
    // 1. 초기 데이터 로딩 함수들
    const fetchSecurityData = async () => {
      try {
        const [logsRes, countRes] = await Promise.all([
          axios.get('http://localhost:8080/api/sse/logs', { withCredentials: true }),
          axios.get('http://localhost:8080/api/admin/security/violations/count', { withCredentials: true })
        ]);
        setSecurityLogs(logsRes.data.map(log => formatLogData(log)).slice(0, 20));
        setTotalViolationCount(countRes.data);
      } catch (error) {
        console.error("보안 데이터 로드 실패:", error);
      }
    };

    const fetchSystemStatus = async () => {
      try {
        const response = await axios.get('/api/admin/system-status', { withCredentials: true });
        setSystemStatus(response.data);
      } catch (error) {
        console.error("시스템 현황 로드 실패:", error);
      }
    };

    const fetchAccountsData = async () => {
      try {
        const [countsRes, listRes] = await Promise.all([
          axios.get('http://localhost:8080/api/admin/accounts/role-counts', { withCredentials: true }),
          axios.get('http://localhost:8080/api/admin/accounts', { withCredentials: true })
        ]);
        setAccountCounts(countsRes.data);
        setAccounts(listRes.data);
      } catch (error) {
        console.error("계정 데이터 로드 실패:", error);
      }
    };

    const fetchSummaryData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/admin/security/summary', { withCredentials: true });
        setSummaryData(response.data);
      } catch (error) {
        console.error("요약 데이터 로드 실패:", error);
      }
    };

    // 초기 호출 실행
    fetchSecurityData();
    fetchSystemStatus();
    fetchAccountsData();
    fetchThreatTrend();
    fetchSummaryData();

    //SSE 연결 설정
    const eventSource = new EventSource('http://localhost:8080/api/sse/connect/admin', { withCredentials: true });

    //연결 성공 시 로그 (디버깅용)
    eventSource.onopen = () => {
      console.log("SSE 연결이 성공적으로 수립되었습니다.");
    };

    //보안 알림 수신 (이름이 'security-alert'인 것만 처리하므로 핑 데이터는 무시됨)
    eventSource.addEventListener('security-alert', (event) => {
      const data = JSON.parse(event.data);
      setShowAlert(true);
      setAlertCount(prev => prev + 1);
      setTotalViolationCount(prev => prev + 1);
      fetchThreatTrend();
      setSecurityLogs(prevLogs => {
        const newLog = formatLogData(data);
        return [newLog, ...prevLogs].slice(0, 20);
      });
    });

    //핑(Heartbeat) 수신 확인
    eventSource.addEventListener('ping', (event) => {
      console.log("Keep-alive: 서버로부터 핑을 수신했습니다.");
    });

    //에러 핸들링
    eventSource.onerror = (error) => {
      console.error("SSE 연결 에러 발생:", error);
      // 필요 시 eventSource.close() 후 재연결 로직을 넣을 수 있습니다.
    };

    // 3. 언마운트 시 클린업
    return () => {
      console.log("SSE 연결을 종료합니다.");
      eventSource.close();
    };
  }, []);

  const filteredAccounts = useMemo(() => {
    return selectedRole === 'ALL' ? accounts : accounts.filter(a => a.role === selectedRole);
  }, [selectedRole, accounts]);

  const handleRunMaskingAudit = async () => {
    if (!window.confirm("전체 결제 데이터의 마스킹 무결성을 전수 조사하시겠습니까?")) return;
    setIsAuditing(true);
    try {
      const response = await axios.post('http://localhost:8080/api/admin/security/masking-audits/run', {}, { withCredentials: true });
      alert(`보안 점검 완료! 총 ${response.data.checkedCount}건의 데이터를 확인했습니다.`);
    } catch (error) {
      console.error("보안 감사 실행 실패:", error);
      alert("감사 실행 중 오류가 발생했습니다.");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3 tracking-tight">
          <Activity size={34} className="text-blue-600" /> 보안 관제 센터
        </h1>
        <div className="flex items-center gap-4">
          <Link to="/simulator" className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 hover:shadow-md transition-all">
            <PlayCircle size={21} className="text-blue-600" /> 입금 시뮬레이터
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-slate-200 overflow-x-auto">
        {['MONITORING', 'SYSTEM', 'ACCOUNTS'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 text-lg font-black transition-all whitespace-nowrap ${activeTab === tab ? 'text-blue-600 border-b-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab === 'MONITORING' ? '실시간 모니터링' : tab === 'SYSTEM' ? '전체 시스템 요약' : '사용자 계정 조회'}
          </button>
        ))}
      </div>

      {activeTab === 'MONITORING' && (
        <MonitoringTab
          showAlert={showAlert} setShowAlert={setShowAlert}
          alertCount={alertCount} setAlertCount={setAlertCount}
          securityLogs={securityLogs}
          totalViolationCount={totalViolationCount}
          handleRunMaskingAudit={handleRunMaskingAudit}
          isAuditing={isAuditing}
          threatTrendData={threatTrendData}
          summaryData={summaryData}
        />
      )}
      {activeTab === 'SYSTEM' && <SystemStatusTab systemStatus={systemStatus} />}
      {activeTab === 'ACCOUNTS' && (
        <AccountsTab
          selectedRole={selectedRole} setSelectedRole={setSelectedRole}
          filteredAccounts={filteredAccounts}
          accountCounts={accountCounts}
        />
      )}
    </div>
  );
};

// ======================================
// Sub Components
// ======================================

const MonitoringTab = ({
  showAlert, setShowAlert, alertCount, setAlertCount,
  securityLogs, totalViolationCount, handleRunMaskingAudit,
  isAuditing, threatTrendData, summaryData
}) => {

  const currentSuccessRate = summaryData?.maskingSuccessRate ?? 0;
  const currentTotalAudit = summaryData?.totalMaskingAuditCount ?? 0;
  const currentViolations = summaryData?.violationsLast24Hours ?? totalViolationCount;

  const dynamicBarData = [
    { name: '계좌', val: summaryData?.accountRate ?? 0 },
    { name: '이름', val: summaryData?.nameRate ?? 0 },
    { name: '이메일', val: summaryData?.emailRate ?? 0 },
    { name: '전화번호', val: summaryData?.phoneRate ?? 0 },
  ];

  return (
    <>
      {showAlert && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex justify-between items-center animate-pulse">
          <div className="flex items-center">
            <ShieldAlert className="text-red-500 mr-3" />
            <p className="text-red-700 font-bold">실시간 경고: 새로운 보안 위협이 {alertCount}건 감지되었습니다.</p>
          </div>
          <button onClick={() => { setShowAlert(false); setAlertCount(0); }} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-200">확인</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="차단된 접근" value={`${currentViolations}건`} sub="실시간 탐지 집계" color="bg-red-500" icon={<ShieldAlert size={20} />} />
        <StatCard title="고위험 위협" value={`${securityLogs.filter(l => l.risk === 'HIGH').length}건`} sub="즉시 조치 필요" color="bg-orange-500" icon={<Activity size={20} />} />
        <StatCard
          title="마스킹 성공률"
          value={`${currentSuccessRate}%`}
          sub={`총 ${currentTotalAudit}건 검사 완료`}
          color={currentSuccessRate > 95 ? "bg-green-500" : "bg-red-500"}
          icon={<ShieldCheck size={20} />}
        />
        <StatCard title="평균 응답 시간" value="0.3초" sub="탐지부터 차단까지" color="bg-blue-500" icon={<Search size={20} />} />
      </div>

      {/* 차트 영역: 중복 제거 및 가로 병합 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard title="최근 3시간 위험 추이" data={threatTrendData} type="line" />
        <ChartCard title="데이터 마스킹 감사 결과" data={dynamicBarData} type="bar" />
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-black text-gray-700 flex items-center gap-2">
          <ListChecks size={20} className="text-blue-600" /> 탐지 내역 관리
        </h3>
        <button
          onClick={handleRunMaskingAudit}
          disabled={isAuditing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-sm transition-all shadow-sm
            ${isAuditing ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'}`}
        >
          <ShieldCheck size={18} className={isAuditing ? "animate-spin" : ""} />
          {isAuditing ? "감사 진행 중..." : "실시간 보안 감사 실행"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 font-bold text-gray-700">보안 탐지 히스토리 (최근 20건)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr><th className="p-4">탐지 시간</th><th className="p-4">엔드포인트</th><th className="p-4">상태</th><th className="p-4">위험 등급</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {securityLogs.length > 0 ? securityLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-400">{log.time}</td>
                  <td className="p-4 font-mono text-blue-600">{log.endpoint}</td>
                  <td className="p-4 text-red-500 font-medium">{log.status}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${log.risk === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{log.risk}</span>
                  </td>
                </tr>
              )) : <tr><td colSpan="4" className="p-10 text-center text-gray-400">탐지 기록이 없습니다.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const SystemStatusTab = ({ systemStatus }) => {
  const dynamicDetailRows = [
    { id: 1, label: '현재 활성화된 가상계좌 수', value: `${systemStatus.activeVirtualAccountCount}개`, description: '상태가 ACTIVE이고 삭제되지 않은 가상계좌', apiField: 'activeVirtualAccountCount' },
    { id: 2, label: '오늘 총 주문/결제 건수', value: `${systemStatus.todayTotalOrderCount}건`, description: '오늘 생성된 전체 Payment 기준', apiField: 'todayTotalOrderCount' },
    { id: 3, label: '오늘 결제 성공 건수', value: `${systemStatus.todayPaidOrderCount}건`, description: 'TransactionStatus = PAID', apiField: 'todayPaidOrderCount' },
    { id: 4, label: '오늘 결제 실패 건수', value: `${systemStatus.todayFailedPaymentCount}건`, description: 'TransactionStatus = FAILED', apiField: 'todayFailedPaymentCount' },
    { id: 5, label: '오늘 결제 성공률', value: `${systemStatus.todayPaymentSuccessRate}%`, description: '오늘 결제 성공 건수 / 오늘 전체 결제 건수', apiField: 'todayPaymentSuccessRate' },
  ];

  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-800 mb-5">전체 시스템 현황 요약</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <MiniMetricCard title="활성 가상계좌" value={`${systemStatus.activeVirtualAccountCount}개`} icon={<Wallet size={18} />} tone="blue" />
          <MiniMetricCard title="오늘 총 주문" value={`${systemStatus.todayTotalOrderCount}건`} icon={<ShoppingCart size={18} />} tone="slate" />
          <MiniMetricCard title="오늘 성공" value={`${systemStatus.todayPaidOrderCount}건`} icon={<CheckCircle2 size={18} />} tone="green" />
          <MiniMetricCard title="오늘 실패" value={`${systemStatus.todayFailedPaymentCount}건`} icon={<XCircle size={18} />} tone="red" />
          <MiniMetricCard title="성공률" value={`${systemStatus.todayPaymentSuccessRate}%`} icon={<Percent size={18} />} tone="orange" />
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2"><ListChecks size={18} className="text-blue-600" /><h3 className="font-bold text-gray-700">시스템 집계 상세</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr><th className="p-4">항목</th><th className="p-4">값</th><th className="p-4">설명</th><th className="p-4">백엔드 필드</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {dynamicDetailRows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-semibold text-gray-700">{row.label}</td>
                  <td className="p-4 text-blue-600 font-extrabold">{row.value}</td>
                  <td className="p-4 text-gray-500">{row.description}</td>
                  <td className="p-4 font-mono text-xs text-gray-400">{row.apiField}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const AccountsTab = ({ selectedRole, setSelectedRole, filteredAccounts, accountCounts }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
      <h3 className="font-bold text-gray-700">계정 및 역할 조회</h3>

      <div className="flex gap-2">
        {ROLE_FILTERS.map(role => (
          <button
            key={role.value}
            onClick={() => setSelectedRole(role.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${selectedRole === role.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
          >
            {role.label}
          </button>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gray-50/60 border-b">
      <AccountCountCard title="전체" value={accountCounts.totalCount} icon={<Users size={18} />} />
      <AccountCountCard title="사용자" value={accountCounts.userCount} icon={<UserRound size={18} />} />
      <AccountCountCard title="판매자" value={accountCounts.sellerCount} icon={<Store size={18} />} />
      <AccountCountCard title="관리자" value={accountCounts.adminCount} icon={<UserCog size={18} />} />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-white text-gray-500 text-xs uppercase border-b">
          <tr>
            <th className="p-4">이름</th>
            <th className="p-4">이메일</th>
            <th className="p-4">로그인 ID</th>
            <th className="p-4">역할</th>
            <th className="p-4">가입일</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {filteredAccounts.map(account => {
            const role = account.role;
            const roleLabel = ROLE_LABELS[role] || account.roleName || role;
            const badgeStyle =
              ROLE_BADGE_STYLES[role] || 'bg-gray-100 text-gray-600 border border-gray-200';

            return (
              <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-semibold text-gray-700">{account.name}</td>
                <td className="p-4 text-gray-600">{account.email}</td>
                <td className="p-4 font-mono text-blue-600">{account.username}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeStyle}`}>
                    {roleLabel}
                  </span>
                </td>
                <td className="p-4 text-gray-400">{formatDateTime(account.createdAt)}</td>
              </tr>
            );
          })}

          {filteredAccounts.length === 0 && (
            <tr>
              <td colSpan="5" className="p-10 text-center text-gray-400">
                조회된 계정이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

const StatCard = ({ title, value, sub, color, icon }) => (
  <div className={`${color} text-white p-5 rounded-2xl shadow-lg relative overflow-hidden`}>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-2"><p className="text-sm opacity-80">{title}</p>{icon}</div>
      <h2 className="text-3xl font-extrabold">{value}</h2><p className="text-xs opacity-70 mt-1">{sub}</p>
    </div>
  </div>
);

const MiniMetricCard = ({ title, value, icon, tone }) => {
  const toneMap = { blue: 'bg-blue-50 text-blue-600', slate: 'bg-slate-50 text-slate-600', green: 'bg-green-50 text-green-600', red: 'bg-red-50 text-red-600', orange: 'bg-orange-50 text-orange-600' };
  return (
    <div className={`border rounded-2xl p-4 ${toneMap[tone]} border-gray-100`}>
      <div className="flex justify-between items-center mb-2"><span className="text-xs font-bold opacity-80">{title}</span>{icon}</div>
      <p className="text-2xl font-extrabold text-gray-800">{value}</p>
    </div>
  );
};

const AccountCountCard = ({ title, value, icon }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
    <div><p className="text-xs font-bold text-gray-500 mb-1">{title}</p><p className="text-2xl font-extrabold text-gray-800">{value}</p></div>
    <div className="text-blue-500">{icon}</div>
  </div>
);

const ChartCard = ({ title, data, type }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <h3 className="font-bold text-gray-700 mb-4">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="time" stroke="#999" fontSize={12} />
            <YAxis stroke="#999" fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="threat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#999" fontSize={12} />
            <YAxis stroke="#999" fontSize={12} domain={[90, 100]} allowDataOverflow={true} tickLine={false} axisLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey="val" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.val >= 98 ? '#10b981' : entry.val >= 95 ? '#f59e0b' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  </div>
);

export default AdminDashboard;