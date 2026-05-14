import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './index.css'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* 1. 기본 경로 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 2. 공통 인증 경로 (비로그인 상태에서만 접근 가능하도록 설정도 가능) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 3. 관리자(Admin) 경로: 오직 ADMIN만 접근 가능 🥊 */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="audit" element={<AdminDashboard />} />
            </Route>

            {/* 4. 판매자(Seller) 경로: SELLER와 ADMIN 접근 가능 🥊 */}
            <Route path="/seller" element={<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']} />}>
              <Route path="dashboard" element={<SellerDashboardPage />} />
            </Route>

            {/* 5. 사용자(User) 경로: USER와 ADMIN 접근 가능 🥊 */}
            <Route path="/user" element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
              <Route path="home" element={<Home />} />
              <Route path="payment" element={<Payment />} />
              <Route path="virtual-account" element={<VirtualAccount />} />
              <Route path="history" element={<PaymentHistory />} />
            </Route>

            {/* 6. 시뮬레이터: 테스트 편의를 위해 일단 공개 (또는 ADMIN 권한 부여 가능) */}
            <Route path="/simulator" element={<Simulator />} />

            {/* 7. 정의되지 않은 모든 경로 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;