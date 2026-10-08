<template>
    <q-dialog v-model="dialog">
        <q-card class="language-dialog">
            <q-card-section>
                <div class="text-h6">Idioma</div>
            </q-card-section>

            <q-card-section>
                <q-list>
                    <q-item 
                    clickable 
                    @click="changeLanguage('pt-BR')">
                        <q-item-section>
                            {{ t('profile.language.portuguese') }}
                        </q-item-section>
                    </q-item>

                    <q-item 
                    clickable 
                    @click="changeLanguage('en-US')">
                        <q-item-section>
                            {{ t('profile.language.english') }}
                        </q-item-section>
                    </q-item>

                    <q-item 
                    clickable 
                    @click="changeLanguage('es-ES')">
                        <q-item-section>
                            {{ t('profile.language.spanish') }}
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale, t } = useI18n();

const changeLanguage = (lang: string) => {
    locale.value = lang;
    emit('update:modelValue', false);
};

const props = defineProps<{
    modelValue: boolean;
    }>();


const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<style scoped>
.language-dialog {
    width: 350px;
    max-width: 90vw;
    color: #1b3a5c;
}</style>