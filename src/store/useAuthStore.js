import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      // Login.jsx나 다른 컴포넌트에서 직관적으로 쓰도록 상태명 정렬
      isAuthenticated: false, 
      user: null, // { name, role, email, ... } 백엔드가 주는 유저 객체 저장

      // 로그인 성공 시 호출되어 상태를 업데이트하는 함수
      login: (userData) => set({ 
        isAuthenticated: true, 
        user: userData 
      }),

      // 로그아웃 시 상태를 초기화하는 함수
      logout: () => set({ 
        isAuthenticated: false, 
        user: null 
      }),
    }),
    { 
      name: 'auth-storage', // 저장소에 기록될 키 이름
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      }
    }
  )
);