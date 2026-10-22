<template>
  <q-page class="reader-dashboard">
    <header class="welcome-row">
      <div>
        <h1>{{ greeting }}</h1>
        <p>{{ t('readerDashboard.subtitle') }}</p>
      </div>
      <div v-if="initials" class="user-avatar" aria-label="Avatar do usuário">{{ initials }}</div>
    </header>

    <q-banner v-if="historyError" dense class="error-banner" role="alert">
      {{ t('readerDashboard.historyError') }}
      <template #action>
        <q-btn flat :label="t('readerDashboard.retry')" :loading="historyLoading" @click="loadHistory" />
      </template>
    </q-banner>

    <section class="summary-cards">
      <q-card flat bordered class="summary-card active-card">
        <div class="summary-label"><span class="dot"></span>{{ t('readerDashboard.activeLoans') }}</div>
        <div class="summary-value">{{ historyLoading ? '—' : historyError ? '—' : activeLoanCount }}</div>
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
import type { LoanResponse, LoanStatus, SortDirection } from '@/types/Loan';

const { t, locale } = useI18n();
const pageSize = 100;
const loans = ref<LoanResponse[]>([]);
const historyLoading = ref(false);
const historyError = ref(false);
const tableLoading = ref(false);
const tableError = ref('');
const totalRows = ref(0);
const pagination = ref({ page: 1, rowsPerPage: 10, sortBy: 'loanDate', descending: true, rowsNumber: 0 });

// The current login contract has no display name, so no name or initials are fabricated.
const displayName = computed(() => '');
const greeting = computed(() => displayName.value ? `${t('readerDashboard.greeting')} ${displayName.value}` : t('readerDashboard.greetingGeneric'));
const initials = computed(() => displayName.value.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toLocaleUpperCase()).join(''));
const activeLoanCount = computed(() => loans.value.filter((loan) => loan.status === 'PENDING' || loan.status === 'OVERDUE').length);

const latestBook = computed(() => [...loans.value]
  .sort((a, b) => dateValue(b.loanDate) - dateValue(a.loanDate) || b.id - a.id)[0]?.bookTitle ?? '—');

const mostRentedBook = computed(() => {
  const counts = new Map<number, { title: string; count: number }>();
  for (const loan of loans.value) {
    const current = counts.get(loan.bookId);
    counts.set(loan.bookId, { title: loan.bookTitle, count: (current?.count ?? 0) + 1 });
  }
  return [...counts.entries()]
    .sort(([idA, a], [idB, b]) => b.count - a.count || a.title.localeCompare(b.title) || idA - idB)[0]?.[1].title ?? '—';
});

const columns = computed<QTableColumn<LoanResponse>[]>(() => [
  { name: 'bookTitle', label: t('readerDashboard.book'), field: 'bookTitle', align: 'left' },
  { name: 'loanDate', label: t('readerDashboard.loanDate'), field: 'loanDate', align: 'center' },
  { name: 'returnDate', label: t('readerDashboard.returnDate'), field: 'returnDate', align: 'center' },
  { name: 'status', label: t('readerDashboard.statusLabel'), field: 'status', align: 'center' },
]);

async function loadHistory() {
  historyLoading.value = true;
  historyError.value = false;
  try {
    const first = await LoanService.getMyLoans({ page: 0, size: pageSize, sortBy: 'loanDate', sortDirection: 'DESC' });
    const complete = [...first.content];
    for (let page = 1; page < first.totalPages; page++) {
      const response = await LoanService.getMyLoans({ page, size: pageSize, sortBy: 'loanDate', sortDirection: 'DESC' });
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

async function loadTablePage(page = pagination.value.page, rowsPerPage = pagination.value.rowsPerPage, sortBy = 'loanDate', descending = true) {
  tableLoading.value = true;
  tableError.value = '';
  try {
    const response = await LoanService.getMyLoans({
      page: page - 1,
      size: rowsPerPage,
      sortBy,
      sortDirection: descending ? 'DESC' as SortDirection : 'ASC' as SortDirection,
    });
    loansPage.value = response.content;
    totalRows.value = response.totalElements;
    pagination.value = { page: response.number + 1, rowsPerPage, sortBy, descending, rowsNumber: response.totalElements };
  } catch {
    loansPage.value = [];
    totalRows.value = 0;
    tableError.value = t('readerDashboard.tableError');
  } finally {
    tableLoading.value = false;
  }
}

const loansPage = ref<LoanResponse[]>([]);
async function onTableRequest({ pagination: requested }: { pagination: { page: number; rowsPerPage: number; sortBy?: string; descending: boolean } }) {
  await loadTablePage(requested.page, requested.rowsPerPage, requested.sortBy || 'loanDate', requested.descending);
}

function dateValue(value: string): number {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function formatDate(value: string): string {
  const parsed = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : new Intl.DateTimeFormat(locale.value, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parsed);
}

onMounted(() => {
  void loadHistory();
  void loadTablePage(1, pagination.value.rowsPerPage, 'loanDate', true);
});
</script>

<style scoped>
.reader-dashboard { min-height: calc(100vh - 88px); padding: 18px 20px 28px; background: #f4f4f4; color: #1b3a5c; }
.welcome-row { display: flex; align-items: center; justify-content: space-between; min-height: 70px; padding: 0 20px 12px; border-bottom: 1px solid #c7c7c7; margin-bottom: 14px; }
.welcome-row h1 { margin: 0; font-size: 21px; font-weight: 700; }
.welcome-row p { margin: 1px 0 0; font-size: 14px; }
.user-avatar { display: grid; width: 58px; height: 58px; place-items: center; border-radius: 50%; background: #1b3a5c; color: white; font-size: 20px; font-weight: 700; }
.summary-cards { display: grid; grid-template-columns: 130px 160px minmax(240px, 1fr); gap: 14px; margin-bottom: 28px; }
.summary-card, .loans-panel { border: 1px solid #1b3a5c; border-radius: 6px; background: white; }
.summary-card { min-height: 82px; padding: 9px 12px; }
.summary-label { display: flex; align-items: center; gap: 6px; font-size: 13px; }
.dot { width: 8px; height: 8px; border-radius: 50%; background: #19a974; }
.summary-value { margin-top: 3px; text-align: center; font-size: 30px; line-height: 34px; font-weight: 700; }
.book-value { overflow: hidden; margin-top: 8px; font-size: 15px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.favorite-card { display: flex; flex-direction: column; justify-content: space-between; }
.favorite-value { display: flex; align-items: center; gap: 10px; min-width: 0; font-size: 15px; font-weight: 600; }
.favorite-value span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.table-heading { padding: 10px 12px; border-bottom: 1px solid #ddd; font-size: 14px; }
.loans-panel :deep(th) { color: #1b3a5c; font-weight: 600; }
.loans-panel :deep(td) { color: #333; }
.status-pill { display: inline-block; min-width: 82px; padding: 4px 10px; border-radius: 14px; color: white; font-size: 12px; font-weight: 600; }
.status-pending { background: #f5a623; }
.status-overdue { background: #e94b4b; }
.status-returned { background: #19a974; }
.status-returned_late { background: #b42318; }
.error-banner { margin-bottom: 12px; color: #b42318; background: #fff1f0; }
.empty-state { width: 100%; padding: 22px; color: #64748b; text-align: center; }
@media (max-width: 700px) { .reader-dashboard { padding: 12px; } .summary-cards { grid-template-columns: repeat(2, minmax(0, 1fr)); } .favorite-card { grid-column: 1 / -1; } }
</style>
