<template>
  <q-header class="app-header">

    <q-toolbar>

      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-menu')"
      />

      <div class="header-title">

        <div class="title">
          Altis+ Biblioteca
        </div>

        <div class="subtitle">
          {{ subtitle }}
        </div>

      </div>

      <q-space />

      <div class="avatar">
        LF
      </div>

    </q-toolbar>

  </q-header>
</template>

<script setup lang="ts">
defineProps<{
  subtitle: string;
}>();

defineEmits<{
  'toggle-menu': [];
}>();
</script>

<style scoped>
.app-header {
  background-color: #FFFFFF;
  color: #1B3A5C;
  border-bottom: 1px solid #BDBDBD;
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

.avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background-color: #1B3A5C;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
}
</style>