<template>
  <q-dialog v-model="dialog" :persistent="loading">
    <q-card class="publisher-form">
      <q-card-section class="form-header q-pt-lg q-px-lg q-pb-sm">
        <div class="text-h6">
          {{ mode === 'edit' ? 'Editar editora' : 'Nova Editora' }}
        </div>

        <q-btn flat round dense icon="close" :disable="loading" @click="closeDialog" />
      </q-card-section>

      <q-card-section class="q-px-lg q-pt-sm q-pb-lg">
        <q-form @submit.prevent="handleSave">
          <div class="publisher-fields">
            <q-input
              v-model="form.name"
              label="Nome da editora"
              placeholder="Nome da editora"
              outlined
              hide-bottom-space
              :rules="[(value) => !!String(value ?? '').trim() || 'Informe o nome da editora']"
            />

            <q-input
              v-model="form.email"
              label="E-mail"
              placeholder="E-mail"
              outlined
              hide-bottom-space
              :rules="[
                (value) => !!String(value ?? '').trim() || 'Informe o e-mail',
                (value) =>
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '')) ||
                  'Informe um e-mail válido',
              ]"
            />

            <q-input
              v-model="form.cnpj"
              label="CNPJ"
              placeholder="00.000.000/0000-00"
              outlined
              hide-bottom-space
              :rules="[(value) => !!String(value ?? '').trim() || 'Informe o CNPJ']"
            />

            <q-input
              v-model="form.city"
              label="Cidade"
              placeholder="Cidade - UF"
              outlined
              hide-bottom-space
              :rules="[
                (value) => !!String(value ?? '').trim() || 'Informe a cidade e a UF',
                (value) =>
                  /^.+\s*-\s*[A-Za-z]{2}$/.test(String(value ?? '').trim()) ||
                  'Informe no formato Cidade - UF',
              ]"
            />

            <q-input
              v-model="form.copies"
              label="Livros cadastrados"
              type="number"
              outlined
              hide-bottom-space
              readonly
            />

            <q-select
              v-model="form.status"
              label="Status"
              :options="publisherStatusOptions"
              outlined
              hide-bottom-space
              class="filter-select"
              popup-content-class="filter-select-menu"
              :disable="loading || mode === 'edit'"
            />
          </div>

          <div v-if="errorMessage" class="form-error text-negative" role="alert">
            {{ errorMessage }}
          </div>

          <div class="form-actions">
            <q-btn
              label="Cancelar"
              flat
              class="cancel-btn"
              :disable="loading"
              @click="cancelDialog"
            />

            <q-btn label="Salvar" type="submit" :loading="loading" :disable="loading" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

interface PublisherFormData {
  name: string;
  email: string;
  cnpj: string;
  city: string;
  copies: number | null;
  status: 'Ativa' | 'Inativa';
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
      status: 'Ativa',
    }),
  },
);

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
const publisherStatusOptions = ['Ativa', 'Inativa'];

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
