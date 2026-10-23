<template>
  <q-dialog v-model="dialog" :persistent="loading">
    <q-card class="loan-form">
      <q-card-section class="form-header q-pt-lg q-px-lg q-pb-sm">
        <div class="text-h6">{{ mode === 'edit' ? t('loans.form.editTitle') : t('loans.form.newTitle') }}</div>
        <q-btn flat round dense icon="close" :disable="loading" @click="cancelDialog" />
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-sm q-pb-lg">
        <q-form @submit.prevent="handleSave">
          <div class="loan-fields">
            <q-select
              v-model="form.userId"
              :label="t('loans.form.borrower')"
              :options="users"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              outlined
              hide-bottom-space
              class="filter-select"
              popup-content-class="filter-select-menu"
              :loading="referencesLoading"
              :disable="loading || referencesLoading || !referencesLoaded || mode === 'edit'"
              :rules="[
                (value) => props.users.some((user) => user.id === value) || t('loans.validation.borrowerRequired'),
              ]"
            >
              <template #no-option>
                  <q-item><q-item-section class="text-grey">{{ t('loans.form.noUsers') }}</q-item-section></q-item>
              </template>
            </q-select>

            <q-select
              v-model="form.bookId"
              :label="t('loans.form.book')"
              :options="books"
              option-label="title"
              option-value="id"
              emit-value
              map-options
              outlined
              hide-bottom-space
              class="filter-select"
              popup-content-class="filter-select-menu"
              :loading="referencesLoading"
              :disable="loading || referencesLoading || !referencesLoaded || mode === 'edit'"
              :rules="[
                (value) => props.books.some((book) => book.id === value) || t('loans.validation.bookRequired'),
              ]"
            >
              <template #no-option>
                  <q-item><q-item-section class="text-grey">{{ t('loans.form.noBooks') }}</q-item-section></q-item>
              </template>
            </q-select>

            <div class="date-fields">
              <q-input
                v-model="form.loanDate"
                :label="t('loans.form.loanDate')"
                :lang="locale"
                outlined
                type="date"
                hide-bottom-space
                :disable="loading"
                :rules="[(value) => !!value || t('loans.validation.loanDateRequired')]"
              />
              <q-input
                v-model="form.returnDate"
                :label="t('loans.form.returnDate')"
                :lang="locale"
                outlined
                type="date"
                hide-bottom-space
                :disable="loading"
                :rules="[
                  (value) => !!value || t('loans.validation.returnDateRequired'),
                  (value) =>
                    !form.loanDate || !value || value >= form.loanDate ||
                    t('loans.validation.returnDateAfterLoan'),
                ]"
              />
            </div>

            <q-input
              v-model="form.observations"
              :label="t('loans.form.observations')"
              outlined
              type="textarea"
              :disable="loading"
            />
          </div>

          <div v-if="referencesError" class="form-error text-negative" role="alert">
            {{ referencesError }}
          </div>
          <div v-if="errorMessage" class="form-error text-negative" role="alert">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <q-btn :label="t('loans.actions.cancel')" flat class="cancel-btn" :disable="loading" @click="cancelDialog" />
            <q-btn
              :label="t('loans.actions.save')"
              type="submit"
              :loading="loading"
              :disable="loading || !referencesLoaded"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { LoanRequest, LoanResponse } from '@/types/Loan';
import type { BookResponse } from '@/types/Book';
import type { UserResponse } from '@/types/User';

interface LoanFormData {
  userId: number | null;
  bookId: number | null;
  loanDate: string;
  returnDate: string;
  observations: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    mode?: 'create' | 'edit';
    initialData?: LoanResponse;
    users?: UserResponse[];
    books?: BookResponse[];
    referencesLoaded?: boolean;
    referencesLoading?: boolean;
    referencesError?: string;
    loading?: boolean;
    errorMessage?: string;
  }>(),
  {
    mode: 'create',
    users: () => [],
    books: () => [],
    referencesLoaded: false,
    referencesLoading: false,
    referencesError: '',
    loading: false,
    errorMessage: '',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [payload: LoanRequest];
  cancel: [];
}>();

const { t, locale } = useI18n();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const form = reactive<LoanFormData>(createEmptyForm());

watch(
  () => [props.modelValue, props.initialData] as const,
  ([isOpen]) => {
    if (isOpen) resetForm();
  },
);

function createEmptyForm(): LoanFormData {
  return { userId: null, bookId: null, loanDate: '', returnDate: '', observations: '' };
}

function resetForm() {
  Object.assign(form, createEmptyForm(), {
    userId: props.initialData?.userId ?? null,
    bookId: props.initialData?.bookId ?? null,
    loanDate: props.initialData?.loanDate ?? '',
    returnDate: props.initialData?.returnDate ?? '',
    observations: props.initialData?.observations ?? '',
  });
}

function cancelDialog() {
  dialog.value = false;
  emit('cancel');
}

function handleSave() {
  const { userId, bookId, loanDate, returnDate } = form;
  if (
    props.loading ||
    !props.referencesLoaded ||
    userId === null ||
    bookId === null ||
    !props.users.some((user) => user.id === userId) ||
    !props.books.some((book) => book.id === bookId) ||
    !loanDate ||
    !returnDate ||
    returnDate < loanDate
  ) {
    return;
  }

  emit('save', {
    userId,
    bookId,
    loanDate,
    returnDate,
    observations: form.observations.trim() || null,
  });
}
</script>

<style scoped>
.loan-form {
  width: 500px;
  max-width: 90vw;
  border-radius: 8px;
}

.loan-fields {
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

.loan-form :deep(.q-field--outlined .q-field__control:before),
.loan-form :deep(.q-field--outlined .q-field__control:hover:before),
.loan-form :deep(.q-field--outlined .q-field__control:after) {
  border-color: #1b3a5c;
}

.date-fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

@media (max-width: 700px) {
  .date-fields {
    grid-template-columns: 1fr;
  }
}
</style>
