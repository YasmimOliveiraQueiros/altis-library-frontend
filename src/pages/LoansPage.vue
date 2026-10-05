<template>
  <q-page class="loans-page">
    <!-- Cards -->
    <section class="summary-section">
      <div class="summary-cards">
        <div class="summary-card">
          <p><span class="dot pending"></span>Pendentes</p>
          <h2>1</h2>
        </div>

        <div class="summary-card">
          <p><span class="dot overdue"></span>Atrasados</p>
          <h2>1</h2>
        </div>

        <div class="summary-card">
          <p><span class="dot returned"></span>Devolvidos</p>
          <h2>1</h2>
        </div>

        <div class="summary-card">
          <p><span class="dot total"></span>Total</p>
          <h2>3</h2>
        </div>
      </div>

      <q-btn
        label="+ Novo aluguel"
        class="new-loan-btn"
        unelevated
      />
    </section>

    <!-- Pesquisa -->
    <section class="search-section">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Buscar por locatário ou livro"
        class="search-input"
      />

      <q-select
        v-model="statusFilter"
        :options="statusOptions"
        outlined
        dense
        class="status-filter"
      />
    </section>

    <!-- Tabela -->
    <section class="table-section">
      <q-table
        flat
        :rows="filteredLoans"
        :columns="columns"
        row-key="id"
        hide-pagination
        :rows-per-page-options="[0]"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <span
              class="status"
              :class="getStatusClass(props.row.status)"
            >
              {{ props.row.status }}
            </span>
          </q-td>
        </template>

        <template #body-cell-action="props">
          <q-td :props="props">
            <div class="action-cell">
              <q-select
                v-model="props.row.status"
                :options="actionOptions"
                outlined
                dense
                class="action-select"
              />
            </div>
          </q-td>
        </template>
      </q-table>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Loan {
  id: number;
  tenant: string;
  book: string;
  rentalDate: string;
  returnDate: string;
  status: string;
}

const search = ref('');
const statusFilter = ref('Todos os status');

const statusOptions = [
  'Todos os status',
  'Pendente',
  'Atrasado',
  'Devolvido',
];

const actionOptions = [
  'Pendente',
  'Atrasado',
  'Devolvido',
];

const loans = ref<Loan[]>([
  {
    id: 1,
    tenant: 'Anna Silva',
    book: 'Dom Casmurro',
    rentalDate: '01/07',
    returnDate: '16/07',
    status: 'Devolvido C/A',
  },
  {
    id: 2,
    tenant: 'Fulano S.',
    book: 'O Alquimista',
    rentalDate: '01/07',
    returnDate: '16/07',
    status: 'Devolvido',
  },
  {
    id: 3,
    tenant: 'Ciclano',
    book: 'O Alquimista',
    rentalDate: '01/07',
    returnDate: '16/07',
    status: 'Pendente',
  },
]);

const columns = [
  {
    name: 'tenant',
    label: 'Locatário',
    field: 'tenant',
    align: 'left' as const,
  },
  {
    name: 'book',
    label: 'Livro',
    field: 'book',
    align: 'left' as const,
  },
  {
    name: 'rentalDate',
    label: 'Aluguel',
    field: 'rentalDate',
    align: 'left' as const,
  },
  {
    name: 'returnDate',
    label: 'Devolução',
    field: 'returnDate',
    align: 'left' as const,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center' as const,
  },
  {
    name: 'action',
    label: 'Ação',
    field: 'status',
    align: 'center' as const,
  },
];

const filteredLoans = computed(() => {
  const term = search.value.toLowerCase();

  return loans.value.filter((loan) => {
    const matchesSearch =
      loan.tenant.toLowerCase().includes(term) ||
      loan.book.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter.value === 'Todos os status' ||
      loan.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

function getStatusClass(status: string) {
  if (status === 'Pendente') {
    return 'pending';
  }

  if (status === 'Atrasado') {
    return 'overdue';
  }

  return status === 'Devolvido' || status === 'Devolvido C/A'
    ? 'returned'
    : '';
}
</script>

<style scoped>
.loans-page {
  padding: 15px 20px;
  background-color: #ffffff;
  color: #1b3a5c;
}

.summary-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
}

.summary-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.summary-card {
  width: 115px;
  height: 80px;
  background-color: #ffffff;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  padding: 8px;
}

.summary-card p {
  margin: 0;
  font-size: 13px;
  color: #34454d;
  white-space: nowrap;
}

.summary-card h2 {
  margin: 8px 0 0;
  color: #1b3a5c;
  font-size: 30px;
  line-height: 30px;
  font-weight: 600;
  text-align: center;
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}

.pending {
  background-color: #f5a623;
}

.overdue {
  background-color: #e94b4b;
}

.returned {
  background-color: #19a974;
}

.total {
  background-color: #3576d3;
}

.new-loan-btn {
  width: 130px;
  height: 80px;
  margin-left: auto;
  background-color: #1b3a5c;
  color: #ffffff;
  border-radius: 5px;
  font-size: 14px;
}

.search-section {
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

.table-section {
  min-height: 250px;
  background-color: #ffffff;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  overflow-x: auto;
  overflow-y: hidden;
}

:deep(.q-table thead th) {
  border-bottom: 1px solid #bdbdbd;
  color: #1b3a5c;
  font-size: 13px;
  font-weight: 600;
}

:deep(.q-table tbody td) {
  border-bottom: 1px solid #eeeeee;
  font-size: 13px;
  color: #444;
}

.status {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status.pending {
  background-color: #f5a623;
}

.status.overdue {
  background-color: #e94b4b;
}

.status.returned {
  background-color: #19a974;
}

.action-select {
  width: 120px;
}

.action-cell {
  display: flex;
  justify-content: center;
}

@media (max-width: 700px) {
  .summary-section {
    flex-wrap: wrap;
  }

  .new-loan-btn {
    margin-left: 0;
  }

  .search-section {
    align-items: stretch;
    flex-direction: column;
    gap: 12px;
  }

  .status-filter {
    width: 100%;
  }
}
</style>