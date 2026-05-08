import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 프론트엔드(5173 포트)에서 /api로 보내는 요청을 
      // 백엔드(8080 포트)로 연결해주는 설정입니다.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true, // 대상 서버의 호스트 헤더를 target 주소로 변경
        secure: false,      // SSL 인증서 검증 무시 (로컬 테스트용)
      },
    },
  },
})