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
import ProtectedRoute from './components/ProtectedRoute'; // ProtectedRoute import
import { useAuthStore } from './store/useAuthStore'; // useAuthStore import
import './index.css'; 
import './App.css';

function App() {
  const { isLoggedIn } = useAuthStore(); // 로그인 상태 가져오기

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        {/* 모든 페이지에서 공통으로 사용되는 헤더 */}
        <Header />

        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* 1. 기본 경로: 로그인 상태에 따라 다른 페이지로 리다이렉트 */}
            <Route 
              path="/" 
              element={isLoggedIn ? <Navigate to="/user/home" replace /> : <Navigate to="/login" replace />} 
            />
            
            {/* 2. 공통 인증 경로 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 3. 관리자(Admin) 경로 */}
            <Route 
              path="/admin/dashboard" 
              element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} 
            />

            {/* 4. 판매자(Seller) 경로 그룹화 */}
            <Route path="/seller">
              <Route 
                path="dashboard" 
                element={<ProtectedRoute allowedRoles={['SELLER']}><SellerDashboardPage /></ProtectedRoute>} 
              />
            </Route>

            {/* 5. 사용자(User) 경로 그룹화 */}
            <Route path="/user">
              <Route 
                path="home" 
                element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'SELLER']}><Home /></ProtectedRoute>} 
              />
              <Route 
                path="payment" 
                element={<ProtectedRoute allowedRoles={['USER']}><Payment /></ProtectedRoute>} 
              />
              <Route 
                path="virtual-account" 
                element={<ProtectedRoute allowedRoles={['USER']}><VirtualAccount /></ProtectedRoute>} 
              />
              <Route 
                path="history" 
                element={<ProtectedRoute allowedRoles={['USER']}><PaymentHistory /></ProtectedRoute>} 
              />
            </Route>

            {/* 6. 시뮬레이터 (계좌 이체 등 테스트용) */}
            <Route 
              path="/simulator" 
              element={<ProtectedRoute allowedRoles={['ADMIN', 'SELLER', 'USER']}><Simulator /></ProtectedRoute>} 
            />

            {/* 7. 정의되지 않은 모든 경로는 로그인 상태에 따라 홈 또는 로그인으로 리다이렉트 */}
            <Route 
              path="*" 
              element={isLoggedIn ? <Navigate to="/user/home" replace /> : <Navigate to="/login" replace />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;