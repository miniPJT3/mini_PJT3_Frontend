import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/user/Home'; // 추가
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
            {/* 로그인 안 된 상태면 로그인으로, 로그인 상태면 /home으로 보내는 로직이 보통 들어감 */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            <Route path="/home" element={<Home />} /> {/* 추가 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/virtual-account" element={<VirtualAccount />} />
            <Route path="/history" element={<PaymentHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;