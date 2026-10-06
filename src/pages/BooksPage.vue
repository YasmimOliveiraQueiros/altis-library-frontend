<template>
  <q-page class="books-page">
    <!-- Cards -->
    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-label">
          <span class="dot available"></span>
          Disponíveis
        </div>
        <div class="stat-value">0</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">
          <span class="dot rented"></span>
          Alugados
        </div>
        <div class="stat-value">0</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">
          <span class="dot total"></span>
          Total
        </div>
        <div class="stat-value">0</div>
      </div>

      <q-btn
        class="new-book-button"
        label="+ Novo livro"
        unelevated
        @click="showBookForm = true"
      />
    </section>

    <!-- Pesquisa e filtro -->
    <section class="filters-section">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Buscar por título ou autor"
        class="search-input"
      />

      <q-select
        v-model="status"
        outlined
        dense
        :options="statusOptions"
        emit-value
        map-options
        class="status-filter filter-select"
        popup-content-class="filter-select-menu"
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
        hide-bottom
        class="books-table"
      >
        <template #no-data>
          <div class="no-data">
            <q-icon
              name="warning"
              size="20px"
            />

            <span>Dados serão carregados pelo backend.</span>
          </div>
        </template>
      </q-table>
    </section>

    <q-dialog v-model="showBookForm">
      <q-card class="book-form">
        <q-card-section class="form-header">
          <div class="text-h6">Novo livro</div>

          <q-btn
            flat
            round
            dense
            icon="close"
            @click="showBookForm = false"
          />
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="saveBook">
            <q-input
              v-model="bookForm.title"
              label="Título"
              outlined
            />

            <q-input
              v-model="bookForm.author"
              label="Autor"
              outlined
              class="q-mt-md"
            />

            <q-select
              v-model="bookForm.publisher"
              :options="publisherOptions"
              label="Editora"
              placeholder="Selecione uma editora"
              outlined
              class="q-mt-md filter-select"
              popup-content-class="filter-select-menu"
            />

            <q-select
              v-model="bookForm.status"
              :options="bookStatusOptions"
              label="Status"
              outlined
              class="q-mt-md filter-select"
              popup-content-class="filter-select-menu"
            />

            <q-input
              v-model="bookForm.observations"
              label="Observações (opcional)"
              type="textarea"
              outlined
              class="q-mt-md"
            />

            <div class="form-actions">
              <q-btn
                label="Cancelar"
                flat
                class="cancel-btn"
                @click="showBookForm = false"
              />

              <q-btn
                label="Salvar"
                type="submit"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const search = ref('');
const status = ref('all');
const showBookForm = ref(false);

const bookForm = ref({
  title: '',
  author: '',
  publisher: null as string | null,
  status: 'Disponível',
  observations: '',
});

const publisherOptions = [
  'Editora Horizonte',
  'Editora Papiro',
  'Editora Aurora',
];

const bookStatusOptions = ['Disponível', 'Indisponível'];

function saveBook() {
  showBookForm.value = false;
}

const statusOptions = [
  {
    label: 'Todos os status',
    value: 'all',
  },
  {
    label: 'Disponível',
    value: 'available',
  },
  {
    label: 'Alugado',
    value: 'rented',
  },
];

const columns = [
  {
    name: 'title',
    label: 'Título',
    field: 'title',
    align: 'left' as const,
  },
  {
    name: 'author',
    label: 'Autor',
    field: 'author',
    align: 'left' as const,
  },
  {
    name: 'publisher',
    label: 'Editora',
    field: 'publisher',
    align: 'left' as const,
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
];
</script>

<style scoped>
.books-page {
  background-color: #ffffff;
  padding: 15px 20px;
}

/* Cards */

.stats-section {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  width: 115px;
  height: 80px;
  padding: 8px;
  background-color: #ffffff;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
}

.stat-label {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #34454d;
  white-space: nowrap;
}

.stat-value {
  margin-top: 8px;
  color: #1b3a5c;
  font-size: 30px;
  line-height: 30px;
  font-weight: 600;
  text-align: center;
}

.dot {
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
}

.available {
  background-color: #19a56f;
}

.rented {
  background-color: #e94b4b;
}

.total {
  background-color: #1b3a5c;
}

.new-book-button {
  width: 130px;
  height: 80px;
  margin-left: auto;
  background-color: #1b3a5c;
  color: #ffffff;
  border-radius: 5px;
  font-size: 14px;
}

/* Pesquisa */

.filters-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.search-input {
  flex: 1;
}

.status-filter {
  width: 180px;
}

/* Tabela */

.table-section {
  width: 100%;
  min-height: 250px;
  overflow: hidden;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  background-color: #ffffff;
}

.books-table {
  width: 100%;
}

.books-table :deep(th) {
  color: #1b3a5c;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid #bdbdbd;
}

.books-table :deep(td) {
  color: #444444;
  font-size: 13px;
  border-bottom: 1px solid #eeeeee;
}

.no-data {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px;
  color: #444444;
  font-size: 13px;
}

.book-form {
  width: 500px;
  max-width: 90vw;
  border-radius: 8px;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1b3a5c;
}

.book-form :deep(.q-field--outlined .q-field__control:before),
.book-form :deep(.q-field--outlined .q-field__control:hover:before),
.book-form :deep(.q-field--outlined .q-field__control:after) {
  border-color: #1b3a5c;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
}

.form-actions .q-btn:last-child {
  background-color: #1b3a5c;
  color: #ffffff;
}

.form-actions .cancel-btn {
  background-color: #ffffff;
  border: 1px solid #1b3a5c;
  color: #1b3a5c;
}
</style>
