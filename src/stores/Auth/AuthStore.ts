import { defineStore } from 'pinia';
import { authService } from '@/services/AuthService';
import type {
  LoginCredentials,
  PasswordRecoveryReset,
  PasswordRecoveryVerification,
  RegisterCredentials,
} from '@/services/AuthService';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'USER' | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role') as AuthState['role'],
  }),

  getters: {
    isAuthenticated: (state) => state.token !== null,
    isAdmin: (state) => state.role === 'ADMIN',
  },

  actions: {
    async login(credentials: LoginCredentials) {
      const response = await authService.login(credentials);

      this.token = response.token;
      this.role = response.role;
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);

      return response;
    },

    async register(data: RegisterCredentials) {
      return authService.register(data);
    },

    async verifyPasswordRecovery(data: PasswordRecoveryVerification) {
      return authService.verifyPasswordRecovery(data);
    },

    async resetPassword(data: PasswordRecoveryReset) {
      return authService.resetPassword(data);
    },

    clearSession() {
      this.token = null;
      this.role = null;

      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});
