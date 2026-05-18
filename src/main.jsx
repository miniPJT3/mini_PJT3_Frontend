import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios' // axios 임포트 추가
import './index.css'
import App from './App.jsx'

// Axios 전역 설정 추가
// 서버와 쿠키(세션/JWT)를 주고받음
axios.defaults.withCredentials = true;


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)