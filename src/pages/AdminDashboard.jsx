import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  Search,
  ShieldCheck,
  PlayCircle,
  Wallet,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Percent,
  Users,
  Store,
  UserCog,
  UserRound,
  ListChecks,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

// ======================================
// Mock Data: 나중에 백엔드 API 연동으로 교체
// ======================================

const securitySummary = {
  blockedAccessLastHour: 5,
  highRiskThreatCount: 2,
  maskingSuccessRate: 97.3,
  averageResponseTimeSec: 0.3,
};

const systemStatus = {
  activeVirtualAccountCount: 18,
  todayTotalOrderCount: 64,
  todayPaidOrderCount: 47,
  todayFailedPaymentCount: 6,
  todayPaymentSuccessRate: 73.4,
};

const systemDetailRows = [
  {
    id: 1,
    label: '현재 활성화된 가상계좌 수',
    value: '18개',
    description: '상태가 ACTIVE이고 삭제되지 않은 가상계좌',
    apiField: 'activeVirtualAccountCount',
  },
  {
    id: 2,
    label: '오늘 총 주문/결제 건수',
    value: '64건',
    description: '오늘 생성된 전체 Payment 기준',
    apiField: 'todayTotalOrderCount',
  },
  {
    id: 3,
    label: '오늘 결제 성공 건수',
    value: '47건',
    description: 'TransactionStatus = PAID',
    apiField: 'todayPaidOrderCount',
  },
  {
    id: 4,
    label: '오늘 결제 실패 건수',
    value: '6건',
    description: 'TransactionStatus = FAILED',
    apiField: 'todayFailedPaymentCount',
  },
  {
    id: 5,
    label: '오늘 결제 성공률',
    value: '73.4%',
    description: '오늘 결제 성공 건수 / 오늘 전체 결제 건수',
    apiField: 'todayPaymentSuccessRate',
  },
];

const recentPaymentRows = [
  {
    id: 1001,
    payUuid: 'PAY-20260511-001',
    member: '홍길동',
    amount: 42000,
    status: 'PAID',
    virtualAccountStatus: 'ACTIVE',
    createdAt: '2026-05-11T14:20:00',
  },
  {
    id: 1002,
    payUuid: 'PAY-20260511-002',
    member: '김민수',
    amount: 18000,
    status: 'FAILED',
    virtualAccountStatus: 'EXPIRED',
    createdAt: '2026-05-11T14:15:00',
  },
  {
    id: 1003,
    payUuid: 'PAY-20260511-003',
    member: '이서연',
    amount: 53000,
    status: 'PENDING',
    virtualAccountStatus: 'ACTIVE',
    createdAt: '2026-05-11T14:03:00',
  },
];

const accountRoleCounts = {
  totalCount: 12,
  userCount: 8,
  sellerCount: 3,
  adminCount: 1,
};

const mockAccounts = [
  {
    id: 1,
    email: 'user1@test.com',
    username: 'user1',
    name: '홍길동',
    provider: 'LOCAL',
    role: 'USER',
    roleName: '사용자',
    createdAt: '2026-05-11T12:30:00',
  },
  {
    id: 2,
    email: 'seller1@test.com',
    username: 'seller1',
    name: '판매자1',
    provider: 'LOCAL',
    role: 'SELLER',
    roleName: '판매자',
    createdAt: '2026-05-11T12:35:00',
  },
  {
    id: 3,
    email: 'admin@test.com',
    username: 'admin',
    name: '관리자',
    provider: 'LOCAL',
    role: 'ADMIN',
    roleName: '관리자',
    createdAt: '2026-05-11T12:40:00',
  },
  {
    id: 4,
    email: 'user2@test.com',
    username: 'user2',
    name: '김민수',
    provider: 'KAKAO',
    role: 'USER',
    roleName: '사용자',
    createdAt: '2026-05-11T13:05:00',
  },
  {
    id: 5,
    email: 'seller2@test.com',
    username: 'seller2',
    name: '셀러마켓',
    provider: 'LOCAL',
    role: 'SELLER',
    roleName: '판매자',
    createdAt: '2026-05-11T13:18:00',
  },
];

const lineData = [
  { time: '14:00', threat: 2 },
  { time: '14:05', threat: 5 },
  { time: '14:10', threat: 3 },
  { time: '14:15', threat: 7 },
  { time: '14:20', threat: 4 },
];

const barData = [
  { name: '계좌', val: 100 },
  { name: '이름', val: 85 },
  { name: '이메일', val: 40 },
  { name: '전화번호', val: 90 },
];

const securityLogs = [
  {
    id: 1,
    time: '오후 2:23:15',
    endpoint: '/admin/security',
    status: 403,
    risk: 'HIGH',
  },
  {
    id: 2,
    time: '오후 2:18:42',
    endpoint: '/api/payment/verify',
    status: 429,
    risk: 'MEDIUM',
  },
];

const Dashboard = () => {
  const [showAlert, setShowAlert] = useState(true);
  const [activeTab, setActiveTab] = useState('MONITORING');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const filteredAccounts = useMemo(() => {
    if (selectedRole === 'ALL') {
      return mockAccounts;
    }

    return mockAccounts.filter((account) => account.role === selectedRole);
  }, [selectedRole]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* 제목 영역 */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3 tracking-tight">
          <Activity size={34} className="text-blue-600" />
          보안 관제 센터
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">자동 갱신 ON</span>
          <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-6 mb-8 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('MONITORING')}
          className={`pb-4 px-2 text-lg font-black transition-all whitespace-nowrap ${
            activeTab === 'MONITORING'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          실시간 모니터링
        </button>

        <button
          onClick={() => setActiveTab('SYSTEM')}
          className={`pb-4 px-2 text-lg font-black transition-all whitespace-nowrap ${
            activeTab === 'SYSTEM'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          전체 시스템 요약
        </button>

        <button
          onClick={() => setActiveTab('ACCOUNTS')}
          className={`pb-4 px-2 text-lg font-black transition-all whitespace-nowrap ${
            activeTab === 'ACCOUNTS'
              ? 'text-blue-600 border-b-4 border-blue-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          사용자 및 판매자 계정 조회
        </button>

        <Link
          to="/simulator"
          className="pb-4 px-2 text-lg font-black transition-all whitespace-nowrap text-slate-400 hover:text-blue-600 flex items-center gap-2"
        >
          <PlayCircle size={21} />
          입금 시뮬레이터
        </Link>
      </div>

      {activeTab === 'MONITORING' && (
        <MonitoringTab showAlert={showAlert} setShowAlert={setShowAlert} />
      )}

      {activeTab === 'SYSTEM' && <SystemStatusTab />}

      {activeTab === 'ACCOUNTS' && (
        <AccountsTab
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          filteredAccounts={filteredAccounts}
        />
      )}

      {activeTab === 'SIMULATOR' && <DepositSimulatorTab />}
    </div>
  );
};

// ======================================
// Tab 1. 기존 실시간 모니터링
// ======================================

const MonitoringTab = ({ showAlert, setShowAlert }) => (
  <>
    {/* 실시간 경고 배너 */}
    {showAlert && (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex justify-between items-center animate-pulse">
        <div className="flex items-center">
          <ShieldAlert className="text-red-500 mr-3" />
          <p className="text-red-700 font-bold">
            실시간 경고: 새로운 보안 위협이 {securitySummary.blockedAccessLastHour}건 감지되었습니다.
          </p>
        </div>
        <button
          onClick={() => setShowAlert(false)}
          className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm font-bold hover:bg-red-200"
        >
          확인
        </button>
      </div>
    )}

    {/* 보안 핵심 지표 카드 */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="차단된 접근"
        value={`${securitySummary.blockedAccessLastHour}건`}
        sub="최근 1시간"
        color="bg-red-500"
        icon={<ShieldAlert size={20} />}
      />
      <StatCard
        title="고위험 위협"
        value={`${securitySummary.highRiskThreatCount}건`}
        sub="즉시 조치 필요"
        color="bg-orange-500"
        icon={<Activity size={20} />}
      />
      <StatCard
        title="마스킹 성공률"
        value={`${securitySummary.maskingSuccessRate}%`}
        sub="개인정보 보호"
        color="bg-green-500"
        icon={<ShieldCheck size={20} />}
      />
      <StatCard
        title="평균 응답 시간"
        value={`${securitySummary.averageResponseTimeSec}초`}
        sub="탐지부터 차단까지"
        color="bg-blue-500"
        icon={<Search size={20} />}
      />
    </div>

    {/* 차트 영역 */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-4">실시간 위험 추이</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#999" fontSize={12} />
              <YAxis stroke="#999" fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="threat"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, fill: '#f59e0b' }}
              />
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
              <Tooltip cursor={{ fill: '#f9fafb' }} />
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
            {securityLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 text-gray-400">{log.time}</td>
                <td className="p-4 font-mono text-blue-600">{log.endpoint}</td>
                <td className="p-4">
                  <span className="text-red-500 font-medium">{log.status}</span>
                </td>
                <td className="p-4">
                  <RiskBadge risk={log.risk} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

// ======================================
// Tab 2. 전체 시스템 현황
// ======================================

const SystemStatusTab = () => (
  <div className="space-y-8">
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-bold text-gray-800">전체 시스템 현황 요약</h3>
          <p className="text-xs text-gray-400 mt-1">
            활성 가상계좌와 오늘 결제 처리 현황을 집계합니다.
          </p>
        </div>
        <span className="text-xs text-gray-400">Mock Data</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <MiniMetricCard
          title="활성 가상계좌"
          value={`${systemStatus.activeVirtualAccountCount}개`}
          icon={<Wallet size={18} />}
          tone="blue"
        />
        <MiniMetricCard
          title="오늘 총 주문/결제"
          value={`${systemStatus.todayTotalOrderCount}건`}
          icon={<ShoppingCart size={18} />}
          tone="slate"
        />
        <MiniMetricCard
          title="오늘 결제 성공"
          value={`${systemStatus.todayPaidOrderCount}건`}
          icon={<CheckCircle2 size={18} />}
          tone="green"
        />
        <MiniMetricCard
          title="오늘 결제 실패"
          value={`${systemStatus.todayFailedPaymentCount}건`}
          icon={<XCircle size={18} />}
          tone="red"
        />
        <MiniMetricCard
          title="결제 성공률"
          value={`${systemStatus.todayPaymentSuccessRate}%`}
          icon={<Percent size={18} />}
          tone="orange"
        />
      </div>
    </section>

    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 flex items-center gap-2">
        <ListChecks size={18} className="text-blue-600" />
        <h3 className="font-bold text-gray-700">시스템 집계 상세 리스트</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-4 font-semibold">항목</th>
              <th className="p-4 font-semibold">값</th>
              <th className="p-4 font-semibold">설명</th>
              <th className="p-4 font-semibold">백엔드 필드</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {systemDetailRows.map((row) => (
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

    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-700">최근 결제 요청 리스트</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="p-4 font-semibold">결제 UUID</th>
              <th className="p-4 font-semibold">사용자</th>
              <th className="p-4 font-semibold">금액</th>
              <th className="p-4 font-semibold">결제 상태</th>
              <th className="p-4 font-semibold">가상계좌 상태</th>
              <th className="p-4 font-semibold">생성 시각</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {recentPaymentRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono text-blue-600">{row.payUuid}</td>
                <td className="p-4 font-semibold text-gray-700">{row.member}</td>
                <td className="p-4 text-gray-700">{formatMoney(row.amount)}</td>
                <td className="p-4">
                  <PaymentStatusBadge status={row.status} />
                </td>
                <td className="p-4">
                  <VirtualAccountBadge status={row.virtualAccountStatus} />
                </td>
                <td className="p-4 text-gray-400">{formatDateTime(row.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  </div>
);

// ======================================
// Tab 3. 사용자 및 판매자 계정 조회
// ======================================

const AccountsTab = ({ selectedRole, setSelectedRole, filteredAccounts }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-5 border-b border-gray-100 flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
      <div>
        <h3 className="font-bold text-gray-700">사용자 및 판매자 계정 조회</h3>
        <p className="text-xs text-gray-400 mt-1">
          전체 계정 리스트와 USER / SELLER / ADMIN 역할별 계정을 조회합니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <RoleFilterButton
          active={selectedRole === 'ALL'}
          label={`전체 ${accountRoleCounts.totalCount}`}
          onClick={() => setSelectedRole('ALL')}
        />
        <RoleFilterButton
          active={selectedRole === 'USER'}
          label={`USER ${accountRoleCounts.userCount}`}
          onClick={() => setSelectedRole('USER')}
        />
        <RoleFilterButton
          active={selectedRole === 'SELLER'}
          label={`SELLER ${accountRoleCounts.sellerCount}`}
          onClick={() => setSelectedRole('SELLER')}
        />
        <RoleFilterButton
          active={selectedRole === 'ADMIN'}
          label={`ADMIN ${accountRoleCounts.adminCount}`}
          onClick={() => setSelectedRole('ADMIN')}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border-b border-gray-100 bg-gray-50/60">
      <AccountCountCard title="전체 계정" value={accountRoleCounts.totalCount} icon={<Users size={18} />} />
      <AccountCountCard title="사용자" value={accountRoleCounts.userCount} icon={<UserRound size={18} />} />
      <AccountCountCard title="판매자" value={accountRoleCounts.sellerCount} icon={<Store size={18} />} />
      <AccountCountCard title="관리자" value={accountRoleCounts.adminCount} icon={<UserCog size={18} />} />
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-white text-gray-500 text-xs uppercase border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold">ID</th>
            <th className="p-4 font-semibold">이름</th>
            <th className="p-4 font-semibold">이메일</th>
            <th className="p-4 font-semibold">로그인 ID</th>
            <th className="p-4 font-semibold">가입 방식</th>
            <th className="p-4 font-semibold">역할</th>
            <th className="p-4 font-semibold">가입일</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50 text-sm">
          {filteredAccounts.map((account) => (
            <tr key={account.id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 text-gray-400">{account.id}</td>
              <td className="p-4 font-semibold text-gray-700">{account.name}</td>
              <td className="p-4 text-gray-600">{account.email}</td>
              <td className="p-4 font-mono text-blue-600">{account.username}</td>
              <td className="p-4 text-gray-500">{account.provider || '-'}</td>
              <td className="p-4">
                <RoleBadge role={account.role} roleName={account.roleName} />
              </td>
              <td className="p-4 text-gray-400">{formatDateTime(account.createdAt)}</td>
            </tr>
          ))}

          {filteredAccounts.length === 0 && (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-400">
                조회된 계정이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);

// ======================================
// Common Components
// ======================================

const TabButton = ({ active, icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
        : 'text-gray-500 hover:bg-gray-100'
    }`}
  >
    {icon}
    {label}
  </button>
);

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

const MiniMetricCard = ({ title, value, icon, tone }) => {
  const toneMap = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    slate: 'bg-slate-50 text-slate-600 border-slate-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <div className={`border rounded-2xl p-4 ${toneMap[tone] || toneMap.slate}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-bold opacity-80">{title}</span>
        <span className="opacity-70">{icon}</span>
      </div>
      <p className="text-2xl font-extrabold text-gray-800">{value}</p>
    </div>
  );
};

const AccountCountCard = ({ title, value, icon }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-gray-500">{title}</span>
      <span className="text-blue-500">{icon}</span>
    </div>
    <p className="text-2xl font-extrabold text-gray-800">{value}</p>
  </div>
);

const RoleFilterButton = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
      active
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);

const RoleBadge = ({ role, roleName }) => {
  const styleMap = {
    USER: 'bg-blue-100 text-blue-600',
    SELLER: 'bg-green-100 text-green-600',
    ADMIN: 'bg-purple-100 text-purple-600',
  };

  return (
    <span className={`${styleMap[role] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-bold`}>
      {roleName || role}
    </span>
  );
};

const RiskBadge = ({ risk }) => {
  const styleMap = {
    HIGH: 'bg-red-100 text-red-600',
    MEDIUM: 'bg-orange-100 text-orange-600',
    LOW: 'bg-blue-100 text-blue-600',
  };

  return (
    <span className={`${styleMap[risk] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-bold`}>
      {risk}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const styleMap = {
    PAID: 'bg-green-100 text-green-600',
    FAILED: 'bg-red-100 text-red-600',
    PENDING: 'bg-orange-100 text-orange-600',
    EXPIRED: 'bg-gray-100 text-gray-600',
  };

  return (
    <span className={`${styleMap[status] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-bold`}>
      {status}
    </span>
  );
};

const VirtualAccountBadge = ({ status }) => {
  const styleMap = {
    ACTIVE: 'bg-blue-100 text-blue-600',
    EXPIRED: 'bg-gray-100 text-gray-600',
    USED: 'bg-green-100 text-green-600',
  };

  return (
    <span className={`${styleMap[status] || 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded-full text-xs font-bold`}>
      {status}
    </span>
  );
};

const formatDateTime = (value) => {
  if (!value) return '-';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatMoney = (value) => {
  return `${value.toLocaleString('ko-KR')}원`;
};

export default Dashboard;