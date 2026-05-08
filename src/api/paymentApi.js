import axios from 'axios';

const api = axios.create({
  // Vite 프록시를 쓰지 않는다면 전체 주소를 적어줍니다.
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, // 백엔드 세션/쿠키 통신을 위해 필수!
});

export const paymentApi = {
  // 발급 요청
  issueAccount: (data) => api.post('/payments/issue', data),
 // 입금 확인 요청
  confirmDeposit: (data) => api.post('/payments/deposit', data),
  // 결제 내역 가져오기 추가
  getHistory: () => api.get('/payments/history')
};