<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Altis Library
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered>

      <q-list>
        <q-item-label header>
          Menu
        </q-item-label>

        <q-item clickable to="/">
          <q-item-section avatar>
            <q-icon name="dashboard" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Dashboard</q-item-label>
        </q-item-section>
        </q-item>

        <q-item clickable to="/alugueis">
          <q-item-section avatar>
            <q-icon name="menu_book" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Aluguéis</q-item-label>
        </q-item-section>
        </q-item>

        <q-item clickable to="/livros">
          <q-item-section avatar>
            <q-icon name="book" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Livros</q-item-label>
        </q-item-section>
        </q-item>

        <q-item clickable to="/editoras">
          <q-item-section avatar>
            <q-icon name="business" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Editoras</q-item-label>
        </q-item-section>
        </q-item>

        <q-item clickable to="/usuarios">
          <q-item-section avatar>
            <q-icon name="people" />
        </q-item-section>

        <q-item-section>
          <q-item-label>Usuários</q-item-label>
        </q-item-section>
        </q-item>
        
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>