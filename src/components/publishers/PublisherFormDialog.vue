<template>
  <q-dialog v-model="dialog" :persistent="loading">
    <q-card class="publisher-form">
      <q-card-section class="form-header q-pt-lg q-px-lg q-pb-sm">
        <div class="text-h6">
          {{ mode === 'edit' ? t('publishers.form.editTitle') : t('publishers.form.newTitle') }}
        </div>

        <q-btn flat round dense icon="close" :disable="loading" @click="closeDialog" />
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-sm q-pb-lg">
        <q-form @submit.prevent="handleSave">
          <div class="publisher-fields">
            <q-input
              v-model="form.name"
              :label="t('publishers.form.name')"
              :placeholder="t('publishers.form.namePlaceholder')"
              outlined
              hide-bottom-space
              :rules="[(value) => !!String(value ?? '').trim() || t('publishers.validation.nameRequired')]"
            />

            <q-input
              v-model="form.email"
              :label="t('publishers.form.email')"
              :placeholder="t('publishers.form.emailPlaceholder')"
              outlined
              hide-bottom-space
              :rules="[
                (value) => !!String(value ?? '').trim() || t('publishers.validation.emailRequired'),
                (value) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '')) ||
                  t('publishers.validation.emailInvalid'),
              ]"
            />

            <q-input
              v-model="form.cnpj"
              :label="t('publishers.form.cnpj')"
              :placeholder="t('publishers.form.cnpjPlaceholder')"
              outlined
              hide-bottom-space
              :rules="[(value) => !!String(value ?? '').trim() || t('publishers.validation.cnpjRequired')]"
            />

            <q-input
              v-model="form.city"
              :label="t('publishers.form.cityState')"
              :placeholder="t('publishers.form.cityStatePlaceholder')"
              outlined
              hide-bottom-space
              :rules="[
                (value) => !!String(value ?? '').trim() || t('publishers.validation.cityStateRequired'),
                (value) =>
                  /^.+\s*-\s*[A-Za-z]{2}$/.test(String(value ?? '').trim()) ||
                  t('publishers.validation.cityStateFormat'),
              ]"
            />

            <q-input
              v-model="form.copies"
              :label="t('publishers.form.books')"
              type="number"
              outlined
              hide-bottom-space
              readonly
            />
          </div>

          <div v-if="errorMessage" class="form-error text-negative" role="alert">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <q-btn
              :label="t('publishers.actions.cancel')"
              flat
              class="cancel-btn"
              :disable="loading"
              @click="cancelDialog"
            />

            <q-btn :label="t('publishers.actions.save')" type="submit" :loading="loading" :disable="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

interface PublisherFormData {
  name: string;
  email: string;
  cnpj: string;
  city: string;
  copies: number | null;
}

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    mode?: 'create' | 'edit';
    initialData?: PublisherFormData;
    loading?: boolean;
    errorMessage?: string;
  }>(),
  {
    mode: 'create',
    loading: false,
    errorMessage: '',
    initialData: () => ({
      name: '',
      email: '',
      cnpj: '',
      city: '',
      copies: 0,
    }),
  },
);

const { t } = useI18n();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: PublisherFormData];
  cancel: [];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const form = reactive<PublisherFormData>({ ...props.initialData });

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      Object.assign(form, props.initialData);
    }
  },
);

function closeDialog() {
  dialog.value = false;
}

function cancelDialog() {
  closeDialog();
  emit('cancel');
}

function handleSave() {
  if (props.loading) return;

  emit('save', { ...form });
}
</script>

<style scoped>
.publisher-form {
  width: 500px;
  max-width: 90vw;
  border-radius: 8px;
}

.publisher-fields {
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

.publisher-form :deep(.q-field--outlined .q-field__control:before),
.publisher-form :deep(.q-field--outlined .q-field__control:hover:before),
.publisher-form :deep(.q-field--outlined .q-field__control:after) {
  border-color: #1b3a5c;
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

.form-error {
  margin-top: 12px;
}
</style>
