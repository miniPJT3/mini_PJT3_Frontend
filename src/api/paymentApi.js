import axios from 'axios';

// 공통 설정이 담긴 인스턴스 생성
const api = axios.create({
  baseURL: '/api', 
  withCredentials: true, // 세션 로그인을 유지하기 위해 필수!
});

export const paymentApi = {
    // 1. 가상계좌 발급
    // axios.post -> api.post로 변경 (baseURL 적용을 위해)
    issueAccount: (data) => api.post('/payments/issue', data),

    // 2. 내 결제 내역 조회 (구매자)
    getMyHistory: () => api.get('/payments/history'),

    // 3. 입금 완료 보고
    reportDeposit: (payUuid) => api.post(`/payments/report-deposit/${payUuid}`),

    // 4. 판매자용 목록 조회
    // 백엔드에서 @GetMapping("/seller/history")로 바꿨다면 아래처럼 수정
    getPendingList: () => api.get('/payments/seller/history'),

    // 5. 판매자 최종 승인 처리 (판매자 ID 10은 백엔드에서 고정 처리함)
    approvePayment: (payUuid) => api.post(`/payments/approve/${payUuid}`)
};