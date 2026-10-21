
<template>
  <div class="login-page">
    <AuthBrandPanel />

    <AuthForm
      :loading="loading"
      :error-message="errorMessage"
      @submit="handleLogin"
    />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoginPage',
});

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import AuthBrandPanel from '@/components/Auth/AuthBrandPanel.vue';
import AuthForm from '@/components/Auth/AuthForm.vue';
import { useAuthStore } from '@/stores/Auth/AuthStore';

import type { LoginCredentials } from '@/services/AuthService';

const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const errorMessage = ref('');

async function handleLogin(credentials: LoginCredentials) {
  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(credentials);

    await router.push('/dashboard');
  } catch {
    errorMessage.value = 'E-mail ou senha inválidos. Tente novamente.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

@media (max-width: 700px) {
  .login-page {
    flex-direction: column;
  }
}
</style>
