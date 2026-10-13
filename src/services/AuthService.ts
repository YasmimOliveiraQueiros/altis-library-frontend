import { api } from '@/boot/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'USER';
}

async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);

  return response.data;
}

export const authService = {
  login,
};

export type { LoginCredentials, LoginResponse };