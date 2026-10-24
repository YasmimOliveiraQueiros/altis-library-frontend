<template>
  <div class="profile-menu">
    <q-btn
      flat
      round
      class="profile-avatar">
      {{ isAdmin ? 'LF' : '' }}

      <q-menu>
        <q-list class="profile-list">
          <q-item v-if="!isAdmin" v-close-popup clickable @click="showEditProfileDialog = true">
            <q-item-section>{{ t('profile.editProfile') }}</q-item-section>
          </q-item>

          <q-item v-if="!isAdmin" v-close-popup clickable @click="showCloseAccountDialog = true">
            <q-item-section>{{ t('profile.deleteAccount') }}</q-item-section>
          </q-item>

          <q-separator v-if="!isAdmin" />

          <q-item 
          clickable
          @click="showLanguageDialog = true">
            <q-item-section>
              {{ t('profile.languageLabel') }}
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable @click="logout">
            <q-item-section>
              {{ t('profile.logout') }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <LanguageDialog v-model="showLanguageDialog" />
    <EditProfileDialog v-if="!isAdmin" v-model="showEditProfileDialog" />
    <ConfirmDeleteDialog
      v-model="showCloseAccountDialog"
      :title="t('profile.closeAccount.title')"
      :message="t('profile.closeAccount.confirmation')"
      :cancel-label="t('profile.closeAccount.cancel')"
      :confirm-label="t('profile.deleteAccount')"
      :error-message="closeAccountError"
      :loading="closingAccount"
      @confirm="closeAccount"
      @cancel="closeAccountError = ''"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LanguageDialog from './LanguageDialog.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/Auth/AuthStore';
import { UserService } from '@/services/UserService';
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog.vue';
import axios from 'axios';
import { Notify } from 'quasar';
import EditProfileDialog from './EditProfileDialog.vue';

const { t } = useI18n();

const router = useRouter();
const authStore = useAuthStore();

function logout() {
  authStore.clearSession();
  void router.replace('/login');
}

defineProps<{
  isAdmin: boolean;
}>();

const showLanguageDialog = ref(false);
const showEditProfileDialog = ref(false);
const showCloseAccountDialog = ref(false);
const closingAccount = ref(false);
const closeAccountError = ref('');

async function closeAccount() {
  if (closingAccount.value || authStore.isAdmin) return;
  closingAccount.value = true;
  closeAccountError.value = '';
  try {
    await UserService.closeMyAccount();
    authStore.clearSession();
    Notify.create({ type: 'positive', message: t('profile.closeAccount.success'), position: 'top' });
    await router.replace('/login');
  } catch (error: unknown) {
    const response = axios.isAxiosError(error) ? error.response : undefined;
    const data = response?.data as { message?: string } | string | undefined;
    closeAccountError.value = (typeof data === 'string' ? data : data?.message) ||
      (response?.status === 409 ? t('profile.closeAccount.pendingLoans') : t('profile.closeAccount.error'));
  } finally {
    closingAccount.value = false;
  }
}

</script>

<style scoped>
.profile-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background-color: #1b3a5c;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

.profile-list {
  min-width: 180px;
  padding: 6px 0;
}

.profile-list .q-item {
  min-height: 40px;
  color: #1b3a5c;
  font-size: 14px;
}
</style>
