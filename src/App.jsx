import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/user/Home';
import Payment from './pages/user/Payment';
import VirtualAccount from './pages/user/VirtualAccount';
import PaymentHistory from './pages/user/PaymentHistory';
import SellerDashboardPage from './pages/SellerDashboardPage';
import './index.css'; 
import './App.css';

// 팀원이 만든 HomePage 혹은 기본 안내 페이지
function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-black text-gray-900 tracking-tight">
        가상계좌 결제 시스템
      </h1>
      <p className="mt-4 text-gray-600 text-lg font-medium">
        판매자 대시보드 테스트는 상단 메뉴 또는 <code className="bg-gray-200 px-2 py-1 rounded">/seller/dashboard</code> 주소로 확인하세요.
      </p>
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* 헤더는 공통으로 한 번만 렌더링 */}
        <Header />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* 1. 기본 경로: 로그인 페이지로 리다이렉트하거나 HomePage 노출 */}
            <Route path="/" element={<Login />} />
            
            {/* 2. 공통 인증 경로 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 3. 판매자(Seller) 전용 경로 */}
            <Route path="/seller">
              <Route path="dashboard" element={<SellerDashboardPage />} />
            </Route>

            {/* 4. 사용자(User) 전용 경로 그룹화 */}
            <Route path="/user">
              <Route path="home" element={<Home />} />
              <Route path="payment" element={<Payment />} />
              <Route path="virtual-account" element={<VirtualAccount />} />
              <Route path="history" element={<PaymentHistory />} />
            </Route>

            {/* 5. 잘못된 주소 접근 시 처리 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;