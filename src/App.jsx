import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import SellerDashboardPage from './pages/SellerDashboardPage';
import './App.css';

function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold text-gray-900">
        가상계좌 결제 시스템
      </h1>
      <p className="mt-3 text-gray-600">
        판매자 대시보드 테스트는 상단 메뉴 또는 /seller/dashboard 주소로 확인하세요.
      </p>
    </main>
  );
}

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 판매자 대시보드 테스트 라우트 */}
        <Route path="/seller/dashboard" element={<SellerDashboardPage />} />

        {/* 잘못된 주소로 들어오면 홈으로 이동 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;