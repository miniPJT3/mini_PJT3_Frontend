import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      userInfo: null, // { name, role, email } 등을 저장
      accessToken: null,

      login: (userInfo, token) => set({ 
        isLoggedIn: true, 
        userInfo: userInfo,
        accessToken: token,
      }),

      logout: () => set({ 
        isLoggedIn: false, 
        userInfo: null,
        accessToken: null,
      }),
    }),
    { name: 'auth-storage' } // 브라우저 새로고침 시에도 로그인 유지
  )
);