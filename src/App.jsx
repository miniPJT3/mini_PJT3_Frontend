import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute'; // 🥊 아까 만든 문지기 컴포넌트 임포트!
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from "./pages/AdminDashboard"; 
import Simulator from './pages/Simulator';
import Home from './pages/user/Home';
import Payment from './pages/user/Payment';
import VirtualAccount from './pages/user/VirtualAccount';
import PaymentHistory from './pages/user/PaymentHistory';
import SellerDashboardPage from './pages/SellerDashboardPage';
import AdditionalInfo from './pages/AdditionalInfo';
import './index.css'; 
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* 🥊 1. 로그인 없이 접근 가능한 경로 */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/additional-info" element={<AdditionalInfo />} />

            {/* 🥊 2. 관리자(Admin) 전용 경로: 오직 ADMIN만! */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/simulator" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Simulator />
              </ProtectedRoute>
            } />

            {/* 🥊 3. 판매자(Seller) 전용 경로: SELLER와 ADMIN만! (USER는 차단) */}
            <Route path="/seller">
              <Route path="dashboard" element={
                <ProtectedRoute allowedRoles={['SELLER']}>
                  <SellerDashboardPage />
                </ProtectedRoute>
              } />
            </Route>

            {/* 🥊 4. 사용자(User) 전용 경로: USER와 ADMIN만! (SELLER는 차단) */}
            <Route path="/user">
              <Route path="home" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="payment" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <Payment />
                </ProtectedRoute>
              } />
              <Route path="virtual-account" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <VirtualAccount />
                </ProtectedRoute>
              } />
              <Route path="history" element={
                <ProtectedRoute allowedRoles={['USER']}>
                  <PaymentHistory />
                </ProtectedRoute>
              } />
            </Route>

            {/* 정의되지 않은 경로 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;