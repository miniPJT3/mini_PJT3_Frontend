import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from "./pages/AdminDashboard"; 
import Simulator from './pages/Simulator';
import Home from './pages/user/Home';
import Payment from './pages/user/Payment';
import VirtualAccount from './pages/user/VirtualAccount';
import PaymentHistory from './pages/user/PaymentHistory';
import SellerDashboardPage from './pages/SellerDashboardPage';
import './index.css'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* 모든 페이지에서 공통으로 사용되는 헤더 */}
        <Header />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* 1. 기본 경로: 로그인 페이지로 설정 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 2. 공통 인증 경로 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 3. 관리자(Admin) 경로 */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* 4. 판매자(Seller) 경로 그룹화 */}
            <Route path="/seller">
              <Route path="dashboard" element={<SellerDashboardPage />} />
            </Route>

            {/* 5. 사용자(User) 경로 그룹화 */}
            <Route path="/user">
              <Route path="home" element={<Home />} />
              <Route path="payment" element={<Payment />} />
              <Route path="virtual-account" element={<VirtualAccount />} />
              <Route path="history" element={<PaymentHistory />} />
            </Route>

            {/* 6. 시뮬레이터 (계좌 이체 등 테스트용) */}
            <Route path="/simulator" element={<Simulator />} />

            {/* 7. 정의되지 않은 모든 경로는 홈(로그인)으로 리다이렉트 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;