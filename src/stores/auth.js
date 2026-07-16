import { defineStore } from 'pinia';
import api from '@/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
  }),

  actions: {
    async login(login, password) {
      try {
        const response = await api.post('/auth/login', { login, password });
        const { accessToken, refreshToken, email: userEmail, fullName } = response.data;

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = { email: userEmail, fullName };
        this.isAuthenticated = true;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify({ email: userEmail, fullName }));

        return { success: true };

      } catch (error) {
        return {
          success: false,
          message: error.response?.data || 'Ошибка входа'
        };
      }
    },

    async register(email, password, fullName, phone, birthDate) {
      try {
        const response = await api.post('/auth/register', {
          email, password, fullName, phone, birthDate
        });
        const { accessToken, refreshToken, email: userEmail, fullName: userName } = response.data;

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = { email: userEmail, fullName: userName };
        this.isAuthenticated = true;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify({ email: userEmail, fullName: userName }));

        return { success: true };

      } catch (error) {
        return {
          success: false,
          message: error.response?.data || 'Ошибка регистрации'
        };
      }
    },

    logout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      this.isAuthenticated = false;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },

    loadUserFromStorage() {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        this.accessToken = token;
        this.refreshToken = localStorage.getItem('refreshToken');
        this.user = JSON.parse(userData);
        this.isAuthenticated = true;
      }
    },

    updateUser(userData) {
      this.user = { ...this.user, ...userData };
      localStorage.setItem('user', JSON.stringify(this.user));
    },
  },
});
