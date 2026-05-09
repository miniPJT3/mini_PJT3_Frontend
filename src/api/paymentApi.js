import axios from 'axios';

const api = axios.create({
  // Vite 프록시를 쓰지 않는다면 전체 주소를 적어줍니다.
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, // 백엔드 세션/쿠키 통신을 위해 필수!
});

export const paymentApi = {
  // 1. 가상계좌 발급 (POST /api/payments/issue)
    issueAccount: (data) => axios.post('/api/payments/issue', data),

    // 2. 내 결제 내역 조회 (GET /api/payments/history)
    getMyHistory: () => axios.get('/api/payments/history'),

    // 3. 입금 완료 보고 (POST /api/payments/report-deposit/{payUuid})
    reportDeposit: (payUuid) => axios.post(`/api/payments/report-deposit/${payUuid}`),

    // 4. 판매자용 승인 대기 목록 조회 (GET /api/payments/seller/1/pending) 🥊
    // 백엔드 경로가 /seller/{sellerId}/pending 이므로 ID 1을 넣어서 호출합니다.
    getPendingList: () => axios.get('/api/payments/seller/1/pending'),

    // 5. 판매자 최종 승인 처리 (POST /api/payments/approve/{payUuid})
    approvePayment: (payUuid) => axios.post(`/api/payments/approve/${payUuid}`)
};