<template>
  <q-layout view="lHh Lpr lFf">

    <AppHeader
      :subtitle="subtitle"
      @toggle-menu="toggleLeftDrawer"
    />

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
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

const leftDrawerOpen = ref(false);
const route = useRoute();

const subtitles: Record<string, string> = {
  '/': 'Visão geral do sistema',
  '/alugueis': 'Controle de empréstimos de livros',
  '/livros': 'Controle de livros',
  '/editoras': 'Controle de editoras',
  '/usuarios': 'Controle de usuários',
};

const subtitle = computed(() => subtitles[route.path] ?? 'Visão geral do sistema');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>