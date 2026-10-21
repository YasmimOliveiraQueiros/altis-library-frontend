<template>
  <q-page class="books-page">
    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-label">
          <span class="dot available"></span>
          Exemplares
        </div>
        <div class="stat-value">{{ availableCopiesOnPage }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">
          <span class="dot page-count"></span>
          Livros nesta página
        </div>
        <div class="stat-value">{{ books.length }}</div>
      </div>

      <div class="stat-card">
        <div class="stat-label">
          <span class="dot total"></span>
          Total na consulta
        </div>
        <div class="stat-value">{{ totalElements }}</div>
      </div>

      <q-btn
        class="new-book-button"
        label="+ Novo livro"
        unelevated
        :disable="savingBook"
        @click="openCreateBook"
      />
    </section>

    <section class="filters-section">
      <q-input
        v-model="searchInput"
        outlined
        dense
        placeholder="Buscar por título, autor ou observações"
        class="search-input"
        @keyup.enter="searchBooks"
      />

      <q-select
        v-model="sortBy"
        outlined
        dense
        :options="sortOptions"
        emit-value
        map-options
        label="Ordenar por"
        class="sort-select filter-select"
        popup-content-class="filter-select-menu"
        @update:model-value="changeSort"
      />

      <q-btn
        outline
        dense
        class="sort-direction"
        :label="sortDirection === 'ASC' ? 'Crescente' : 'Decrescente'"
        :icon="sortDirection === 'ASC' ? 'arrow_upward' : 'arrow_downward'"
        :aria-label="`Ordenação ${sortDirection === 'ASC' ? 'crescente' : 'decrescente'}. Alterar direção`"
        @click="toggleSortDirection"
      />
    </section>

    <q-banner v-if="booksError" dense class="state-banner error-banner" role="alert">
      {{ booksError }}
      <template #action>
        <q-btn flat label="Tentar novamente" :loading="booksLoading" @click="loadBooks" />
      </template>
    </q-banner>

    <q-banner v-if="publishersError" dense class="state-banner publisher-banner" role="alert">
      {{ publishersError }} Os livros continuam disponíveis; os nomes das editoras podem não ser
      exibidos.
      <template #action>
        <q-btn
          flat
          label="Tentar novamente"
          :loading="publishersLoading"
          @click="loadPublishers"
        />
      </template>
    </q-banner>

    <section class="table-section">
      <q-table
        flat
        :rows="tableRows"
        :columns="columns"
        row-key="id"
        :loading="booksLoading"
        hide-pagination
        hide-bottom
        :no-data-label="noDataMessage"
        class="books-table"
      >
        <template #body-cell-status="props">
          <q-td :props="props">
            <span class="registered-status">{{ props.row.statusLabel }}</span>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              icon="edit"
              aria-label="Editar livro"
              :disable="savingBook || deletingBookId !== null"
              @click="openEditBook(props.row)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              aria-label="Excluir livro"
              :disable="savingBook || deletingBookId !== null"
              @click="openDeleteConfirmation(props.row)"
            />
          </q-td>
        </template>
        <template #no-data>
          <div class="no-data">
            <q-icon :name="appliedSearch ? 'search_off' : 'menu_book'" size="20px" />
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
            :disable="booksLoading || page === 0 || totalPages === 0"
            @click="goToPreviousPage"
          />
          <q-btn
            flat
            round
            dense
            icon="chevron_right"
            aria-label="Próxima página"
            :disable="booksLoading || page + 1 >= totalPages"
            @click="goToNextPage"
          />
        </div>
      </div>
    </section>

    <BookFormDialog
      v-model="showBookForm"
      :mode="bookFormMode"
      v-bind="selectedBook ? { initialData: selectedBook } : {}"
      :publishers="publishers"
      :publishers-loading="publishersLoading"
      :publishers-error="publishersError"
      :loading="savingBook"
      :error-message="bookFormError"
      @save="saveBook"
      @cancel="bookFormError = ''"
    />

    <ConfirmDeleteDialog
      v-model="showDeleteConfirmation"
      title="Excluir livro"
      message="Tem certeza que deseja excluir o livro"
      :record-name="pendingDeleteBook?.title ?? ''"
      :error-message="deleteErrorMessage"
      :loading="deletingBookId !== null"
      @confirm="confirmDeleteBook"
      @cancel="cancelDeleteConfirmation"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { useQuasar } from 'quasar';
import { BookService } from '@/services/BookService';
import type { BookPayload, BookResponse, BookSortField, BookStatus, SortDirection } from '@/types/Book';
import { PublisherService } from '@/services/PublisherService';
import type { PublisherResponse } from '@/types/Publisher';
import BookFormDialog from '@/components/books/BookFormDialog.vue';
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog.vue';

interface BookTableRow extends BookResponse {
  publisherName: string;
  statusLabel: string;
}

const $q = useQuasar();
const searchInput = ref('');
const appliedSearch = ref('');
const books = ref<BookResponse[]>([]);
const publishers = ref<PublisherResponse[]>([]);
const booksLoading = ref(false);
const publishersLoading = ref(false);
const booksError = ref('');
const publishersError = ref('');
const showBookForm = ref(false);
const bookFormMode = ref<'create' | 'edit'>('create');
const selectedBookId = ref<number | null>(null);
const selectedBook = ref<BookResponse>();
const savingBook = ref(false);
const bookFormError = ref('');
const pendingDeleteBook = ref<BookResponse | null>(null);
const showDeleteConfirmation = ref(false);
const deletingBookId = ref<number | null>(null);
const deleteErrorMessage = ref('');
const totalElements = ref(0);
const totalPages = ref(0);
const page = ref(0);
const pageSize = ref(10);
const sortBy = ref<BookSortField>('title');
const sortDirection = ref<SortDirection>('ASC');
let booksRequestId = 0;
let publishersRequestId = 0;

const pageSizeOptions = [10, 25, 50];

const sortOptions: { label: string; value: BookSortField }[] = [
  { label: 'ID', value: 'id' },
  { label: 'Título', value: 'title' },
  { label: 'Autor', value: 'author' },
  { label: 'Quantidade disponível', value: 'quantity' },
  { label: 'Status registrado', value: 'status' },
];

const availableCopiesOnPage = computed(() =>
  books.value.reduce((total, book) => total + book.quantity, 0),
);

const publisherNames = computed(() =>
  Object.fromEntries(publishers.value.map((publisher) => [publisher.id, publisher.name])),
);

const tableRows = computed<BookTableRow[]>(() =>
  books.value.map((book) => ({
    ...book,
    publisherName: publisherNames.value[book.publisherId] ?? 'Editora não localizada',
    statusLabel: formatBookStatus(book.status),
  })),
);

const noDataMessage = computed(() =>
  appliedSearch.value ? 'Nenhum livro encontrado para esta pesquisa.' : 'Ainda não há livros cadastrados.',
);

const pageLabel = computed(() =>
  totalPages.value > 0 ? `Página ${page.value + 1} de ${totalPages.value}` : 'Nenhuma página',
);

const columns: QTableColumn<BookTableRow>[] = [
  {
    name: 'title',
    label: 'Título',
    field: 'title',
    align: 'left',
  },
  {
    name: 'author',
    label: 'Autor',
    field: 'author',
    align: 'left',
  },
  {
    name: 'publisher',
    label: 'Editora',
    field: 'publisherName',
    align: 'left',
  },
  {
    name: 'quantity',
    label: 'Quantidade disponível',
    field: 'quantity',
    align: 'center',
  },
  {
    name: 'status',
    label: 'Status registrado',
    field: 'statusLabel',
    align: 'center',
  },
  {
    name: 'actions',
    label: 'Ação',
    field: 'id',
    align: 'center',
  },
];

function formatBookStatus(status: BookStatus): string {
  if (status === 'AVAILABLE') return 'Disponível (registrado)';
  if (status === 'RENTED') return 'Alugado (registrado)';
  return status;
}

async function loadBooks() {
  const requestId = ++booksRequestId;
  booksLoading.value = true;
  booksError.value = '';

  try {
    const response = await BookService.getBooks({
      ...(appliedSearch.value ? { search: appliedSearch.value } : {}),
      page: page.value,
      size: pageSize.value,
      sortBy: sortBy.value,
      sortDirection: sortDirection.value,
    });

    if (requestId !== booksRequestId) return;

    books.value = response.content ?? [];
    totalElements.value = response.totalElements;
    totalPages.value = response.totalPages;
  } catch {
    if (requestId !== booksRequestId) return;

    books.value = [];
    totalElements.value = 0;
    totalPages.value = 0;
    booksError.value = 'Não foi possível carregar os livros. Tente novamente.';
  } finally {
    if (requestId === booksRequestId) booksLoading.value = false;
  }
}

async function loadPublishers() {
  const requestId = ++publishersRequestId;
  publishersLoading.value = true;
  publishersError.value = '';

  try {
    const firstPage = await PublisherService.getPublishers({ page: 0 });
    const publisherRows: PublisherResponse[] = [...(firstPage.content ?? [])];

    for (let pageNumber = 1; pageNumber < firstPage.totalPages; pageNumber += 1) {
      const response = await PublisherService.getPublishers({ page: pageNumber });
      publisherRows.push(...(response.content ?? []));
    }

    if (requestId !== publishersRequestId) return;

    publishers.value = publisherRows;
  } catch {
    if (requestId !== publishersRequestId) return;

    publishers.value = [];
    publishersError.value = 'Não foi possível carregar as editoras.';
  } finally {
    if (requestId === publishersRequestId) publishersLoading.value = false;
  }
}

function openCreateBook() {
  bookFormMode.value = 'create';
  selectedBookId.value = null;
  selectedBook.value = undefined;
  bookFormError.value = '';
  showBookForm.value = true;
}

function openEditBook(book: BookTableRow) {
  bookFormMode.value = 'edit';
  selectedBookId.value = book.id;
  selectedBook.value = books.value.find((item) => item.id === book.id);
  bookFormError.value = '';
  showBookForm.value = true;
}

async function saveBook(payload: BookPayload) {
  if (savingBook.value) return;

  const isEditing = bookFormMode.value === 'edit';
  const bookId = selectedBookId.value;

  if (isEditing && bookId === null) {
    bookFormError.value = 'Não foi possível identificar o livro para atualização.';
    return;
  }

  savingBook.value = true;
  bookFormError.value = '';

  try {
    if (isEditing && bookId !== null) {
      await BookService.updateBook(bookId, payload);
    } else {
      await BookService.createBook(payload);
    }

    showBookForm.value = false;
    await loadBooks();
  } catch {
    bookFormError.value = isEditing
      ? 'Não foi possível atualizar o livro. Verifique os dados e tente novamente.'
      : 'Não foi possível cadastrar o livro. Verifique os dados e tente novamente.';
  } finally {
    savingBook.value = false;
  }
}

function openDeleteConfirmation(book: BookTableRow) {
  if (savingBook.value || deletingBookId.value !== null) return;

  pendingDeleteBook.value = book;
  deleteErrorMessage.value = '';
  showDeleteConfirmation.value = true;
}

function cancelDeleteConfirmation() {
  if (deletingBookId.value !== null) return;

  showDeleteConfirmation.value = false;
  pendingDeleteBook.value = null;
  deleteErrorMessage.value = '';
}

function getDeleteErrorMessage(error: unknown): string {
  const fallback = 'Não foi possível excluir o livro. Tente novamente.';
  if (!error || typeof error !== 'object' || !('response' in error)) return fallback;

  const response = error.response;
  if (!response || typeof response !== 'object') return fallback;

  const details = response as { status?: number; data?: unknown };
  let backendMessage = '';

  if (typeof details.data === 'string') {
    backendMessage = details.data;
  } else if (details.data && typeof details.data === 'object') {
    const data = details.data as Record<string, unknown>;
    backendMessage = [data.message, data.detail, data.error]
      .filter((value): value is string => typeof value === 'string')
      .join(' ');
  }

  if (details.status === 409) {
    return (
      backendMessage ||
      'Não é possível excluir este livro porque existem empréstimos vinculados a ele.'
    );
  }
  if (details.status === 404) return backendMessage || 'Este livro não foi encontrado.';
  if (details.status === 401) return 'Sua autenticação expirou. Entre novamente para continuar.';
  if (details.status === 403) return 'Você não tem permissão para excluir este livro.';
  if (details.status === 500) return 'Ocorreu um erro ao excluir o livro. Tente novamente.';

  return backendMessage || fallback;
}

async function confirmDeleteBook() {
  const book = pendingDeleteBook.value;
  if (!book || deletingBookId.value !== null) return;

  deletingBookId.value = book.id;
  deleteErrorMessage.value = '';

  try {
    await BookService.deleteBook(book.id);
    showDeleteConfirmation.value = false;
    pendingDeleteBook.value = null;
    $q.notify({
      type: 'positive',
      message: 'Livro excluído com sucesso.',
      position: 'top-right',
      timeout: 3000,
    });

    await loadBooks();
    if (!booksError.value && books.value.length === 0 && page.value > 0) {
      page.value -= 1;
      await loadBooks();
    }
  } catch (error) {
    deleteErrorMessage.value = getDeleteErrorMessage(error);
  } finally {
    deletingBookId.value = null;
  }
}

function searchBooks() {
  appliedSearch.value = searchInput.value.trim();
  page.value = 0;
  void loadBooks();
}

function changeSort() {
  page.value = 0;
  void loadBooks();
}

function toggleSortDirection() {
  sortDirection.value = sortDirection.value === 'ASC' ? 'DESC' : 'ASC';
  page.value = 0;
  void loadBooks();
}

function changePageSize() {
  page.value = 0;
  void loadBooks();
}

function goToPreviousPage() {
  if (page.value === 0) return;

  page.value -= 1;
  void loadBooks();
}

function goToNextPage() {
  if (page.value + 1 >= totalPages.value) return;

  page.value += 1;
  void loadBooks();
}

onMounted(() => {
  void loadBooks();
  void loadPublishers();
});
</script>

<style scoped>
.books-page {
  background-color: #ffffff;
  padding: 15px 20px;
}

.stats-section {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  width: 145px;
  min-height: 80px;
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
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
}

.available {
  background-color: #19a56f;
}

.page-count {
  background-color: #e9a23b;
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

.filters-section {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1 1 260px;
}

.sort-select {
  flex: 0 1 220px;
}

.sort-direction {
  min-height: 40px;
  color: #1b3a5c;
  border-color: #1b3a5c;
}

.state-banner {
  margin-bottom: 12px;
  border-radius: 6px;
}

.error-banner {
  background-color: #fff1f0;
  color: #9f2828;
}

.publisher-banner {
  background-color: #fff8e8;
  color: #684b13;
}

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

.registered-status {
  color: #34454d;
  font-size: 12px;
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

@media (max-width: 700px) {
  .filters-section {
    align-items: stretch;
    flex-direction: column;
  }

  .sort-select {
    flex-basis: auto;
  }

  .sort-direction {
    align-self: flex-start;
  }

  .new-book-button {
    margin-left: 0;
  }
}
</style>
