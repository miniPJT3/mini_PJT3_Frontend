import axios from 'axios';

const api = axios.create({
  // Vite 프록시를 쓰지 않는다면 전체 주소를 적어줍니다.
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, // 백엔드 세션/쿠키 통신을 위해 필수!
});

export const paymentApi = {
  // 발급 요청
  issueAccount: (data) => api.post('/payments/issue', {
    productName: data.productName,
    depositedAmount: data.amount, // DTO의 depositedAmount와 이름 맞춤
    // payUuid, transactionId는 빈 값으로 보냄 (서버 Validation 통과용)
    payUuid: "", 
    transactionId: ""
  }),

  
  confirmDeposit: (data) => api.post('/payments/deposit', data),
};