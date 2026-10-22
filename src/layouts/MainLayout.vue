<template>
  <q-layout view="lHh Lpr lFf">
    <AppHeader :subtitle="subtitle" @toggle-menu="toggleLeftDrawer" />

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <SidebarMenu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import SidebarMenu from '@/components/layout/SidebarMenu.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import { useAuthStore } from '@/stores/Auth/AuthStore';
import { useI18n } from 'vue-i18n';

const leftDrawerOpen = ref(false);
const route = useRoute();
const authStore = useAuthStore();
const { t } = useI18n();

const subtitleKeys: Record<string, string> = {
  '/': 'navigation.subtitles.overview',
  '/dashboard': 'navigation.subtitles.overview',
  '/alugueis': 'navigation.subtitles.loans',
  '/livros': 'navigation.subtitles.books',
  '/editoras': 'navigation.subtitles.publishers',
  '/usuarios': 'navigation.subtitles.users',
};

const subtitle = computed(() =>
  authStore.role === 'USER'
    ? t('readerDashboard.subtitle')
    : t(subtitleKeys[route.path] ?? 'navigation.subtitles.overview'),
);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
