<template>
  <q-header class="app-header">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        :aria-label="t('navigation.openMenu')"
        @click="$emit('toggle-menu')"
      />

      <div class="header-title">
        <div class="title">Altis+ Biblioteca</div>

        <div class="subtitle">
          {{ subtitle }}
        </div>
      </div>

      <q-space />

      <ProfileMenu :is-admin="authStore.isAdmin" />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import ProfileMenu from '@/components/layout/ProfileMenu/ProfileMenu.vue';
import { useAuthStore } from '@/stores/Auth/AuthStore';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const { t } = useI18n();
defineProps<{
  subtitle: string;
}>();

defineEmits<{
  'toggle-menu': [];
}>();
</script>

<style scoped>
.app-header {
  background-color: #ffffff;
  color: #1b3a5c;
  border-bottom: 1px solid #bdbdbd;
  box-shadow: none;
}

.q-toolbar {
  min-height: 88px;
  padding: 0 20px;
}

.header-title {
  margin-left: 10px;
}

.title {
  font-size: 22px;
  font-weight: 700;
}

.subtitle {
  font-size: 14px;
  margin-top: 2px;
}
</style>
