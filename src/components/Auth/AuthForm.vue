```vue
<template>
  <section class="form-panel">
    <div class="form-content">
      <header class="form-header">
        <h2>{{ t('auth.login.title') }}</h2>
        <p>{{ t('auth.login.subtitle') }}</p>
      </header>

      <div class="user-icon">
        <q-icon name="person" size="76px" />
      </div>

      <q-form class="login-form" @submit.prevent="handleSubmit">
        <div class="form-field">
          <label for="email">{{ t('auth.fields.email') }}</label>

          <q-input
            id="email"
            v-model="email"
            type="email"
            :placeholder="t('auth.fields.emailPlaceholder')"
            outlined
            dense
            autocomplete="email"
            lazy-rules
            :rules="[
              (value) => !!value || t('auth.validation.emailRequired'),
              (value) =>
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                t('auth.validation.emailInvalid'),
            ]"
          />
        </div>

        <div class="form-field">
          <label for="password">{{ t('auth.fields.password') }}</label>

          <q-input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('auth.fields.passwordPlaceholder')"
            outlined
            dense
            autocomplete="current-password"
            lazy-rules
            :rules="[(value) => !!value || t('auth.validation.passwordRequired')]">
            
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>

        <q-btn
          class="login-button"
          :label="t('auth.login.submit')"
          type="submit"
          unelevated
          no-caps
          :loading="loading"
          :disable="loading"
        />
        
        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>

      </q-form>

      <footer class="form-footer">
        <router-link to="/recuperar-senha">
          {{ t('auth.login.recoverPassword') }}
        </router-link>

        <router-link to="/cadastro">
          {{ t('auth.login.register') }}
        </router-link>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';


const { t } = useI18n();

defineProps<{
  loading?: boolean;
  errorMessage?: string;
}>();

const emit = defineEmits<{
  submit: [credentials: { email: string; password: string }];
}>();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

function handleSubmit() {
  emit('submit', {
    email: email.value,
    password: password.value,
  });
}
</script>

<style scoped>
.form-panel {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  padding: 32px 24px;
  background-color: #ffffff;
  color: #111111;
}

.form-content {
  width: 100%;
  max-width: 350px;
}

.form-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.form-header p {
  margin: 0;
  font-size: 16px;
}

.user-icon {
  display: flex;
  justify-content: center;
  margin: 34px 0 24px;
  color: #1d3b5c;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field label {
  display: block;
  margin-bottom: 6px;
  color: #1d3b5c;
  font-size: 14px;
}

.form-field :deep(.q-field__control) {
  border-radius: 6px;
}

.login-button {
  width: 100%;
  min-height: 40px;
  margin-top: 12px;
  border-radius: 6px;
  background-color: #1d3b5c;
  color: #ffffff;
}

.form-footer {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px 12px;
  margin-top: 140px;
}

.form-footer a {
  color: #1d3b5c;
  font-size: 14px;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 700px) {
  .form-panel {
    flex: 1;
    padding: 28px 24px;
  }

  .form-header h2 {
    font-size: 22px;
  }

  .user-icon {
    margin: 24px 0;
  }

  .form-footer {
    margin-top: 48px;
  }
}

.error-message {
  margin: 8px 0 0;
  color: #c62828;
  font-size: 14px;
}
</style>
