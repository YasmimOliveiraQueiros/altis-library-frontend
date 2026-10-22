<template>
  <div class="sidebar">
    <div class="logo">
      <q-icon name="menu_book" size="36px" />
    </div>

    <q-list class="menu-list">
      <q-item clickable :to="dashboardPath" exact active-class="menu-item-active">
        <q-item-section avatar>
          <q-icon name="dashboard" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ t('navigation.dashboard') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="authStore.isAdmin" clickable to="/alugueis" active-class="menu-item-active">
        <q-item-section avatar>
          <q-icon name="menu_book" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ t('navigation.loans') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="authStore.isAdmin" clickable to="/livros" active-class="menu-item-active">
        <q-item-section avatar>
          <q-icon name="book" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ t('navigation.books') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="authStore.isAdmin" clickable to="/editoras" active-class="menu-item-active">
        <q-item-section avatar>
          <q-icon name="business" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ t('navigation.publishers') }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="authStore.isAdmin" clickable to="/usuarios" active-class="menu-item-active">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ t('navigation.users') }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div v-if="authStore.isAdmin" class="admin">
      {{ t('navigation.admin') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/Auth/AuthStore';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const { t } = useI18n();
const dashboardPath = computed(() => (authStore.isAdmin ? '/dashboard' : '/meu-dashboard'));
</script>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #1b3a5c;
  color: white;
}

.logo {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
}

.menu-list {
  padding-top: 12px;
}

.menu-item-active {
  background-color: rgba(255, 255, 255, 0.22);
  border-radius: 6px;
  margin: 4px 8px;
}

.admin {
  margin-top: auto;
  padding: 25px;
  text-align: center;
  font-weight: 600;
}
</style>
