<template>
  <section class="form-panel">
    <div class="form-content">
      <header class="form-header">
        <h2>{{ t('auth.register.title') }}</h2>
      </header>

      <q-form class="register-form" @submit.prevent="handleSubmit">
        <div class="form-field full-width">
          <label for="name">{{ t('auth.fields.fullName') }}</label>
          <q-input
            id="name"
            v-model="form.name"
            :placeholder="t('auth.fields.namePlaceholder')"
            outlined
            dense
            autocomplete="name"
            :rules="[value => !!value?.trim() || t('auth.validation.nameRequired')]"
          />
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="birthDate">{{ t('auth.fields.birthDate') }}</label>
            <q-input
              id="birthDate"
              class="birth-date-input"
              :model-value="formattedBirthDate"
              readonly
              outlined
              dense
              :rules="[
                () => !!form.birthDate || t('auth.validation.birthDateRequired'),
                () => !form.birthDate || form.birthDate < maxBirthDate || t('auth.validation.birthDatePast')
              ]"
            >
              <template #append>
                <q-btn
                  flat
                  round
                  dense
                  icon="event"
                  :aria-label="t('auth.fields.birthDate')"
                >
                  <q-popup-proxy ref="birthDatePopup" cover transition-show="scale" transition-hide="scale">
                    <q-date
                      class="birth-date-calendar"
                      v-model="form.birthDate"
                      mask="YYYY-MM-DD"
                      :locale="datePickerLocale"
                      :default-year-month="defaultBirthDateMonth"
                      :first-day-of-week="locale === 'en-US' ? 0 : 1"
                      :options="isBirthDateSelectable"
                      @update:model-value="closeBirthDatePicker"
                    />
                  </q-popup-proxy>
                </q-btn>
              </template>
            </q-input>
          </div>

          <div class="form-field">
            <label for="cpf">{{ t('auth.fields.cpf') }}</label>
            <q-input
              id="cpf"
              v-model="form.cpf"
              :placeholder="t('auth.fields.cpfPlaceholder')"
              outlined
              dense
              autocomplete="off"
              :rules="[
              value => !!value?.trim() || t('auth.validation.cpfRequired'),
                value => {
                  const cpf = String(value ?? '').replace(/\D/g, '');
                  return isValidCpf(cpf) || t('auth.validation.cpfInvalid');}
                  ]"
            />
          </div>
          
        </div>

        <div class="form-field full-width">
          <label for="phone">{{ t('auth.fields.phone') }}</label>
          <q-input
            id="phone"
            v-model="form.phone"
            type="tel"
            :placeholder="t('auth.fields.phonePlaceholder')"
            outlined
            dense
            autocomplete="tel"
            :rules="[
              value => !!value?.trim() || t('auth.validation.phoneRequired'),
              value => isValidPhone(String(value ?? '')) || t('auth.validation.phoneInvalid')
              ]"

          />
        </div>

        <div class="form-field full-width">
          <label for="address">{{ t('auth.fields.address') }}</label>
          <q-input
            id="address"
            v-model="form.address"
            :placeholder="t('auth.fields.addressPlaceholder')"
            outlined
            dense
            autocomplete="street-address"
            :rules="[value => !!value?.trim() || t('auth.validation.addressRequired')]"
          />
        </div>
        <div class="form-field full-width">
          <label for="email">{{ t('auth.fields.email') }}</label>
          <q-input
            id="email"
            v-model="form.email"
            type="email"
            :placeholder="t('auth.fields.emailPlaceholder')"
            outlined
            dense
            autocomplete="email"
            :rules="[
              value => !!value?.trim() || t('auth.validation.emailRequired'),
              value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || t('auth.validation.emailInvalid')
            ]"
          />
        </div>

        <div class="form-field full-width">
          <label for="password">{{ t('auth.fields.password') }}</label>
          <q-input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            :placeholder="t('auth.fields.passwordPlaceholder')"
            outlined
            dense
            autocomplete="new-password"
            :rules="[
              value => !!value || t('auth.validation.passwordRequired'),
              value => value.length >= 15 || t('auth.validation.passwordMin')
            ]"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
        </div>

        <div class="form-field full-width">
          <label for="confirmPassword">{{ t('auth.fields.confirmPassword') }}</label>
          <q-input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="t('auth.fields.confirmPasswordPlaceholder')"
            outlined
            dense
            autocomplete="new-password"
            :rules="[
              value => !!value || t('auth.validation.confirmPasswordRequired'),
              value => value === form.password || t('auth.validation.passwordMismatch')
            ]"
          >
            <template #append>
              <q-icon
                :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </q-input>
        </div>
        
        <div class="form-actions">
          <q-btn
            class="register-button"
            :label="t('auth.register.submit')"
            type="submit"
            unelevated
            no-caps
          />

          <q-btn
            class="back-button"
            :label="t('auth.actions.backToLogin')"
            to="/login"
            unelevated
            no-caps
          />
        </div>

      </q-form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'RegisterForm',
});

const { t, locale } = useI18n();
const birthDatePopup = ref<{ hide: () => void } | null>(null);

const emit = defineEmits<{
  submit: [form: {
    name: string;
    email: string;
    password: string;
    phone: string;
    cpf: string;
    birthDate: string;
    address: string;
    confirmPassword: string;
  }];
}>();

const form = reactive({
  name: '',
  birthDate: '',
  cpf: '',
  phone: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const maxBirthDate = new Date().toISOString().slice(0, 10);
const defaultBirthDateMonth = maxBirthDate.slice(0, 7).replace('-', '/');
const formattedBirthDate = computed(() => {
  if (!form.birthDate) return '';

  const [year = 0, month = 0, day = 0] = form.birthDate.split('-').map(Number);
  if (!year || !month || !day) return '';

  return new Intl.DateTimeFormat(locale.value, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
});
const datePickerLocale = computed(() => {
  const dateFormatter = (options: Intl.DateTimeFormatOptions, date: Date) =>
    new Intl.DateTimeFormat(locale.value, { ...options, timeZone: 'UTC' }).format(date);

  return {
    firstDayOfWeek: locale.value === 'en-US' ? 0 : 1,
    days: Array.from({ length: 7 }, (_, index) =>
      dateFormatter({ weekday: 'long' }, new Date(Date.UTC(2024, 0, index + 7))),
    ),
    daysShort: Array.from({ length: 7 }, (_, index) =>
      dateFormatter({ weekday: 'short' }, new Date(Date.UTC(2024, 0, index + 7))),
    ),
    months: Array.from({ length: 12 }, (_, month) =>
      dateFormatter({ month: 'long' }, new Date(Date.UTC(2024, month, 1))),
    ),
    monthsShort: Array.from({ length: 12 }, (_, month) =>
      dateFormatter({ month: 'short' }, new Date(Date.UTC(2024, month, 1))),
    ),
  };
});

function isBirthDateSelectable(date: string): boolean {
  const [year = 0, month = 0, day = 0] = date.split(/[/-]/).map(Number);
  const [maxYear = 0, maxMonth = 0, maxDay = 0] = maxBirthDate.split('-').map(Number);

  return (
    year > 0 &&
    month > 0 &&
    day > 0 &&
    (year < maxYear ||
      (year === maxYear && month < maxMonth) ||
      (year === maxYear && month === maxMonth && day <= maxDay))
  );
}

function closeBirthDatePicker() {
  birthDatePopup.value?.hide();
}

const isValidCpf = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, '');

  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  const calculateDigit = (length: number): number => {
    let sum = 0;

    for (let i = 0; i < length; i++) {
      sum += Number(digits[i]) * (length + 1 - i);
    }

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(9) === Number(digits[9]) &&
    calculateDigit(10) === Number(digits[10])
  );
};


const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');

  if (digits.length !== 10 && digits.length !== 11) {
    return false;
  }

  const ddd = Number(digits.slice(0, 2));

  if (ddd < 11 || ddd > 99) {
    return false;
  }

  const number = digits.slice(2);
  const firstDigit = number.charAt(0);
  
  if (digits.length === 11) {
    return firstDigit === '9';
  }
  
  return firstDigit >= '2' && firstDigit <= '5';
};


function handleSubmit() {
  emit('submit', { ...form });
}
</script>

<style scoped>
.form-panel {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  min-width: 0;
  min-height: 100vh;
  padding: 20px 28px;
  box-sizing: border-box;
  background-color: #ffffff;
  color: #111111;
}

.form-content {
  width: 100%;
  max-width: 550px;
}

.form-header h2 {
  margin: 0 0 12px;
  color: #1d3b5c;
  font-size: 18px;
  font-weight: 400;
  text-align: center;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.form-field {
  flex: 1;
  min-width: 0;
  line-height: 13px;
}

.form-field label {
  display: block;
  margin-bottom: 3px;
  color: #1d3b5c;
  font-size: 13px;
  line-height: 16px;
}

.form-field :deep(.q-field) {
  width: 100%;
}

.form-field :deep(.q-field__control) {
  min-height: 30px;
  height: 30px;
  border-radius: 6px;
}

.form-field :deep(.birth-date-input.q-field--readonly.q-field--outlined .q-field__control:before) {
  border-style: solid;
}

:global(.birth-date-calendar) {
  color: #1b3a5c;
}

.form-field :deep(.q-field__native),
.form-field :deep(.q-field__input) {
  font-size: 13px;
}

.form-field :deep(.q-field__marginal) {
  height: 30px;
}

.form-row {
  display: flex;
  gap: 10px;
}

.full-width {
  width: 100%;
}

.address-row {
  gap: 8px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 5px;
}

.register-button,
.back-button {
  flex: 1;
  max-width: 220px;
  min-height: 36px;
  border-radius: 6px;
  background-color: #1d3b5c;
  color: #ffffff;
}

@media (max-width: 380px) {
  .form-actions {
    gap: 8px;
  }

  .register-button,
  .back-button {
    font-size: 12px;
  }
}

@media (max-width: 700px) {
  .form-panel {
    min-height: auto;
    padding: 20px 28px;
  }

  .form-header h2 {
    margin-bottom: 36px;
  }
}

@media (max-width: 380px) {
  .form-panel {
    padding-right: 16px;
    padding-left: 16px;
  }

  .form-row {
    gap: 6px;
  }

  .form-field label {
    font-size: 12px;
  }
}
</style>
