import axios from 'axios';

const api = axios.create({
  // Vite 프록시를 쓰지 않는다면 전체 주소를 적어줍니다.
  baseURL: 'http://localhost:8080/api', 
  withCredentials: true, // 백엔드 세션/쿠키 통신을 위해 필수!
});

export const paymentApi = {
  // 1. 가상계좌 발급 (POST /api/payments/issue)
    issueAccount: (data) => api.post('/payments/issue', data),

    // 2. 내 결제 내역 조회 (GET /api/payments/history) - 기존
    getMyHistory: () => api.get('/payments/history'),

    // 3. 입금 완료 보고 (POST /api/payments/report-deposit/{payUuid})
    reportDeposit: (payUuid) => api.post(`/payments/report-deposit/${payUuid}`),

    // 4. 판매자 대시보드 목록 조회 (GET /api/payments/seller/{sellerId}/history)
    getSellerPaymentHistory: (sellerId) => api.get(`/payments/seller/${sellerId}/history`),

    // 5. 판매자 최종 승인 처리 (POST /api/payments/approve/{payUuid})
    approvePayment: (payUuid) => api.post(`/payments/approve/${payUuid}`),

    // 6. 결제 이력 조회 (GET /api/v1/payment-history) - New
    getPaymentHistoryV1: () => api.get('/v1/payment-history'),

    // 7. 결제 이력 상세 조회 (GET /api/v1/payment-history/{paymentid}) - New
    getPaymentHistoryDetailV1: (paymentId) => api.get(`/v1/payment-history/${paymentId}`),
};