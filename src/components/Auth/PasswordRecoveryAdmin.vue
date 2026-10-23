<template>
  <section class="recovery-view recovery-admin-content">
    <header class="recovery-header">
      <h2>{{ t('auth.recovery.title') }}</h2>
    </header>

    <p class="recovery-admin-message">
      {{ t('auth.recovery.adminMessageFirst') }}<br />
      {{ t('auth.recovery.adminMessageSecond') }}
    </p>

    <p class="recovery-admin-guidance">
      {{ t('auth.recovery.adminGuidance') }}
    </p>

    <p class="recovery-admin-thanks">
      {{ t('auth.recovery.adminThanks') }}
    </p>

    <div class="recovery-actions">
      <q-btn
        class="recovery-button"
        :label="t('auth.actions.backToLogin')"
        to="/login"
        unelevated
        no-caps
      />
    </div>

    <footer class="recovery-admin-contact">
      <a href="tel:+5585999999999">(85) 99999-9999</a>
      {{ t('auth.recovery.or') }}
      <a href="mailto:altislab@gmail.com">altislab@gmail.com</a>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineOptions({
  name: 'PasswordRecoveryAdmin',
});
</script>

<style scoped>
.recovery-admin-content {
  text-align: center;
}

.recovery-admin-message {
  margin: 58px 0 30px;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
}

.recovery-admin-guidance {
  margin: 0 0 28px;
  font-size: 16px;
  line-height: 1.6;
}

.recovery-admin-thanks {
  margin: 0 0 28px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
}

.recovery-admin-content .recovery-actions {
  margin-top: 0;
}

.recovery-admin-content .recovery-button {
  width: 220px;
  min-height: 39px;
}

.recovery-admin-contact {
  margin-top: auto;
  padding-top: 48px;
  font-size: 16px;
}

.recovery-admin-contact a {
  color: #1d3b5c;
  text-decoration: none;
}

.recovery-admin-contact a:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  .recovery-admin-message {
    margin-top: 36px;
    font-size: 18px;
  }

  .recovery-admin-thanks {
    font-size: 18px;
  }

  .recovery-admin-content .recovery-actions {
    margin-top: 0;
  }

  .recovery-admin-contact {
    margin-top: 40px;
    padding-top: 0;
  }
}
</style>
