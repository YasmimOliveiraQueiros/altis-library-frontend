<template>
  <q-page class="publisher-page">
    <!-- Resumo -->
    <section class="page-top">
      <div class="summary-cards">
        <q-card flat bordered class="summary-card">
          <div class="summary-label">
            <span class="status-dot editoras"></span>
            {{ t('publishers.stats.publishers') }}
          </div>

          <div class="summary-value">
            {{ totalPublishers }}
          </div>
        </q-card>

        <q-card
          flat
          bordered
          class="summary-card"
          :title="t('publishers.stats.linkedBooksTitle')"
        >
          <div class="summary-label">
            <span class="status-dot livros"></span>
            {{ t('publishers.stats.linkedBooks') }}
          </div>

          <div class="summary-value">
            {{ booksLinkedOnLoadedPage }}
          </div>
        </q-card>
      </div>

      <q-btn
        :label="t('publishers.actions.new')"
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
        :placeholder="t('publishers.searchPlaceholder')"
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
        :no-data-label="t('publishers.empty')"
        class="publisher-table"
      >
        <template #body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              icon="edit"
              :aria-label="t('publishers.actions.edit')"
              :disable="savingPublisher"
              @click="openEditPublisher(props.row)"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              color="negative"
              :aria-label="t('publishers.actions.delete')"
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

    <ConfirmDeleteDialog
      v-model="showDeleteConfirmation"
      :title="t('publishers.delete.title')"
      :message="t('publishers.delete.message')"
      :cancel-label="t('publishers.actions.cancel')"
      :confirm-label="t('publishers.actions.delete')"
      :record-name="pendingDeletePublisher?.name ?? ''"
      :error-message="deleteErrorMessage"
      :loading="deletingPublisherId !== null"
      @confirm="confirmDeletePublisher"
      @cancel="cancelDeleteConfirmation"
    />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { PublisherService } from '@/services/PublisherService';
import type { PublisherPayload, PublisherResponse, PublisherStatus } from '@/types/Publisher';
import PublisherFormDialog from '@/components/publishers/PublisherFormDialog.vue';
import ConfirmDeleteDialog from '@/components/shared/ConfirmDeleteDialog.vue';
import { useQuasar } from 'quasar';
import type { QTableColumn } from 'quasar';

interface PublisherFormSubmission {
  name: string;
  email: string;
  cnpj: string;
  city: string;
  copies: number | null;
}

const $q = useQuasar();
const { t } = useI18n();
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
  if (value === 'ACTIVE') return t('publishers.status.active');
  if (value === 'INACTIVE') return t('publishers.status.inactive');

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
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && !error.response) {
      errorMessage.value = t('publishers.errors.serviceUnavailable');
    } else if (axios.isAxiosError(error) && error.response?.status === 401) {
      errorMessage.value = t('publishers.errors.unauthorized');
    } else if (axios.isAxiosError(error) && error.response?.status === 403) {
      errorMessage.value = t('publishers.errors.forbidden');
    } else {
      errorMessage.value = t('publishers.errors.load');
    }
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
  };
  publisherFormError.value = '';
  showPublisherForm.value = true;
}

async function handlePublisherFormSave(formData: PublisherFormSubmission) {
  if (savingPublisher.value) return;

  const isEditing = formMode.value === 'edit';
  const publisherId = selectedPublisherId.value;
  if (isEditing && publisherId === null) {
    publisherFormError.value = t('publishers.errors.updateIdMissing');
    return;
  }

  const cityState = formData.city.trim().match(/^(.+?)\s*-\s*([A-Za-z]{2})$/);
  if (!cityState) {
    publisherFormError.value = t('publishers.validation.cityStateFormat');
    return;
  }

  const city = cityState[1]?.trim();
  const state = cityState[2]?.toUpperCase();
  if (!city || !state) {
    publisherFormError.value = t('publishers.validation.cityStateFormat');
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
      message: isEditing ? t('publishers.success.updated') : t('publishers.success.created'),
      position: 'top-right',
      timeout: 3000,
    });
    await loadPublishers(search.value);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && !error.response) {
      publisherFormError.value = t('publishers.errors.serviceUnavailable');
    } else if (axios.isAxiosError(error) && error.response?.status === 400) {
      publisherFormError.value = t('publishers.errors.validation');
    } else if (axios.isAxiosError(error) && error.response?.status === 401) {
      publisherFormError.value = t('publishers.errors.unauthorized');
    } else if (axios.isAxiosError(error) && error.response?.status === 403) {
      publisherFormError.value = t('publishers.errors.forbidden');
    } else {
      publisherFormError.value = isEditing
        ? t('publishers.errors.update')
        : t('publishers.errors.create');
    }
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
        ? t('publishers.errors.hasLinkedBooks', { count: publisher.bookCount })
        : t('publishers.errors.linkedBooksUnknown'),
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
  const fallback = t('publishers.errors.delete');
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return t('publishers.errors.serviceUnavailable');
  if (error.response.status === 401) return t('publishers.errors.unauthorized');
  if (error.response.status === 403) return t('publishers.errors.forbidden');
  if (error.response.status === 404) return fallback;
  if (error.response.status === 409) return fallback;
  return fallback;
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
      message: t('publishers.success.deleted'),
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

const columns = computed<QTableColumn[]>(() => [
  {
    name: 'name',
    label: t('publishers.table.name'),
    field: 'name',
    align: 'left' as const,
  },
  {
    name: 'email',
    label: t('publishers.table.email'),
    field: 'email',
    align: 'left' as const,
  },
  {
    name: 'books',
    label: t('publishers.table.books'),
    field: 'bookCount',
    align: 'center' as const,
  },
  {
    name: 'status',
    label: t('publishers.table.status'),
    field: 'status',
    align: 'center' as const,
    format: formatPublisherStatus,
  },
  {
    name: 'actions',
    label: t('publishers.table.actions'),
    field: 'actions',
    align: 'center' as const,
  },
]);
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
