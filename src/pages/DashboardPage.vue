<template>
  <q-page class="dashboard-page">
    <q-banner v-if="errorMessage" dense class="error-banner" role="alert">
      {{ errorMessage }}
      <template #action>
        <q-btn flat :label="t('loans.actions.retry')" :loading="loading" @click="loadDashboard" />
      </template>
    </q-banner>

    <section class="summary-cards" :aria-label="t('adminDashboard.statistics')">
      <q-card v-for="card in summaryCards" :key="card.key" flat bordered class="summary-card">
        <div class="summary-label">
          <span class="summary-dot" :class="card.indicatorClass"></span>
          {{ card.label }}
        </div>
        <div class="summary-value">
          <q-spinner v-if="loading && !dashboard" color="primary" size="24px" />
          <span v-else>{{ dashboard ? dashboard[card.key] : '—' }}</span>
        </div>
      </q-card>
    </section>

    <section class="insights-grid">
      <q-card flat bordered class="dashboard-panel monthly-panel">
        <div class="card-title">{{ t('adminDashboard.monthlyLoans') }}</div>
        <div v-if="loading && !dashboard" class="panel-message">{{ t('adminDashboard.loading') }}</div>
        <div v-else-if="errorMessage" class="panel-message">{{ t('adminDashboard.monthlyError') }}</div>
        <div v-else-if="monthlyLoans.length" class="monthly-chart" :aria-label="t('adminDashboard.monthlyLoans')">
          <div
            v-for="month in monthlyLoans"
            :key="`${month.year}-${month.month}`"
            class="month-column"
            role="group"
            :aria-label="t('adminDashboard.monthDescription', { month: month.label, year: month.year, count: month.quantity })"
          >
            <span class="bar-value">{{ month.quantity }}</span>
            <div class="bar-area">
              <span class="month-bar" :style="{ height: `${month.height}%` }"></span>
            </div>
            <span class="month-label">{{ month.label }}</span>
          </div>
        </div>
        <div v-else class="panel-message">{{ t('adminDashboard.noMonthlyData') }}</div>
      </q-card>

      <q-card flat bordered class="dashboard-panel books-panel">
        <div class="card-title">{{ t('adminDashboard.booksByStatus') }}</div>
        <div class="book-status-list">
          <div v-for="status in bookStatuses" :key="status.label" class="book-status-row">
            <div class="book-status-label">
              <span>{{ status.label }}</span>
              <strong>{{ status.quantity ?? '—' }}</strong>
            </div>
            <div class="status-track">
              <span :class="status.class" :style="{ width: `${status.percentage}%` }"></span>
            </div>
          </div>
        </div>
      </q-card>
    </section>

    <q-card flat bordered class="recent-loans">
      <div class="recent-heading">
        <div class="card-title">{{ t('adminDashboard.recentLoans') }}</div>
        <q-btn flat dense no-caps :label="t('adminDashboard.viewAll')" to="/alugueis" class="view-all" />
      </div>
      <div v-if="loading && !dashboard" class="state-content">
        <q-spinner color="primary" size="28px" />
        <span>{{ t('adminDashboard.loading') }}</span>
      </div>
      <div v-else-if="!dashboard && errorMessage" class="state-content">
        {{ t('adminDashboard.recentLoansError') }}
      </div>
      <div v-else-if="!dashboard?.latestLoans.length" class="state-content">
        {{ t('adminDashboard.noRecentLoans') }}
      </div>
      <div v-else class="table-scroll">
        <q-table
          flat
          :rows="latestLoanRows"
          :columns="columns"
          row-key="id"
          :loading="referencesLoading"
          hide-pagination
          :rows-per-page-options="[0]"
          :no-data-label="t('adminDashboard.noRecentLoans')"
          class="loans-table"
        >
          <template #body-cell-status="props">
            <q-td :props="props">
              <span class="status" :class="getStatusClass(props.row.status)">
                {{ getStatusLabel(props.row.status) }}
              </span>
            </q-td>
          </template>
        </q-table>
        <div v-if="referencesError" class="reference-note" role="status">
          {{ t('adminDashboard.referencesFallback') }}
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import type { QTableColumn } from 'quasar';
import { BookService } from '@/services/BookService';
import { DashboardService } from '@/services/DashboardService';
import { UserService } from '@/services/UserService';
import type { DashboardResponse } from '@/types/Dashboard';
import type { LoanResponse, LoanStatus } from '@/types/Loan';
import type { BookResponse } from '@/types/Book';
import type { UserResponse } from '@/types/User';

interface LatestLoanRow extends LoanResponse {
  bookTitle: string;
  userName: string;
  returnDateLabel: string;
}

type DashboardCountKey =
  | 'totalUsers'
  | 'totalBooks'
  | 'totalPublishers'
  | 'activeLoans'
  | 'pendingLoans'
  | 'overdueLoans'
  | 'returnedLoans';

const { t, locale } = useI18n();

const dashboard = ref<DashboardResponse | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const referencesLoading = ref(false);
const referencesError = ref(false);
const userNames = ref(new Map<number, string>());
const bookTitles = ref(new Map<number, string>());

const columns = computed<QTableColumn<LatestLoanRow>[]>(() => [
  { name: 'book', label: t('loans.table.book'), field: 'bookTitle', align: 'left' },
  { name: 'user', label: t('loans.table.borrower'), field: 'userName', align: 'left' },
  { name: 'returnDate', label: t('loans.table.returnDate'), field: 'returnDateLabel', align: 'left' },
  { name: 'status', label: t('loans.table.status'), field: 'status', align: 'center' },
]);

const latestLoanRows = computed<LatestLoanRow[]>(() =>
  (dashboard.value?.latestLoans ?? []).slice(0, 3).map((loan) => ({
    ...loan,
    bookTitle: bookTitles.value.get(loan.bookId) ?? t('loans.references.bookFallback', { id: loan.bookId }),
    userName: userNames.value.get(loan.userId) ?? t('loans.references.userFallback', { id: loan.userId }),
    returnDateLabel: `${loan.status === 'PENDING' || loan.status === 'OVERDUE' ? `${t('adminDashboard.expectedPrefix')} ` : ''}${formatDate(loan.returnDate)}`,
  })),
);

const summaryCards = computed(() => {
  const cards: { key: DashboardCountKey; label: string; indicatorClass: string }[] = [
    { key: 'totalBooks', label: t('navigation.books'), indicatorClass: 'books' },
    { key: 'totalPublishers', label: t('navigation.publishers'), indicatorClass: 'publishers' },
    { key: 'activeLoans', label: t('readerDashboard.activeLoans'), indicatorClass: 'active' },
    { key: 'totalUsers', label: t('navigation.users'), indicatorClass: 'users' },
    { key: 'pendingLoans', label: t('loans.stats.pending'), indicatorClass: 'pending' },
    { key: 'overdueLoans', label: t('loans.stats.overdue'), indicatorClass: 'overdue' },
  ];
  return cards;
});

const monthLabels = computed(() =>
  Array.from({ length: 12 }, (_, month) =>
    new Intl.DateTimeFormat(locale.value, { month: 'short' })
      .format(new Date(Date.UTC(2024, month, 1)))
      .replace(/\.$/, ''),
  ),
);
const monthlyLoans = computed(() => {
  const loans = [...(dashboard.value?.loansByMonth ?? [])].sort(
    (a, b) => a.year - b.year || a.month - b.month,
  );
  const maximum = Math.max(0, ...loans.map((loan) => loan.quantity));

  return loans.map((loan) => ({
    ...loan,
    label: monthLabels.value[loan.month - 1] ?? String(loan.month),
    height: maximum > 0 ? (loan.quantity / maximum) * 100 : 0,
  }));
});

const bookStatuses = computed(() => {
  const available = dashboard.value?.booksByStatus.available ?? null;
  const rented = dashboard.value?.booksByStatus.rented ?? null;
  const total = (available ?? 0) + (rented ?? 0);

  return [
    {
      label: t('adminDashboard.availableBooks'),
      class: 'available',
      quantity: available,
      percentage: total > 0 && available !== null ? (available / total) * 100 : 0,
    },
    {
      label: t('adminDashboard.rentedBooks'),
      class: 'rented',
      quantity: rented,
      percentage: total > 0 && rented !== null ? (rented / total) * 100 : 0,
    },
  ];
});

async function loadDashboard() {
  loading.value = true;
  errorMessage.value = '';
  referencesError.value = false;
  userNames.value = new Map();
  bookTitles.value = new Map();
  try {
    dashboard.value = await DashboardService.getDashboard();
    void loadReferences(dashboard.value.latestLoans.slice(0, 3));
  } catch (error: unknown) {
    dashboard.value = null;
    errorMessage.value = axios.isAxiosError(error) && !error.response
      ? t('loans.errors.serviceUnavailable')
      : axios.isAxiosError(error) && error.response?.status === 403
        ? t('loans.errors.dashboardForbidden')
        : t('adminDashboard.loadError');
  } finally {
    loading.value = false;
  }
}

async function loadReferences(loans: LoanResponse[]) {
  const userIds = [...new Set(loans.map((loan) => loan.userId))];
  const bookIds = [...new Set(loans.map((loan) => loan.bookId))];
  if (!userIds.length || !bookIds.length) return;

  referencesLoading.value = true;
  const [usersResult, booksResult] = await Promise.allSettled([
    UserService.getUsers({ page: 0, size: 100 }),
    BookService.getBooks({ page: 0, size: 100 }),
  ]);

  if (usersResult.status === 'fulfilled') {
    userNames.value = new Map<number, string>(
      usersResult.value.content
        .filter((user: UserResponse) => userIds.includes(user.id))
        .map((user: UserResponse): [number, string] => [user.id, user.name]),
    );
  } else {
    referencesError.value = true;
  }
  if (booksResult.status === 'fulfilled') {
    bookTitles.value = new Map<number, string>(
      booksResult.value.content
        .filter((book: BookResponse) => bookIds.includes(book.id))
        .map((book: BookResponse): [number, string] => [book.id, book.title]),
    );
  } else {
    referencesError.value = true;
  }

  referencesLoading.value = false;
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return value;

  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale.value, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date);
}

function getStatusLabel(status: LoanStatus): string {
  const labels: Record<LoanStatus, string> = {
    PENDING: t('loans.status.pending'),
    OVERDUE: t('loans.status.overdue'),
    RETURNED: t('loans.status.returned'),
    RETURNED_LATE: t('loans.status.returnedLate'),
  };
  return labels[status];
}

function getStatusClass(status: LoanStatus): string {
  if (status === 'PENDING') return 'pending';
  if (status === 'OVERDUE') return 'overdue';
  if (status === 'RETURNED_LATE') return 'returned-late';
  return 'returned';
}

onMounted(loadDashboard);
</script>

<style scoped>
.dashboard-page {
  min-height: calc(100vh - 88px);
  padding: 14px 20px 24px;
  background: #f4f4f4;
  color: #1b3a5c;
}

.error-banner {
  margin-bottom: 16px;
  color: #b42318;
  background: #fff1f0;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(6, 115px);
  gap: 14px;
  margin-bottom: 18px;
}

.summary-card,
.dashboard-panel,
.recent-loans {
  border: 1px solid #1b3a5c;
  border-radius: 6px;
  background: #fff;
}

.summary-card {
  min-height: 80px;
  padding: 8px;
}

.summary-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1b3a5c;
  font-size: 13px;
  white-space: nowrap;
}

.summary-dot {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.summary-dot.books {
  background: #3f78d4;
}

.summary-dot.publishers {
  background: #9c3fc4;
}

.summary-dot.active {
  background: #19a974;
}

.summary-dot.users {
  background: #1b3a5c;
}

.summary-dot.pending {
  background: #f5a623;
}

.summary-dot.overdue {
  background: #e94b4b;
}

.summary-value {
  display: flex;
  justify-content: center;
  margin-top: 4px;
  color: #1b3a5c;
  font-size: 30px;
  line-height: 32px;
  font-weight: 600;
}

.insights-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 14px;
  margin-bottom: 14px;
}

.dashboard-panel {
  min-height: 157px;
}

.card-title {
  padding: 8px 11px;
  color: #1b3a5c;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
}

.panel-message {
  display: grid;
  min-height: 112px;
  place-items: center;
  padding: 16px;
  color: #64748b;
  font-size: 13px;
  text-align: center;
}

.monthly-chart {
  display: flex;
  height: 122px;
  align-items: flex-end;
  justify-content: space-around;
  gap: 8px;
  padding: 7px 14px 8px;
}

.month-column {
  display: flex;
  min-width: 30px;
  height: 100%;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: #1b3a5c;
  font-size: 10px;
}

.bar-value {
  margin-bottom: 3px;
  font-weight: 600;
}

.bar-area {
  display: flex;
  width: 100%;
  height: 74px;
  align-items: flex-end;
  justify-content: center;
}

.month-bar {
  width: min(30px, 65%);
  min-height: 0;
  border-radius: 3px 3px 0 0;
  background: #3f78d4;
}

.month-label {
  margin-top: 4px;
}

.book-status-list {
  padding: 0 12px 8px;
}

.book-status-row {
  margin: 3px 0 8px;
  font-size: 12px;
}

.book-status-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.book-status-label strong {
  font-weight: 600;
}

.status-track {
  height: 8px;
  overflow: hidden;
  border-radius: 6px;
  background: #e7e7e7;
}

.status-track span {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
}

.status-track .available {
  background: #19a974;
}

.status-track .rented {
  background: #e94b4b;
}

.recent-loans {
  min-height: 180px;
}

.recent-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #d9d9d9;
}

.view-all {
  margin-right: 8px;
  color: #1b3a5c;
  font-size: 12px;
}

.recent-heading .card-title {
  padding: 8px 11px;
}

.state-content {
  display: flex;
  min-height: 100px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #64748b;
  text-align: center;
}

.table-scroll {
  overflow-x: auto;
}

.loans-table {
  min-width: 520px;
}

.loans-table :deep(th) {
  height: 31px;
  border-bottom: 1px solid #d9d9d9;
  color: #1b3a5c;
  font-size: 13px;
  font-weight: 600;
}

.loans-table :deep(td) {
  color: #444;
  font-size: 13px;
}

.status {
  display: inline-block;
  padding: 4px 9px;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.status.pending {
  color: #8a5a00;
  background: #fff3cd;
}

.status.overdue {
  color: #a61b1b;
  background: #fde2e2;
}

.status.returned {
  color: #176b45;
  background: #dcf5e8;
}

.status.returned-late {
  color: #fff;
  background: #e94b4b;
}

.reference-note {
  padding: 8px 14px;
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 600px) {
  .dashboard-page {
    padding: 12px;
  }

  .summary-cards {
    grid-template-columns: repeat(2, minmax(115px, 1fr));
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 601px) and (max-width: 950px) {
  .summary-cards {
    grid-template-columns: repeat(3, minmax(115px, 1fr));
  }

  .insights-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
