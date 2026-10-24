<template>
  <q-dialog v-model="dialog" :persistent="loading">
    <q-card class="edit-profile-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-profile-title">
      <q-card-section class="dialog-header">
        <div id="edit-profile-title" class="text-h6">{{ t('profile.editProfile') }}</div>
        <q-btn flat round dense icon="close" :aria-label="t('profile.closeAccount.cancel')" :disable="loading" @click="dialog = false" />
      </q-card-section>
      <q-card-section class="dialog-content">
        <div v-if="loadError" class="text-negative q-mb-md" role="alert">
          {{ loadError }}
          <q-btn flat dense :label="t('readerDashboard.retry')" :loading="loadingProfile" @click="loadProfile" />
        </div>
        <q-spinner v-if="loadingProfile" size="32px" />
        <q-form v-else-if="profile" class="profile-form" @submit.prevent="saveProfile">
      <h2 class="text-subtitle1">{{ t('profile.personalData') }}</h2>
      <q-input v-model="form.name" :label="t('auth.fields.fullName')" autocomplete="name" outlined :disable="loading"
        :rules="[value => !!String(value ?? '').trim() || t('auth.validation.nameRequired')]" />
      <q-input v-model="form.email" :label="t('auth.fields.email')" type="email" autocomplete="email" outlined :disable="loading"
        :rules="[value => !!String(value ?? '').trim() || t('auth.validation.emailRequired'), value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '')) || t('auth.validation.emailInvalid')]" />
      <q-input v-model="form.phone" :label="t('auth.fields.phone')" type="tel" autocomplete="tel" outlined :disable="loading"
        :rules="[value => !!String(value ?? '').trim() || t('auth.validation.phoneRequired')]" />
      <q-input v-model="form.address" :label="t('auth.fields.address')" autocomplete="street-address" outlined :disable="loading"
        :rules="[value => !!String(value ?? '').trim() || t('auth.validation.addressRequired')]" />
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6"><q-input :model-value="profile.cpf" :label="t('auth.fields.cpf')" outlined readonly /></div>
        <div class="col-12 col-sm-6"><q-input :model-value="formattedBirthDate" :label="t('auth.fields.birthDate')" outlined readonly /></div>
      </div>

      <h2 class="text-subtitle1">{{ t('profile.passwordSection') }}</h2>
      <q-input v-model="form.currentPassword" :label="t('profile.currentPassword')" :type="showCurrentPassword ? 'text' : 'password'" autocomplete="current-password" outlined :disable="loading"
        :rules="[passwordRule]">
        <template #append><q-btn flat round dense :icon="showCurrentPassword ? 'visibility' : 'visibility_off'" :aria-label="t('profile.togglePassword')" @click="showCurrentPassword = !showCurrentPassword" /></template>
      </q-input>
      <q-input v-model="form.newPassword" :label="t('profile.newPassword')" :type="showNewPassword ? 'text' : 'password'" autocomplete="new-password" outlined :disable="loading"
        :rules="[passwordRule, value => !value || value.length >= 15 || t('auth.validation.passwordMin')]">
        <template #append><q-btn flat round dense :icon="showNewPassword ? 'visibility' : 'visibility_off'" :aria-label="t('profile.togglePassword')" @click="showNewPassword = !showNewPassword" /></template>
      </q-input>
      <q-input v-model="form.confirmPassword" :label="t('profile.confirmPassword')" :type="showConfirmPassword ? 'text' : 'password'" autocomplete="new-password" outlined :disable="loading"
        :rules="[passwordRule, value => !value || value === form.newPassword || t('auth.validation.passwordMismatch')]">
        <template #append><q-btn flat round dense :icon="showConfirmPassword ? 'visibility' : 'visibility_off'" :aria-label="t('profile.togglePassword')" @click="showConfirmPassword = !showConfirmPassword" /></template>
      </q-input>
      <div v-if="errorMessage" class="text-negative q-mb-md" role="alert">{{ errorMessage }}</div>
      <q-btn type="submit" color="primary" :label="t('profile.saveChanges')" :loading="loading" :disable="loading" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { Notify } from 'quasar';
import { useI18n } from 'vue-i18n';
import { UserService } from '@/services/UserService';
import type { UserResponse } from '@/types/User';
import { useAuthStore } from '@/stores/Auth/AuthStore';

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});
const profile = ref<UserResponse | null>(null);
const loadingProfile = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const loadError = ref('');
const form = reactive({ name: '', email: '', phone: '', address: '', currentPassword: '', newPassword: '', confirmPassword: '' });
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const hasPasswordChange = computed(() => Boolean(form.currentPassword || form.newPassword || form.confirmPassword));
const formattedBirthDate = computed(() => {
  if (!profile.value?.birthDate) return '';
  const [year, month, day] = profile.value.birthDate.slice(0, 10).split('-').map(Number);
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(Date.UTC(year!, month! - 1, day)));
});

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    loadError.value = '';
    errorMessage.value = '';
    profile.value = null;
    Object.assign(form, { currentPassword: '', newPassword: '', confirmPassword: '' });
    void loadProfile();
  } else {
    Object.assign(form, { currentPassword: '', newPassword: '', confirmPassword: '' });
  }
});

const passwordRule = (value: string) => !hasPasswordChange.value || !!value || t('profile.passwordFieldsRequired');

function getErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) return t('profile.errors.generic');
  if (!error.response) return t('users.errors.serviceUnavailable');
  const data = error.response.data as { message?: string } | string | undefined;
  if (typeof data === 'string' && data) return data;
  if (data && typeof data === 'object' && data.message) return data.message;
  if (error.response.status === 401) return t('users.errors.unauthorized');
  if (error.response.status === 409) return t('profile.errors.conflict');
  return t('profile.errors.generic');
}

function getPasswordErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && error.response?.status === 400) {
    const data = error.response.data as { message?: string } | string | undefined;
    if (typeof data === 'string' && data) return data;
    if (data && typeof data === 'object' && data.message) return data.message;
    return t('profile.errors.currentPassword');
  }
  return getErrorMessage(error);
}

async function loadProfile() {
  loadingProfile.value = true;
  try {
    profile.value = await UserService.getMyProfile();
    Object.assign(form, { name: profile.value.name, email: profile.value.email, phone: profile.value.phone, address: profile.value.address });
  } catch (error) {
    loadError.value = getErrorMessage(error);
  } finally {
    loadingProfile.value = false;
  }
}

async function saveProfile() {
  if (!profile.value || loading.value) return;
  if (hasPasswordChange.value && (!form.currentPassword || !form.newPassword || !form.confirmPassword)) {
    errorMessage.value = t('profile.passwordFieldsRequired');
    return;
  }
  loading.value = true;
  errorMessage.value = '';
  let personalDataSaved = false;
  try {
    profile.value = await UserService.updateMyProfile({ name: form.name, email: form.email, phone: form.phone, address: form.address });
    personalDataSaved = true;
    if (hasPasswordChange.value) {
      try {
        await UserService.changeMyPassword({ currentPassword: form.currentPassword, newPassword: form.newPassword, confirmPassword: form.confirmPassword });
      } catch (error) {
        errorMessage.value = t('profile.partialUpdate', { error: getPasswordErrorMessage(error) });
        return;
      }
      authStore.clearSession();
      Notify.create({ type: 'positive', message: t('profile.success.profileAndPassword'), position: 'top-right' });
      dialog.value = false;
      await router.replace('/login');
      return;
    }
    Notify.create({ type: 'positive', message: t('profile.success.profile'), position: 'top-right' });
    dialog.value = false;
  } catch (error) {
    errorMessage.value = personalDataSaved ? t('profile.partialUpdate', { error: getErrorMessage(error) }) : getErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

</script>

<style scoped>
.edit-profile-dialog { width: 620px; max-width: 94vw; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; }
.dialog-header { display: flex; align-items: center; justify-content: space-between; color: #1b3a5c; }
.dialog-content { min-height: 0; overflow-y: auto; }
.profile-form { display: flex; flex-direction: column; gap: 12px; }
.profile-form h2 { margin: 8px 0 0; color: #1b3a5c; }
</style>
