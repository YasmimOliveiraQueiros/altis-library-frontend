<template>
  <q-dialog v-model="dialog" :persistent="loading">
    <q-card class="book-form">
      <q-card-section class="form-header q-pt-lg q-px-lg q-pb-sm">
        <div class="text-h6">
          {{ mode === 'edit' ? t('books.form.editTitle') : t('books.form.newTitle') }}
        </div>

        <q-btn flat round dense icon="close" :disable="loading" @click="cancelDialog" />
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-sm q-pb-lg">
        <q-form @submit.prevent="handleSave">
          <div class="book-fields">
            <q-input
              v-model="form.title"
              :label="t('books.form.title')"
              :placeholder="t('books.form.titlePlaceholder')"
              outlined
              hide-bottom-space
              :disable="loading"
              :rules="[(value) => !!String(value ?? '').trim() || t('books.validation.titleRequired')]"
            />

            <q-input
              v-model="form.author"
              :label="t('books.form.author')"
              :placeholder="t('books.form.authorPlaceholder')"
              outlined
              hide-bottom-space
              :disable="loading"
              :rules="[(value) => !!String(value ?? '').trim() || t('books.validation.authorRequired')]"
            />

            <div>
              <q-select
                v-model="form.publisherId"
                :label="t('books.form.publisher')"
                :placeholder="t('books.form.publisherPlaceholder')"
                :options="publishers"
                option-label="name"
                option-value="id"
                emit-value
                map-options
                outlined
                hide-bottom-space
                class="filter-select"
                popup-content-class="filter-select-menu"
                :loading="publishersLoading"
                :disable="loading || publishersLoading"
                :rules="[(value) => value !== null || t('books.validation.publisherRequired')]"
              >
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ publisherNoOptionsLabel }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div v-if="publishersError" class="field-error text-negative" role="alert">
                {{ publishersError }}
              </div>
            </div>

            <q-input
              v-model.number="form.quantity"
              :label="t('books.form.quantity')"
              type="number"
              min="0"
              step="1"
              outlined
              hide-bottom-space
              :disable="loading"
              :rules="[
                (value) => value !== null && value !== '' || t('books.validation.quantityRequired'),
                (value) => Number.isInteger(Number(value)) || t('books.validation.quantityInteger'),
                (value) => Number(value) >= 0 || t('books.validation.quantityNonnegative'),
              ]"
            />

            <q-input
              v-model="form.observations"
              :label="t('books.form.observations')"
              type="textarea"
              outlined
              hide-bottom-space
              :disable="loading"
            />
          </div>

          <div v-if="errorMessage" class="form-error text-negative" role="alert">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <q-btn
              :label="t('books.actions.cancel')"
              flat
              class="cancel-btn"
              :disable="loading"
              @click="cancelDialog"
            />

            <q-btn :label="t('books.actions.save')" type="submit" :loading="loading" :disable="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { BookPayload, BookResponse } from '@/types/Book';
import type { PublisherResponse } from '@/types/Publisher';

interface BookFormData {
  title: string;
  author: string;
  publisherId: number | null;
  quantity: number | null;
  observations: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    mode?: 'create' | 'edit';
    initialData?: BookResponse;
    publishers?: PublisherResponse[];
    publishersLoading?: boolean;
    publishersError?: string;
    loading?: boolean;
    errorMessage?: string;
  }>(),
  {
    mode: 'create',
    publishers: () => [],
    publishersLoading: false,
    publishersError: '',
    loading: false,
    errorMessage: '',
  },
);

const { t } = useI18n();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: BookPayload];
  cancel: [];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const form = reactive<BookFormData>(createEmptyForm());

const publisherNoOptionsLabel = computed(() => {
  if (props.publishersLoading) return t('books.form.publishersLoading');
  if (props.publishersError) return t('books.form.publishersError');
  return t('books.form.noPublishers');
});

watch(
  () => [props.modelValue, props.initialData] as const,
  ([isOpen]) => {
    if (isOpen) resetForm();
  },
);

function createEmptyForm(): BookFormData {
  return {
    title: '',
    author: '',
    publisherId: null,
    quantity: null,
    observations: '',
  };
}

function resetForm() {
  Object.assign(form, createEmptyForm(), {
    title: props.initialData?.title ?? '',
    author: props.initialData?.author ?? '',
    publisherId: props.initialData?.publisherId ?? null,
    quantity: props.initialData?.quantity ?? null,
    observations: props.initialData?.observations ?? '',
  });
}

function cancelDialog() {
  dialog.value = false;
  emit('cancel');
}

function handleSave() {
  if (props.loading) return;

  const title = form.title.trim();
  const author = form.author.trim();
  const quantity = Number(form.quantity);

  if (
    !title ||
    !author ||
    form.publisherId === null ||
    form.quantity === null ||
    String(form.quantity).trim() === '' ||
    !Number.isInteger(quantity) ||
    quantity < 0
  ) {
    return;
  }

  emit('save', {
    title,
    author,
    publisherId: form.publisherId,
    quantity,
    observations: form.observations.trim() || null,
  });
}
</script>

<style scoped>
.book-form {
  width: 500px;
  max-width: 90vw;
  border-radius: 8px;
}

.book-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.field-error {
  margin-top: 4px;
  font-size: 12px;
}

.form-error {
  margin-top: 12px;
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
