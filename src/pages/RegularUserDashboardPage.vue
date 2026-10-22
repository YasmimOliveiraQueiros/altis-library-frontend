<template>
  <q-page class="reader-dashboard">
    <q-banner v-if="historyError" dense class="error-banner" role="alert">
      {{ t('readerDashboard.historyError') }}
      <template #action>
        <q-btn
          flat
          :label="t('readerDashboard.retry')"
          :loading="historyLoading"
          @click="loadHistory"
        />
      </template>
    </q-banner>

    <section class="summary-cards">
      <q-card flat bordered class="summary-card active-card">
        <div class="summary-label">
          <span class="dot"></span>{{ t('readerDashboard.activeLoans') }}
        </div>
        <div class="summary-value">
          {{ historyLoading ? '—' : historyError ? '—' : activeLoanCount }}
        </div>
      </q-card>
      <q-card flat bordered class="summary-card">
        <div class="summary-label">{{ t('readerDashboard.latestBook') }}</div>
        <div class="book-value">{{ historyLoading ? '—' : historyError ? '—' : latestBook }}</div>
      </q-card>
      <q-card flat bordered class="summary-card favorite-card">
        <div class="summary-label">{{ t('readerDashboard.mostRented') }}</div>
        <div class="favorite-value">
          <q-icon name="star_border" size="28px" />
          <span>{{ historyLoading ? '—' : historyError ? '—' : mostRentedBook }}</span>
        </div>
      </q-card>
    </section>

    <q-card flat bordered class="loans-panel">
      <div class="table-heading">{{ t('readerDashboard.myLoans') }}</div>
      <q-table
        v-model:pagination="pagination"
        flat
        :rows="loansPage"
        :columns="columns"
        row-key="id"
        :loading="tableLoading"
        :rows-per-page-options="[10, 25, 50]"
        :rows-per-page-label="t('readerDashboard.recordsPerPage')"
        :pagination-label="paginationLabel"
        @request="onTableRequest"
      >
        <template #body-cell-loanDate="props">
          <q-td :props="props">{{ formatDate(props.row.loanDate) }}</q-td>
        </template>
        <template #body-cell-returnDate="props">
          <q-td :props="props">{{ formatDate(props.row.returnDate) }}</q-td>
        </template>
        <template #body-cell-status="props">
          <q-td :props="props">
            <span class="status-pill" :class="`status-${props.row.status.toLowerCase()}`">
              {{ t(`readerDashboard.status.${props.row.status}`) }}
            </span>
          </q-td>
        </template>
        <template #no-data>
          <div class="empty-state">{{ tableError || t('readerDashboard.noLoans') }}</div>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useI18n } from 'vue-i18n';
import { LoanService } from '@/services/LoanService';
import type { LoanResponse, SortDirection } from '@/types/Loan';

const { t, locale } = useI18n();
const pageSize = 100;
const loans = ref<LoanResponse[]>([]);
const historyLoading = ref(false);
const historyError = ref(false);
const tableLoading = ref(false);
const tableError = ref('');
const totalRows = ref(0);
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'loanDate',
  descending: true,
  rowsNumber: 0,
});

const activeLoanCount = computed(
  () => loans.value.filter((loan) => loan.status === 'PENDING' || loan.status === 'OVERDUE').length,
);

const latestBook = computed(
  () =>
    [...loans.value].sort((a, b) => dateValue(b.loanDate) - dateValue(a.loanDate) || b.id - a.id)[0]
      ?.bookTitle ?? '—',
);

const mostRentedBook = computed(() => {
  const counts = new Map<number, { title: string; count: number }>();
  for (const loan of loans.value) {
    const current = counts.get(loan.bookId);
    counts.set(loan.bookId, { title: loan.bookTitle, count: (current?.count ?? 0) + 1 });
  }
  return (
    [...counts.entries()].sort(
      ([idA, a], [idB, b]) => b.count - a.count || a.title.localeCompare(b.title) || idA - idB,
    )[0]?.[1].title ?? '—'
  );
});

const columns = computed<QTableColumn<LoanResponse>[]>(() => [
  { name: 'bookTitle', label: t('readerDashboard.book'), field: 'bookTitle', align: 'left' },
  { name: 'loanDate', label: t('readerDashboard.loanDate'), field: 'loanDate', align: 'center' },
  {
    name: 'returnDate',
    label: t('readerDashboard.returnDate'),
    field: 'returnDate',
    align: 'center',
  },
  { name: 'status', label: t('readerDashboard.statusLabel'), field: 'status', align: 'center' },
]);

function paginationLabel(firstRow: number, lastRow: number, totalRows: number): string {
  if (totalRows === 0) return t('readerDashboard.emptyPagination');

  return t('readerDashboard.pagination', { first: firstRow, last: lastRow, total: totalRows });
}

async function loadHistory() {
  historyLoading.value = true;
  historyError.value = false;
  try {
    const first = await LoanService.getMyLoans({
      page: 0,
      size: pageSize,
      sortBy: 'loanDate',
      sortDirection: 'DESC',
    });
    const complete = [...first.content];
    for (let page = 1; page < first.totalPages; page++) {
      const response = await LoanService.getMyLoans({
        page,
        size: pageSize,
        sortBy: 'loanDate',
        sortDirection: 'DESC',
      });
      complete.push(...response.content);
    }
    loans.value = complete;
  } catch {
    loans.value = [];
    historyError.value = true;
  } finally {
    historyLoading.value = false;
  }
}

async function loadTablePage(
  page = pagination.value.page,
  rowsPerPage = pagination.value.rowsPerPage,
  sortBy = 'loanDate',
  descending = true,
) {
  tableLoading.value = true;
  tableError.value = '';
  try {
    const sortDirection: SortDirection = descending ? 'DESC' : 'ASC';
    const response = await LoanService.getMyLoans({
      page: page - 1,
      size: rowsPerPage,
      sortBy,
      sortDirection,
    });
    loansPage.value = response.content;
    totalRows.value = response.totalElements;
    pagination.value = {
      page: response.number + 1,
      rowsPerPage,
      sortBy,
      descending,
      rowsNumber: response.totalElements,
    };
  } catch {
    loansPage.value = [];
    totalRows.value = 0;
    tableError.value = t('readerDashboard.tableError');
  } finally {
    tableLoading.value = false;
  }
}

const loansPage = ref<LoanResponse[]>([]);
async function onTableRequest({
  pagination: requested,
}: {
  pagination: { page: number; rowsPerPage: number; sortBy?: string; descending: boolean };
}) {
  await loadTablePage(
    requested.page,
    requested.rowsPerPage,
    requested.sortBy || 'loanDate',
    requested.descending,
  );
}

function dateValue(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(value: string): string {
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(parsed.getTime())
    ? value
    : new Intl.DateTimeFormat(locale.value, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(parsed);
}

onMounted(() => {
  void loadHistory();
  void loadTablePage(1, pagination.value.rowsPerPage, 'loanDate', true);
});
</script>

<style scoped>
.reader-dashboard {
  min-height: calc(100vh - 88px);
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 14px 20px 24px;
  background: #f4f4f4;
  color: #1b3a5c;
  overflow-x: clip;
}
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}
.summary-card,
.loans-panel {
  min-width: 0;
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  background: white;
}
.summary-card {
  display: flex;
  min-height: 136px;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
}
.summary-label {
  display: flex;
  min-height: 40px;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  line-height: 1.4;
}
.dot {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: #19a974;
}
.summary-value {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  font-size: 30px;
  line-height: 34px;
  font-weight: 700;
}
.book-value {
  margin-top: auto;
  overflow-wrap: anywhere;
  font-size: 15px;
  line-height: 1.4;
  font-weight: 600;
}
.favorite-value {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: auto;
  min-width: 0;
  font-size: 15px;
  line-height: 1.4;
  font-weight: 600;
}
.favorite-value :deep(.q-icon) {
  flex: 0 0 auto;
  margin-top: 1px;
}
.favorite-value span {
  min-width: 0;
  overflow-wrap: anywhere;
}
.table-heading {
  padding: 10px 12px;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}
.loans-panel :deep(th) {
  color: #1b3a5c;
  font-weight: 600;
}
.loans-panel :deep(.q-table__middle) {
  max-width: 100%;
  overflow-x: auto;
}
.loans-panel :deep(td) {
  color: #333;
}
.status-pill {
  display: inline-block;
  min-width: 82px;
  padding: 4px 10px;
  border-radius: 14px;
  color: white;
  font-size: 12px;
  font-weight: 600;
}
.status-pending {
  background: #f5a623;
}
.status-overdue {
  background: #e94b4b;
}
.status-returned {
  background: #19a974;
}
.status-returned_late {
  background: #b42318;
}
.error-banner {
  margin-bottom: 12px;
  color: #b42318;
  background: #fff1f0;
}
.empty-state {
  width: 100%;
  padding: 22px;
  color: #64748b;
  text-align: center;
}
@media (max-width: 900px) {
  .summary-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .reader-dashboard {
    padding: 16px 12px 24px;
  }
  .summary-cards {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    margin-bottom: 16px;
  }
  .summary-card {
    min-height: 120px;
    padding: 16px;
  }
  .loans-panel :deep(th),
  .loans-panel :deep(td) {
    white-space: nowrap;
  }
}
</style>
