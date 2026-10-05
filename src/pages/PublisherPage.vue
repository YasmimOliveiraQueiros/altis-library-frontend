<template>
  <q-page class="publisher-page">
    <!-- Resumo -->
    <section class="page-top">
      <div class="summary-cards">
        <q-card flat bordered class="summary-card">
          <div class="summary-label">
            <span class="status-dot editoras"></span>
            Editoras
          </div>

          <div class="summary-value">
            0
          </div>
        </q-card>

        <q-card flat bordered class="summary-card">
          <div class="summary-label">
            <span class="status-dot livros"></span>
            Livros vinculados
          </div>

          <div class="summary-value">
            0
          </div>
        </q-card>
      </div>

      <q-btn
        label="+ Nova editora"
        class="new-publisher-btn"
        unelevated
      />
    </section>

    <!-- Pesquisa -->
    <section class="search-section">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Buscar por nome ou e-mail"
        class="search-input"
      />
    </section>

    <!-- Tabela -->
    <section class="table-section">
      <q-table
        flat
        :rows="[]"
        :columns="columns"
        row-key="id"
        hide-pagination
        :rows-per-page-options="[0]"
        no-data-label="Dados serão carregados pelo backend."
        class="publisher-table"
      />
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const columns = [
  {
    name: 'name',
    label: 'Nome',
    field: 'name',
    align: 'left' as const,
  },
  {
    name: 'email',
    label: 'E-mail',
    field: 'email',
    align: 'left' as const,
  },
  {
    name: 'books',
    label: 'Livros cadastrados',
    field: 'books',
    align: 'center' as const,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center' as const,
  },
  {
    name: 'actions',
    label: 'Ação',
    field: 'actions',
    align: 'center' as const,
  },
]
</script>

<style scoped>
.publisher-page {
  padding: 15px 20px;
  background-color: #ffffff;
  color: #1b3a5c;
}

/* Parte superior */

.page-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 25px;
}

.summary-cards {
  display: flex;
  gap: 15px;
}

.summary-card {
  width: 125px;
  height: 80px;
  padding: 8px;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  background: #ffffff;
}

.summary-label {
  display: flex;
  align-items: center;
  color: #34454d;
  font-size: 13px;
  white-space: nowrap;
}

.status-dot {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
}

.status-dot.editoras {
  background: #19a56f;
}

.status-dot.livros {
  background: #e94b4b;
}

.summary-value {
  margin-top: 8px;
  color: #1b3a5c;
  font-size: 30px;
  line-height: 30px;
  font-weight: 600;
  text-align: center;
}

/* Botão */

.new-publisher-btn {
  width: 130px;
  height: 80px;
  margin-left: auto;
  background: #1b3a5c;
  color: #ffffff;
  border-radius: 5px;
  font-size: 14px;
}

/* Pesquisa */

.search-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.search-input {
  width: 100%;
}

/* Tabela */

.table-section {
  width: 100%;
  min-height: 250px;
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  background-color: #ffffff;
}

.publisher-table {
  width: 100%;
}

.publisher-table :deep(th) {
  border-bottom: 1px solid #bdbdbd;
  color: #1b3a5c;
  font-size: 13px;
  font-weight: 600;
}

.publisher-table :deep(td) {
  border-bottom: 1px solid #eeeeee;
  color: #444444;
  font-size: 13px;
}
</style>