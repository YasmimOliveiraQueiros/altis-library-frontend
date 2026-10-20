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
            {{ totalPublishers }}
          </div>
        </q-card>

        <q-card
          flat
          bordered
          class="summary-card"
          title="Soma dos livros vinculados às editoras desta página carregada"
        >
          <div class="summary-label">
            <span class="status-dot livros"></span>
            Livros vinculados
          </div>

          <div class="summary-value">
            {{ booksLinkedOnLoadedPage }}
          </div>
        </q-card>
      </div>

      <q-btn
        label="+ Nova editora"
        class="new-publisher-btn"
        unelevated
        @click="openCreatePublisher"
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
        @keydown.enter.prevent="searchPublishers"
      />
    </section>

    <!-- Tabela -->
    <section class="table-section">
      <div v-if="errorMessage" class="text-negative q-pa-sm" role="alert">
        {{ errorMessage }}
      </div>

      <q-table
        flat
        :rows="publisherRows"
        :columns="columns"
        row-key="id"
        :loading="loading"
        hide-pagination
        :rows-per-page-options="[0]"
        no-data-label="Dados serão carregados pelo backend."
        class="publisher-table"
      >
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              icon="edit"
              aria-label="Editar editora"
              :disable="savingPublisher"
              @click="openEditPublisher(props.row)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              aria-label="Excluir editora"
              :disable="savingPublisher || deletingPublisherId !== null"
              @click="openDeleteConfirmation(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </section>

    <PublisherFormDialog
      v-model="showPublisherForm"
      :mode="formMode"
      :initial-data="initialFormData"
      :loading="savingPublisher"
      :error-message="publisherFormError"
      @save="handlePublisherFormSave"
      @cancel="publisherFormError = ''"
    />

    <q-dialog v-model="showDeleteConfirmation" :persistent="deletingPublisherId !== null">
      <q-card class="publisher-delete-dialog">
        <q-card-section class="delete-dialog-header">
          <div class="text-h6">Excluir editora</div>
        </q-card-section>

        <q-card-section>
          Tem certeza que deseja excluir a editora
          <strong>{{ pendingDeletePublisher?.name }}</strong
          >?
          <div v-if="deleteErrorMessage" class="delete-error text-negative" role="alert">
            {{ deleteErrorMessage }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            :disable="deletingPublisherId !== null"
            @click="cancelDeleteConfirmation"
          />
          <q-btn
            unelevated
            color="negative"
            label="Excluir"
            :loading="deletingPublisherId === pendingDeletePublisher?.id"
            :disable="deletingPublisherId !== null"
            @click="confirmDeletePublisher"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { PublisherService } from '@/services/PublisherService';
import type { PublisherPayload, PublisherResponse, PublisherStatus } from '@/types/Publisher';
import PublisherFormDialog from '@/components/publishers/PublisherFormDialog.vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';

interface PublisherFormSubmission {
  name: string;
  email: string;
  cnpj: string;
  city: string;
  copies: number | null;
  status: 'Ativa' | 'Inativa';
}

const $q = useQuasar();
const search = ref('');
const showPublisherForm = ref(false);
const formMode = ref<'create' | 'edit'>('create');
const selectedPublisherId = ref<number | null>(null);
const initialFormData = ref<PublisherFormSubmission>({
  name: '',
  email: '',
  cnpj: '',
  city: '',
  copies: 0,
  status: 'Ativa',
});
const publisherRows = ref<PublisherResponse[]>([]);
const totalPublishers = ref(0);
const loading = ref(false);
const errorMessage = ref('');
const savingPublisher = ref(false);
const publisherFormError = ref('');
const pendingDeletePublisher = ref<PublisherResponse | null>(null);
const showDeleteConfirmation = ref(false);
const deletingPublisherId = ref<number | null>(null);
const deleteErrorMessage = ref('');

const booksLinkedOnLoadedPage = computed(() =>
  publisherRows.value.reduce((total, publisher) => total + (publisher.bookCount ?? 0), 0),
);

function formatPublisherStatus(value: PublisherStatus): string {
  if (value === 'ACTIVE') return 'Ativa';
  if (value === 'INACTIVE') return 'Inativa';

  return value;
}

async function loadPublishers(searchTerm = '') {
  loading.value = true;
  errorMessage.value = '';

  try {
    const searchText = searchTerm.trim();
    const response = searchText
      ? await PublisherService.getPublishers({ search: searchText })
      : await PublisherService.getPublishers();
    const publishers = response.content ?? [];

    publisherRows.value = publishers;
    totalPublishers.value = response.totalElements;
  } catch {
    errorMessage.value = 'Não foi possível carregar as editoras. Tente novamente.';
  } finally {
    loading.value = false;
  }
}

function searchPublishers() {
  void loadPublishers(search.value);
}

onMounted(loadPublishers);

function openCreatePublisher() {
  formMode.value = 'create';
  selectedPublisherId.value = null;
  initialFormData.value = {
    name: '',
    email: '',
    cnpj: '',
    city: '',
    copies: 0,
    status: 'Ativa',
  };
  publisherFormError.value = '';
  showPublisherForm.value = true;
}

function openEditPublisher(publisher: PublisherResponse) {
  formMode.value = 'edit';
  selectedPublisherId.value = publisher.id;
  initialFormData.value = {
    name: publisher.name,
    email: publisher.email,
    cnpj: publisher.cnpj,
    city: `${publisher.city} - ${publisher.state}`,
    copies: publisher.bookCount,
    status: publisher.status === 'ACTIVE' ? 'Ativa' : 'Inativa',
  };
  publisherFormError.value = '';
  showPublisherForm.value = true;
}

async function handlePublisherFormSave(formData: PublisherFormSubmission) {
  if (savingPublisher.value) return;

  const isEditing = formMode.value === 'edit';
  const publisherId = selectedPublisherId.value;
  if (isEditing && publisherId === null) {
    publisherFormError.value = 'Não foi possível identificar a editora para atualização.';
    return;
  }

  const cityState = formData.city.trim().match(/^(.+?)\s*-\s*([A-Za-z]{2})$/);
  if (!cityState) {
    publisherFormError.value = 'Informe a cidade e a UF no formato Cidade - UF.';
    return;
  }

  const city = cityState[1]?.trim();
  const state = cityState[2]?.toUpperCase();
  if (!city || !state) {
    publisherFormError.value = 'Informe a cidade e a UF no formato Cidade - UF.';
    return;
  }

  const payload: PublisherPayload = {
    name: formData.name.trim(),
    email: formData.email.trim(),
    cnpj: formData.cnpj.trim(),
    city,
    state,
  };

  savingPublisher.value = true;
  publisherFormError.value = '';

  try {
    if (isEditing && publisherId !== null) {
      await PublisherService.updatePublisher(publisherId, payload);
    } else {
      await PublisherService.createPublisher(payload);
    }

    showPublisherForm.value = false;
    $q.notify({
      type: 'positive',
      message: isEditing ? 'Editora atualizada com sucesso.' : 'Editora cadastrada com sucesso.',
      position: 'top-right',
      timeout: 3000,
    });
    await loadPublishers(search.value);
  } catch {
    publisherFormError.value = isEditing
      ? 'Não foi possível atualizar a editora. Verifique os dados e tente novamente.'
      : 'Não foi possível cadastrar a editora. Verifique os dados e tente novamente.';
  } finally {
    savingPublisher.value = false;
  }
}

function openDeleteConfirmation(publisher: PublisherResponse) {
  if (deletingPublisherId.value !== null || savingPublisher.value) return;

  if (publisher.bookCount !== 0) {
    const hasKnownLinkedBooks =
      typeof publisher.bookCount === 'number' &&
      Number.isFinite(publisher.bookCount) &&
      publisher.bookCount > 0;

    $q.notify({
      type: 'negative',
      message: hasKnownLinkedBooks
        ? `Esta editora não pode ser excluída porque possui ${publisher.bookCount} livro(s) vinculado(s).`
        : 'Não foi possível confirmar se esta editora possui livros vinculados. A exclusão foi bloqueada.',
      position: 'top-right',
      timeout: 4000,
    });
    return;
  }

  pendingDeletePublisher.value = publisher;
  deleteErrorMessage.value = '';
  showDeleteConfirmation.value = true;
}

function cancelDeleteConfirmation() {
  if (deletingPublisherId.value !== null) return;

  showDeleteConfirmation.value = false;
  pendingDeletePublisher.value = null;
  deleteErrorMessage.value = '';
}

function getDeleteErrorMessage(error: unknown): string {
  let backendMessage = '';

  if (error && typeof error === 'object' && 'response' in error) {
    const response = error.response;
    if (response && typeof response === 'object' && 'data' in response) {
      const data = response.data;
      if (typeof data === 'string') {
        backendMessage = data;
      } else if (data && typeof data === 'object') {
        const details = data as Record<string, unknown>;
        backendMessage = [details.message, details.detail, details.error]
          .filter((value): value is string => typeof value === 'string')
          .join(' ');
      }
    }
  }

  if (/livros?|books?|vinculad|associad|empr[eé]stim/i.test(backendMessage)) {
    return 'Não foi possível excluir esta editora porque há livros vinculados. Remova ou reassocie esses livros e tente novamente.';
  }

  return 'Não foi possível excluir a editora. Verifique os dados e tente novamente.';
}

async function confirmDeletePublisher() {
  const publisher = pendingDeletePublisher.value;
  if (!publisher || deletingPublisherId.value !== null) return;

  deletingPublisherId.value = publisher.id;
  deleteErrorMessage.value = '';

  try {
    await PublisherService.deletePublisher(publisher.id);
    showDeleteConfirmation.value = false;
    pendingDeletePublisher.value = null;
    $q.notify({
      type: 'positive',
      message: 'Editora excluída com sucesso.',
      position: 'top-right',
      timeout: 3000,
    });
    await loadPublishers(search.value);
  } catch (error) {
    deleteErrorMessage.value = getDeleteErrorMessage(error);
  } finally {
    deletingPublisherId.value = null;
  }
}

const columns: QTableColumn[] = [
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
    field: 'bookCount',
    align: 'center' as const,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center' as const,
    format: formatPublisherStatus,
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

.publisher-delete-dialog {
  width: 420px;
  max-width: 90vw;
  border-radius: 8px;
}

.delete-dialog-header {
  color: #1b3a5c;
}

.delete-error {
  margin-top: 12px;
}
</style>
