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
import { useI18n } from 'vue-i18n';
import AuthBrandPanel from '@/components/Auth/AuthBrandPanel.vue';
import RegisterForm from '@/components/Auth/RegisterForm.vue';
import { useAuthStore } from '@/stores/Auth/AuthStore';

defineOptions({
  name: 'RegisterPage',
});

const router = useRouter();
const { t } = useI18n();
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

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return t('auth.errors.serviceUnavailable');
    if (error.response.status === 409) return t('auth.errors.registrationConflict');
    if (error.response.status === 400) return t('auth.errors.validation');
  }
  return t('auth.errors.registrationGeneric');
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
      message: t('auth.success.registration'),
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
