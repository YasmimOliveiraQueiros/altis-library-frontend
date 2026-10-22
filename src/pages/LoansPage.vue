<template>
  <q-page class="loans-page">
    <section class="summary-section">
      <div class="summary-cards">
        <div v-for="card in summaryCards" :key="card.label" class="summary-card">
          <p><span class="dot" :class="card.indicatorClass"></span>{{ card.label }}</p>
          <h2>{{ dashboardLoading ? '…' : (card.value ?? '—') }}</h2>
        </div>
      </div>

      <q-btn
        label="+ Novo aluguel"
        class="new-loan-btn"
        unelevated
        :disable="savingLoan"
        @click="openCreateLoan"
      />
    </section>

    <q-banner v-if="dashboardError" dense class="state-banner error-banner" role="alert">
      {{ dashboardError }}
    </q-banner>

    <section class="search-section">
      <q-input
        v-model="search"
        outlined
        dense
        placeholder="Buscar por locatário ou livro"
        class="search-input"
        @keyup.enter="searchLoans"
      />

      <q-select
        v-model="statusFilter"
        :options="statusOptions"
        emit-value
        map-options
        outlined
        dense
        class="status-filter filter-select"
        popup-content-class="filter-select-menu"
        @update:model-value="filterByStatus"
      />
    </section>

    <q-banner v-if="loansError" dense class="state-banner error-banner" role="alert">
      {{ loansError }}
      <template #action>
        <q-btn flat label="Tentar novamente" :loading="loansLoading" @click="loadLoans" />
      </template>
    </q-banner>

    <q-banner v-if="referencesError" dense class="state-banner reference-banner" role="alert">
      {{ referencesError }} Os IDs serão exibidos até que os dados possam ser carregados.
      <template #action>
        <q-btn flat label="Tentar novamente" :loading="referencesLoading" @click="loadReferences" />
      </template>
    </q-banner>

    <section class="table-section">
      <q-table
        flat
        :rows="tableRows"
        :columns="columns"
        row-key="id"
        :loading="loansLoading"
        hide-pagination
        hide-bottom
        :no-data-label="noDataMessage"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <span class="status" :class="getStatusClass(props.row.status)">
              {{ getStatusLabel(props.row.status) }}
            </span>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn-dropdown
              flat
              round
              dense
              dropdown-icon="more_vert"
              aria-label="Ações do aluguel"
              :disable="savingLoan || returningLoanId !== null"
            >
              <q-list>
                <q-item
                  class="loan-action-item"
                  v-close-popup
                  clickable
                  @click="openEditLoan(props.row)"
                >
                  <q-item-section avatar><q-icon name="edit" /></q-item-section>
                  <q-item-section>Editar</q-item-section>
                </q-item>
                <q-item
                  class="loan-action-item"
                  v-if="isActiveLoan(props.row.status)"
                  v-close-popup
                  clickable
                  @click="openReturnConfirmation(props.row)"
                >
                  <q-item-section avatar><q-icon name="assignment_return" /></q-item-section>
                  <q-item-section>Registrar devolução</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
        <template #no-data>
          <div class="no-data">
            <q-icon :name="search || statusFilter ? 'search_off' : 'menu_book'" size="20px" />
            <span>{{ noDataMessage }}</span>
          </div>
        </template>
      </q-table>

      <div class="pagination-controls">
        <div class="page-size-control">
          <span>Linhas por página</span>
          <q-select
            v-model="pageSize"
            dense
            outlined
            :options="pageSizeOptions"
            class="page-size-select"
            popup-content-class="filter-select-menu"
            aria-label="Linhas por página"
            @update:model-value="changePageSize"
          />
        </div>

        <div class="page-navigation">
          <span class="page-label">{{ pageLabel }}</span>
          <q-btn
            flat
            round
            dense
            icon="chevron_left"
            aria-label="Página anterior"
            :disable="loansLoading || page === 0 || totalPages === 0"
            @click="goToPreviousPage"
          />
          <q-btn
            flat
            round
            dense
            icon="chevron_right"
            aria-label="Próxima página"
            :disable="loansLoading || page + 1 >= totalPages"
            @click="goToNextPage"
          />
        </div>
      </div>
    </section>

    <LoanFormDialog
      v-model="showLoanForm"
      :mode="loanFormMode"
      v-bind="selectedLoan ? { initialData: selectedLoan } : {}"
      :users="users"
      :books="books"
      :references-loaded="referencesLoaded"
      :references-loading="referencesLoading"
      :references-error="referencesError"
      :loading="savingLoan"
      :error-message="loanFormError"
      @save="saveLoan"
      @cancel="cancelLoanForm"
    />

    <q-dialog v-model="showReturnConfirmation" :persistent="returningLoanId !== null">
      <q-card class="loan-confirmation">
        <q-card-section class="text-h6">Registrar devolução</q-card-section>
        <q-card-section>
          Confirma a devolução do empréstimo #{{ pendingReturnLoan?.id }}?
          <div v-if="returnErrorMessage" class="operation-error" role="alert">
            {{ returnErrorMessage }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            :disable="returningLoanId !== null"
            @click="cancelReturnConfirmation"
          />
          <q-btn
            unelevated
            label="Confirmar devolução"
            color="primary"
            :loading="returningLoanId !== null"
            @click="confirmReturnLoan"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { BookService } from '@/services/BookService';
import { DashboardService } from '@/services/DashboardService';
import { LoanService } from '@/services/LoanService';
import { UserService } from '@/services/UserService';
import LoanFormDialog from '@/components/loans/LoanFormDialog.vue';
import type { GetLoansParams, LoanRequest, LoanResponse, LoanStatus } from '@/types/Loan';
import type { DashboardResponse } from '@/types/Dashboard';
import type { BookResponse } from '@/types/Book';
import type { PageResponse, UserResponse } from '@/types/User';

interface LoanTableRow extends LoanResponse {
  userName: string;
  bookTitle: string;
  loanDateLabel: string;
  returnDateLabel: string;
}

const $q = useQuasar();
const dashboard = ref<DashboardResponse | null>(null);
const dashboardLoading = ref(false);
const dashboardError = ref('');
let dashboardAccessDenied = false;
let dashboardRefreshPending = false;

const summaryCards = computed(() => [
  { label: 'Pendentes', value: dashboard.value?.pendingLoans, indicatorClass: 'pending' },
  { label: 'Atrasados', value: dashboard.value?.overdueLoans, indicatorClass: 'overdue' },
  { label: 'Devolvidos', value: dashboard.value?.returnedLoans, indicatorClass: 'returned' },
  {
    label: 'Total',
    value: dashboard.value
      ? dashboard.value.pendingLoans + dashboard.value.overdueLoans + dashboard.value.returnedLoans
      : undefined,
    indicatorClass: 'total',
  },
]);

const statusOptions: { label: string; value: LoanStatus | null }[] = [
  { label: 'Todos os status', value: null },
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Atrasado', value: 'OVERDUE' },
  { label: 'Devolvido', value: 'RETURNED' },
  { label: 'Devolvido C/A', value: 'RETURNED_LATE' },
];

const pageSizeOptions = [10, 25, 50];
const search = ref('');
const statusFilter = ref<LoanStatus | null>(null);
const loans = ref<LoanResponse[]>([]);
const loansLoading = ref(false);
const loansError = ref('');
const page = ref(0);
const pageSize = ref(10);
const totalElements = ref(0);
const totalPages = ref(0);
const userNames = ref(new Map<number, string>());
const bookTitles = ref(new Map<number, string>());
const users = ref<UserResponse[]>([]);
const books = ref<BookResponse[]>([]);
const referencesLoading = ref(false);
const referencesError = ref('');
const referencesLoaded = ref(false);
const referencesAttempted = ref(false);
const showLoanForm = ref(false);
const loanFormMode = ref<'create' | 'edit'>('create');
const selectedLoan = ref<LoanResponse | null>(null);
const savingLoan = ref(false);
const loanFormError = ref('');
const pendingReturnLoan = ref<LoanResponse | null>(null);
const showReturnConfirmation = ref(false);
const returningLoanId = ref<number | null>(null);
const returnErrorMessage = ref('');
let loansRequestId = 0;

const columns: QTableColumn<LoanTableRow>[] = [
  { name: 'user', label: 'Locatário', field: 'userName', align: 'left' },
  { name: 'book', label: 'Livro', field: 'bookTitle', align: 'left' },
  { name: 'loanDate', label: 'Aluguel', field: 'loanDateLabel', align: 'left' },
  { name: 'returnDate', label: 'Devolução', field: 'returnDateLabel', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Ação', field: 'id', align: 'center' },
];

const tableRows = computed<LoanTableRow[]>(() =>
  loans.value.map((loan) => ({
    ...loan,
    userName: userNames.value.get(loan.userId) ?? `Usuário #${loan.userId}`,
    bookTitle: bookTitles.value.get(loan.bookId) ?? `Livro #${loan.bookId}`,
    loanDateLabel: formatDate(loan.loanDate),
    returnDateLabel: formatDate(loan.returnDate),
  })),
);

const noDataMessage = computed(() =>
  search.value.trim() || statusFilter.value
    ? 'Nenhum aluguel encontrado para estes filtros.'
    : 'Ainda não há aluguéis cadastrados.',
);

const pageLabel = computed(() =>
  totalPages.value > 0 ? `Página ${page.value + 1} de ${totalPages.value}` : 'Nenhuma página',
);

async function loadDashboardStats() {
  if (dashboardAccessDenied) return;
  if (dashboardLoading.value) {
    dashboardRefreshPending = true;
    return;
  }

  dashboardLoading.value = true;
  dashboardError.value = '';
  try {
    const stats = await DashboardService.getDashboard();
    if (!dashboardRefreshPending) dashboard.value = stats;
  } catch (error) {
    const status =
      error && typeof error === 'object' && 'response' in error
        ? (error.response as { status?: number } | undefined)?.status
        : undefined;
    dashboardAccessDenied = status === 403;
    if (dashboardAccessDenied) dashboardRefreshPending = false;
    if (!dashboardRefreshPending || dashboardAccessDenied) {
      dashboard.value = null;
      dashboardError.value = dashboardAccessDenied
        ? 'Você não tem permissão para visualizar as estatísticas.'
        : 'Não foi possível carregar as estatísticas de empréstimos.';
    }
  } finally {
    dashboardLoading.value = false;
    if (dashboardRefreshPending && !dashboardAccessDenied) {
      dashboardRefreshPending = false;
      void loadDashboardStats();
    }
  }
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
}

function getStatusLabel(status: LoanStatus): string {
  const labels: Record<LoanStatus, string> = {
    PENDING: 'Pendente',
    OVERDUE: 'Atrasado',
    RETURNED: 'Devolvido',
    RETURNED_LATE: 'Devolvido C/A',
  };
  return labels[status];
}

function getStatusClass(status: LoanStatus): string {
  if (status === 'PENDING') return 'pending';
  if (status === 'OVERDUE') return 'overdue';
  return 'returned';
}

function isActiveLoan(status: LoanStatus): boolean {
  return status === 'PENDING' || status === 'OVERDUE';
}

async function loadLoans() {
  const requestId = ++loansRequestId;
  loansLoading.value = true;
  loansError.value = '';

  const params: GetLoansParams = {
    ...(search.value.trim() ? { name: search.value.trim() } : {}),
    ...(statusFilter.value ? { status: statusFilter.value } : {}),
    page: page.value,
    size: pageSize.value,
  };

  try {
    const response = await LoanService.getLoans(params);
    if (requestId !== loansRequestId) return;

    loans.value = response.content ?? [];
    totalElements.value = response.totalElements;
    totalPages.value = response.totalPages;
    if (loans.value.length && !referencesAttempted.value) void loadReferences();
  } catch {
    if (requestId !== loansRequestId) return;

    loans.value = [];
    totalElements.value = 0;
    totalPages.value = 0;
    loansError.value = 'Não foi possível carregar os aluguéis. Tente novamente.';
  } finally {
    if (requestId === loansRequestId) loansLoading.value = false;
  }
}

async function reloadLoansAfterOperation() {
  await loadLoans();
  if (!loansError.value && page.value > 0 && page.value >= totalPages.value) {
    page.value = Math.max(0, totalPages.value - 1);
    await loadLoans();
  }
}

async function loadAllPages<T>(
  getPage: (pageNumber: number, size: number) => Promise<PageResponse<T>>,
): Promise<T[]> {
  const size = 100;
  const firstPage = await getPage(0, size);
  const items = [...firstPage.content];

  for (let pageNumber = 1; pageNumber < firstPage.totalPages; pageNumber += 1) {
    const response = await getPage(pageNumber, size);
    items.push(...response.content);
  }

  return items;
}

async function loadReferences() {
  if (referencesLoading.value) return;

  referencesAttempted.value = true;
  referencesLoading.value = true;
  referencesError.value = '';

  try {
    const [userRecords, bookRecords] = await Promise.all([
      loadAllPages((pageNumber, size) => UserService.getUsers({ page: pageNumber, size })),
      loadAllPages((pageNumber, size) => BookService.getBooks({ page: pageNumber, size })),
    ]);

    users.value = userRecords;
    books.value = bookRecords;
    userNames.value = new Map(userRecords.map((user): [number, string] => [user.id, user.name]));
    bookTitles.value = new Map(bookRecords.map((book): [number, string] => [book.id, book.title]));
    referencesLoaded.value = true;
  } catch {
    referencesError.value = 'Não foi possível carregar os nomes de usuários e livros.';
  } finally {
    referencesLoading.value = false;
  }
}

function openCreateLoan() {
  loanFormMode.value = 'create';
  selectedLoan.value = null;
  loanFormError.value = '';
  showLoanForm.value = true;
  if (!referencesLoaded.value && !referencesLoading.value) void loadReferences();
}

function openEditLoan(row: LoanTableRow) {
  loanFormMode.value = 'edit';
  selectedLoan.value = loans.value.find((loan) => loan.id === row.id) ?? row;
  loanFormError.value = '';
  showLoanForm.value = true;
  if (!referencesLoaded.value && !referencesLoading.value) void loadReferences();
}

function cancelLoanForm() {
  loanFormError.value = '';
}

function getLoanSaveErrorMessage(error: unknown, isEditing: boolean): string {
  let backendMessage = '';
  let status: number | undefined;

  if (error && typeof error === 'object' && 'response' in error) {
    const response = error.response as { status?: number; data?: unknown } | undefined;
    status = response?.status;
    if (typeof response?.data === 'string') {
      backendMessage = response.data;
    } else if (response?.data && typeof response.data === 'object') {
      const data = response.data as Record<string, unknown>;
      backendMessage = [data.message, data.detail, data.error]
        .filter((value): value is string => typeof value === 'string')
        .join(' ');
    }
  }

  const normalized = backendMessage
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (/user.*(not found|does not exist)|usuario.*(nao encontrado|inexistente|nao existe)/.test(normalized)) {
    return 'O usuário selecionado não foi encontrado.';
  }
  if (/book.*(not found|does not exist)|livro.*(nao encontrado|inexistente|nao existe)/.test(normalized)) {
    return 'O livro selecionado não foi encontrado.';
  }
  if (
    /book.*(unavailable|no stock|no copies|not available)|no available copies|livro.*(sem exemplar|sem estoque|indisponivel|nao possui exemplares)/.test(
      normalized,
    )
  ) {
    return 'O livro não possui exemplares disponíveis para empréstimo.';
  }
  if (
    /(five|cinco|5).*(loan|emprest)|limit.*(loan|emprest)|limite.*emprest|emprestimos ativos|active loans/.test(
      normalized,
    )
  ) {
    return 'O usuário atingiu o limite de cinco empréstimos ativos.';
  }
  if (/\b(date|dates|data|datas)\b|loan date|return date/.test(normalized)) {
    return 'As datas informadas são inválidas. Confira o período do empréstimo.';
  }
  if (
    isEditing &&
    /(change|alter|modify).*(user|book|usuario|livro)|(user|book|usuario|livro).*(change|alter|modify)/.test(
      normalized,
    )
  ) {
    return 'Não é permitido alterar o usuário ou o livro de um empréstimo.';
  }
  if (status === 409) {
    return isEditing
      ? 'O empréstimo não pode ser editado devido às regras do backend.'
      : 'O empréstimo conflita com uma regra do backend. Verifique os dados e tente novamente.';
  }

  return backendMessage || 'Não foi possível salvar o empréstimo. Verifique os dados e tente novamente.';
}

async function saveLoan(payload: LoanRequest) {
  if (savingLoan.value) return;

  const isEditing = loanFormMode.value === 'edit';
  const loanId = selectedLoan.value?.id;
  if (isEditing && loanId === undefined) {
    loanFormError.value = 'Não foi possível identificar o empréstimo para edição.';
    return;
  }

  savingLoan.value = true;
  loanFormError.value = '';
  try {
    if (isEditing && loanId !== undefined) {
      await LoanService.updateLoan(loanId, payload);
    } else {
      await LoanService.createLoan(payload);
      page.value = 0;
    }
    showLoanForm.value = false;
    selectedLoan.value = null;
    await reloadLoansAfterOperation();
    await loadDashboardStats();
  } catch (error) {
    loanFormError.value = getLoanSaveErrorMessage(error, isEditing);
  } finally {
    savingLoan.value = false;
  }
}

function openReturnConfirmation(loan: LoanResponse) {
  if (!isActiveLoan(loan.status) || returningLoanId.value !== null) return;
  pendingReturnLoan.value = loan;
  returnErrorMessage.value = '';
  showReturnConfirmation.value = true;
}

function cancelReturnConfirmation() {
  if (returningLoanId.value !== null) return;
  showReturnConfirmation.value = false;
  pendingReturnLoan.value = null;
  returnErrorMessage.value = '';
}

function getReturnErrorMessage(error: unknown): string {
  const fallback =
    'Não foi possível registrar a devolução. Verifique sua conexão e tente novamente.';
  if (!error || typeof error !== 'object' || !('response' in error)) return fallback;

  const response = error.response;
  if (!response || typeof response !== 'object') return fallback;
  const details = response as { status?: number; data?: unknown };
  let backendMessage = '';
  if (typeof details.data === 'string') backendMessage = details.data;
  else if (details.data && typeof details.data === 'object') {
    const data = details.data as Record<string, unknown>;
    backendMessage = [data.message, data.detail, data.error]
      .filter((value): value is string => typeof value === 'string')
      .join(' ');
  }

  if (details.status === 404) return backendMessage || 'Este empréstimo não foi encontrado.';
  if (details.status === 409)
    return backendMessage || 'Este empréstimo já foi devolvido ou não pode ser devolvido.';
  return backendMessage || fallback;
}

async function confirmReturnLoan() {
  const loan = pendingReturnLoan.value;
  if (!loan || !isActiveLoan(loan.status) || returningLoanId.value !== null) return;
  returningLoanId.value = loan.id;
  returnErrorMessage.value = '';
  try {
    await LoanService.returnLoan(loan.id);
    showReturnConfirmation.value = false;
    pendingReturnLoan.value = null;
    $q.notify({
      type: 'positive',
      message: 'Devolução registrada com sucesso.',
      position: 'top-right',
    });
    await reloadLoansAfterOperation();
    await loadDashboardStats();
  } catch (error) {
    returnErrorMessage.value = getReturnErrorMessage(error);
  } finally {
    returningLoanId.value = null;
  }
}

function searchLoans() {
  page.value = 0;
  void loadLoans();
}

function filterByStatus() {
  page.value = 0;
  void loadLoans();
}

function changePageSize() {
  page.value = 0;
  void loadLoans();
}

function goToPreviousPage() {
  if (page.value === 0) return;
  page.value -= 1;
  void loadLoans();
}

function goToNextPage() {
  if (page.value + 1 >= totalPages.value) return;
  page.value += 1;
  void loadLoans();
}

onMounted(() => {
  void loadLoans();
  void loadDashboardStats();
});
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

.state-banner {
  margin-bottom: 12px;
  border-radius: 6px;
}

.error-banner {
  background-color: #fff1f0;
  color: #9f2828;
}

.reference-banner {
  background-color: #fff8e8;
  color: #684b13;
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

.no-data {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px;
  color: #444444;
  font-size: 13px;
}

.pagination-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-top: 1px solid #eeeeee;
  color: #34454d;
  font-size: 13px;
}

.page-size-control,
.page-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-size-select {
  width: 75px;
}

.page-label {
  min-width: 105px;
  text-align: right;
}

.loan-confirmation {
  width: 420px;
  max-width: 90vw;
  color: #34454d;
}

.operation-error {
  margin-top: 12px;
  color: #9f2828;
}

.loan-action-item {
  color: #1b3a5c;
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
