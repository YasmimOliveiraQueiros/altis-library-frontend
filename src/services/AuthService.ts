import { api } from '@/boot/axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'USER';
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: string;
}

type RegisterResponse = void;

interface PasswordRecoveryVerification {
  email: string;
  cpf: string;
}

interface PasswordRecoveryReset {
  email: string;
  cpf: string;
  newPassword: string;
  confirmPassword: string;
}

async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials);

  return response.data;
}

async function register(data: RegisterCredentials): Promise<RegisterResponse> {
  await api.post<void>('/users', data);
}

async function verifyPasswordRecovery(
  data: PasswordRecoveryVerification,
): Promise<void> {
  await api.post<void>('/auth/password-recovery/verify', data);
}

async function resetPassword(data: PasswordRecoveryReset): Promise<void> {
  await api.post<void>('/auth/password-recovery/reset', data);
}

export const authService = {
  login,
  register,
  verifyPasswordRecovery,
  resetPassword,
};

export type {
  LoginCredentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  PasswordRecoveryVerification,
  PasswordRecoveryReset,
};
