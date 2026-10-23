<template>
  <section class="recovery-view">
    <header class="recovery-header">
      <h2>{{ t('auth.recovery.title') }}</h2>
    </header>

    <q-form class="recovery-form" @submit.prevent="handleSubmit">
      <div class="recovery-field">
        <label for="recovery-email">{{ t('auth.fields.email') }}</label>
        <q-input
          id="recovery-email"
          v-model="email"
          type="email"
          :placeholder="t('auth.fields.emailPlaceholder')"
          outlined
          dense
          autocomplete="email"
          :rules="[
            (value) => !!value?.trim() || t('auth.validation.emailRequired'),
            (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t('auth.validation.emailInvalid'),
          ]"
        />
      </div>

      <div class="recovery-field">
        <label for="recovery-cpf">{{ t('auth.fields.cpf') }}</label>
        <q-input
          id="recovery-cpf"
          v-model="cpf"
          :placeholder="t('auth.fields.cpfPlaceholder')"
          outlined
          dense
          autocomplete="off"
          :rules="[
            (value) => !!value?.trim() || t('auth.validation.cpfRequired'),
            (value) => isValidCpf(String(value ?? '')) || t('auth.validation.cpfInvalid'),
          ]"
        />
      </div>

      <template v-if="isResetStep">
        <div class="recovery-field">
          <label for="recovery-password">{{ t('auth.fields.password') }}</label>
          <q-input
            id="recovery-password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('auth.fields.newPasswordPlaceholder')"
            outlined
            dense
            autocomplete="new-password"
            :rules="[
              (value) => !!value || t('auth.validation.passwordRequired'),
              (value) => String(value ?? '').length >= 15 || t('auth.validation.passwordMin'),
            ]"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>

        <div class="recovery-field">
          <label for="recovery-confirm-password">{{ t('auth.fields.confirmPassword') }}</label>
          <q-input
            id="recovery-confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="t('auth.fields.confirmNewPasswordPlaceholder')"
            outlined
            dense
            autocomplete="new-password"
            :rules="[
              (value) => !!value || t('auth.validation.confirmPasswordRequired'),
              (value) => value === password || t('auth.validation.passwordMismatch'),
            ]"
          >
            <template #append>
              <q-icon
                :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
        </div>
      </template>

      <div class="recovery-actions">
        <q-btn
          class="recovery-button"
          :label="t('auth.actions.confirm')"
          type="submit"
          unelevated
          no-caps
          :loading="loading"
          :disable="loading"
        />
        <q-btn
          v-if="isResetStep"
          class="recovery-button"
          :label="t('auth.actions.back')"
          type="button"
          unelevated
          no-caps
          :disable="loading"
          @click="emit('back')"
        />
        <q-btn
          v-else
          class="recovery-button"
          :label="t('auth.actions.backToLogin')"
          to="/login"
          unelevated
          no-caps
          :disable="loading"
        />
      </div>
    </q-form>

    <footer class="recovery-footer">
      <router-link to="/cadastro">{{ t('auth.login.register') }}</router-link>
      <router-link class="admin-link" to="/recuperar-senha?tipo=admin">
        {{ t('auth.recovery.adminLink') }}
      </router-link>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type {
  PasswordRecoveryReset,
  PasswordRecoveryVerification,
} from '@/services/AuthService';

defineOptions({
  name: 'PasswordRecoveryForm',
});

const { t } = useI18n();

type RecoveryStep = 'identify' | 'reset';

const props = defineProps<{
  step: RecoveryStep;
  loading?: boolean;
}>();

const emit = defineEmits<{
  verify: [data: PasswordRecoveryVerification];
  reset: [data: PasswordRecoveryReset];
  back: [];
}>();

const isResetStep = computed(() => props.step === 'reset');
const email = ref('');
const cpf = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

function isValidCpf(value: string): boolean {
  const digits = value.replace(/\D/g, '');

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  const calculateDigit = (length: number): number => {
    let sum = 0;

    for (let index = 0; index < length; index++) {
      sum += Number(digits[index]) * (length + 1 - index);
    }

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(9) === Number(digits[9]) &&
    calculateDigit(10) === Number(digits[10])
  );
}

function handleSubmit() {
  if (props.loading) return;

  const normalizedEmail = email.value.trim();
  const normalizedCpf = cpf.value.replace(/\D/g, '');

  if (props.step === 'identify') {
    emit('verify', { email: normalizedEmail, cpf: normalizedCpf });
    return;
  }

  emit('reset', {
    email: normalizedEmail,
    cpf: normalizedCpf,
    newPassword: password.value,
    confirmPassword: confirmPassword.value,
  });
}
</script>
