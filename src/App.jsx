import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from "./pages/AdminDashboard"; 
import Simulator from './pages/Simulator';
import './index.css'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4">
          <Routes>
            {/* 로그인 경로 */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            {/* 회원가입 경로 */}
            <Route path="/register" element={<Register />} />
            {/* 관리자 대시보드 경로 */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* 시뮬레이터 화면 경로 */}
            <Route path="/simulator" element={<Simulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;