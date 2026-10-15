<template>
  <div class="register-page">
    <AuthBrandPanel />
    <RegisterForm @submit="handleRegister" />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import AuthBrandPanel from '@/components/Auth/AuthBrandPanel.vue';
import RegisterForm from '@/components/Auth/RegisterForm.vue';
import { useAuthStore } from '@/stores/Auth/AuthStore';

defineOptions({
  name: 'RegisterPage',
});

const router = useRouter();
const authStore = useAuthStore();

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  cpf: string;
  birthDate: string;
  address: string;
  confirmPassword: string;
}

function getBackendMessage(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;

  const data: unknown = error.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  if (data && typeof data === 'object') {
    const body = data as Record<string, unknown>;
    for (const key of ['message', 'detail', 'error']) {
      const value = body[key];
      if (typeof value === 'string' && value.trim())
        return value;
      }
  }
  return undefined;
}

function getErrorMessage(error: unknown): string {
  const backendMessage = getBackendMessage(error);
  if (backendMessage) return backendMessage;

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.';
    }
    if (error.response.status === 409) return 'Este e-mail ou CPF já está cadastrado.';
    if (error.response.status === 400) return 'Confira os dados informados e tente novamente.';
  }
  return 'Não foi possível realizar o cadastro. Tente novamente.';
}

async function handleRegister(form: RegisterFormData) {
  const registerData = {
    name: form.name,
    email: form.email,
    password: form.password,
    phone: form.phone,
    cpf: form.cpf,
    birthDate: form.birthDate,
    address: form.address,
  };

  try {
    await authStore.register(registerData);
    Notify.create({
      type: 'positive',
      message: 'Cadastro realizado com sucesso!',
      position: 'top',
    });
    await router.push('/login');
  } catch (error: unknown) {
    Notify.create({
      type: 'negative',
      message: getErrorMessage(error),
      position: 'top',
    });
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

@media (max-width: 700px) {
  .register-page {
    flex-direction: column;
  }
}
</style>
