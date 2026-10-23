<template>
  <div class="recovery-page">
    <AuthBrandPanel />

    <main class="recovery-panel">
      <div class="recovery-content">
        <PasswordRecoveryAdmin v-if="isAdmin" />
        <PasswordRecoveryForm
          v-else
          :step="step"
          :loading="isLoading"
          @verify="handleVerification"
          @reset="handlePasswordReset"
          @back="step = 'identify'"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, ref } from 'vue';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AuthBrandPanel from '@/components/Auth/AuthBrandPanel.vue';
import PasswordRecoveryAdmin from '@/components/Auth/PasswordRecoveryAdmin.vue';
import PasswordRecoveryForm from '@/components/Auth/PasswordRecoveryForm.vue';
import { useAuthStore } from '@/stores/Auth/AuthStore';
import type {
  PasswordRecoveryReset,
  PasswordRecoveryVerification,
} from '@/services/AuthService';

defineOptions({
  name: 'PasswordRecoveryPage',
});

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const authStore = useAuthStore();
const isAdmin = computed(() => route.query.tipo === 'admin');
const step = ref<'identify' | 'reset'>('identify');
const busy = ref<'verify' | 'reset' | null>(null);
const isLoading = computed(() => busy.value !== null);

function getOperationErrorMessage(
  error: unknown,
  operation: 'verify' | 'reset',
): string {
  if (axios.isAxiosError(error) && !error.response) {
    return t('auth.errors.serviceUnavailable');
  }

  if (axios.isAxiosError(error) && error.response?.status === 400) {
    return t('auth.errors.validation');
  }

  return operation === 'verify'
    ? t('auth.errors.identityVerification')
    : t('auth.errors.passwordReset');
}

async function handleVerification(data: PasswordRecoveryVerification) {
  if (busy.value) return;
  busy.value = 'verify';

  try {
    await authStore.verifyPasswordRecovery(data);
    step.value = 'reset';
  } catch (error: unknown) {
    Notify.create({
      type: 'negative',
      message: getOperationErrorMessage(error, 'verify'),
      position: 'top',
    });
  } finally {
    busy.value = null;
  }
}

async function handlePasswordReset(data: PasswordRecoveryReset) {
  if (busy.value) return;
  busy.value = 'reset';

  try {
    await authStore.resetPassword(data);
  } catch (error: unknown) {
    Notify.create({
      type: 'negative',
      message: getOperationErrorMessage(error, 'reset'),
      position: 'top',
    });
    return;
  } finally {
    busy.value = null;
  }

  Notify.create({
    type: 'positive',
    message: t('auth.success.passwordReset'),
    position: 'top',
  });
  await router.push('/login');
}
</script>

<style scoped>
.recovery-page {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
}

.recovery-panel {
  display: flex;
  flex: 1;
  align-items: stretch;
  justify-content: center;
  min-width: 0;
  min-height: 100vh;
  padding: 32px 24px;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #111111;
}

.recovery-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 350px;
  min-height: calc(100vh - 64px);
}

:deep(.recovery-view) {
  display: flex;
  flex: 1;
  flex-direction: column;
}

:deep(.recovery-header h2) {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
}

:deep(.recovery-header p) {
  margin: 0;
  font-size: 16px;
}

:deep(.recovery-form) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 36px;
}

:deep(.recovery-field label) {
  display: block;
  margin-bottom: 6px;
  color: #1d3b5c;
  font-size: 14px;
}

:deep(.recovery-field .q-field__control) {
  border-radius: 6px;
}

:deep(.recovery-actions) {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  margin-top: 22px;
}

:deep(.recovery-button) {
  width: 220px;
  max-width: 100%;
  flex: none;
  min-height: 40px;
  border-radius: 6px;
  background-color: #1d3b5c;
  color: #ffffff;
}

:deep(.recovery-footer) {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-top: auto;
  padding-top: 48px;
}

:deep(.recovery-footer a) {
  color: #1d3b5c;
  font-size: 14px;
  text-decoration: none;
}

:deep(.recovery-footer a:hover) {
  text-decoration: underline;
}

:deep(.recovery-footer .admin-link) {
  color: #555555;
}

@media (max-width: 700px) {
  .recovery-page {
    flex-direction: column;
  }

  .recovery-panel {
    flex: 1;
    min-height: auto;
    padding: 28px 24px;
  }

  .recovery-content {
    min-height: auto;
  }

  :deep(.recovery-header h2) {
    font-size: 22px;
  }

  :deep(.recovery-form) {
    margin-top: 28px;
  }

  :deep(.recovery-footer) {
    margin-top: 48px;
    padding-top: 0;
  }

}
</style>
