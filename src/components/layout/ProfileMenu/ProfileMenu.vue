<template>
  <div class="profile-menu">
    <q-btn
      flat
      round
      class="profile-avatar">
      LF

      <q-menu>
        <q-list class="profile-list">
          <q-item 
           v-if="!isAdmin"
           clickable>
            <q-item-section>
              {{ t('profile.languageLabel') }}
            </q-item-section>
          </q-item>

          <q-item 
          clickable
          @click="showLanguageDialog = true">
            <q-item-section>
              {{ t('profile.languageLabel') }}
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item clickable>
            <q-item-section>
              {{ t('profile.logout') }}
            </q-item-section>
          </q-item>

          <q-item 
          v-if="!isAdmin"
          class="delete-account"
          clickable>
            <q-item-section>
              Encerrar conta
            </q-item-section>
          </q-item>

        </q-list>
      </q-menu>
    </q-btn>
    <LanguageDialog v-model="showLanguageDialog" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LanguageDialog from './LanguageDialog.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  isAdmin: boolean;
}>();

const showLanguageDialog = ref(false);

</script>

<style scoped>
.profile-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background-color: #1b3a5c;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
}

.profile-list {
  min-width: 180px;
  padding: 6px 0;
}

.profile-list .q-item {
  min-height: 40px;
  color: #1b3a5c;
  font-size: 14px;
}

.delete-account {
  color: #d32f2f;
}
</style>