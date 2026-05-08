import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/user/Home';
import Payment from './pages/user/Payment';
import VirtualAccount from './pages/user/VirtualAccount';
import PaymentHistory from './pages/user/PaymentHistory';
import './index.css'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* 기본 시작 경로 */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            {/* 공통 페이지 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 사용자(User) 전용 경로 그룹화 */}
            <Route path="/user">
              <Route path="home" element={<Home />} />
              <Route path="payment" element={<Payment />} />
              <Route path="virtual-account" element={<VirtualAccount />} />
              <Route path="history" element={<PaymentHistory />} />
            </Route>
            
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;