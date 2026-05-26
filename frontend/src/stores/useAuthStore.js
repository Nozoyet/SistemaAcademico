import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (nombreUsuario, contrasena) => {
        const res = await api.post('/auth/login', { nombreUsuario, contrasena });
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
        return user; // para redirigir según rol
      },

      logout: async () => {
        try { await api.post('/auth/logout'); } catch (_) {}
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;