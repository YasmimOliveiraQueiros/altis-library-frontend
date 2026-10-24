<template>
  <q-dialog
    :model-value="modelValue"
    :persistent="loading"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <q-card class="confirm-delete-dialog">
      <q-card-section class="dialog-header">
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section class="dialog-message">
        {{ message }}<strong v-if="recordName">{{ recordName }}</strong>{{ recordName !== undefined ? '?' : '' }}
        <div v-if="errorMessage" class="dialog-error text-negative" role="alert">
          {{ errorMessage }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          :label="props.cancelLabel"
          :disable="loading"
          @click="emit('cancel')"
        />
        <q-btn
          unelevated
          color="negative"
          :label="props.confirmLabel"
          :loading="loading"
          :disable="loading"
          @click="emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: boolean;
  title: string;
  message: string;
  recordName?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  errorMessage?: string;
  loading?: boolean;
}>(), {
  cancelLabel: 'Cancelar',
  confirmLabel: 'Excluir',
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();
</script>

<style scoped>
.confirm-delete-dialog {
  width: 420px;
  max-width: 90vw;
  border-radius: 8px;
}

.dialog-header {
  color: #1b3a5c;
}

.dialog-message {
  color: #34454d;
}

.dialog-error {
  margin-top: 12px;
}
</style>
