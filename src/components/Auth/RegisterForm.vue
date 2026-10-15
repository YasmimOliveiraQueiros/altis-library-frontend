<template>
  <section class="form-panel">
    <div class="form-content">
      <header class="form-header">
        <h2>Cadastrar nova conta</h2>
      </header>

      <q-form class="register-form" @submit.prevent="handleSubmit">
        <div class="form-field full-width">
          <label for="name">Nome completo</label>
          <q-input
            id="name"
            v-model="form.name"
            placeholder="Seu nome"
            outlined
            dense
            autocomplete="name"
            :rules="[value => !!value?.trim() || 'Informe seu nome']"
          />
        </div>

        <div class="form-row">
          <div class="form-field">
            <label for="birthDate">Data de nascimento</label>
            <q-input
              id="birthDate"
              v-model="form.birthDate"
              type="date"
              outlined
              dense
              :max="maxBirthDate"
              :rules="[
                value => !!value || 'Informe sua data de nascimento',
                value => !value || value < maxBirthDate || 'Informe uma data anterior a hoje'
              ]"
            />
          </div>

          <div class="form-field">
            <label for="cpf">CPF</label>
            <q-input
              id="cpf"
              v-model="form.cpf"
              placeholder="000.000.000-00"
              outlined
              dense
              autocomplete="off"
              :rules="[
                value => !!value?.trim() || 'Informe seu CPF',
                value => {
                  const cpf = String(value ?? '').replace(/\D/g, '');
                  return isValidCpf(cpf) || 'Digite um CPF válido';}
                  ]"
            />
          </div>
          
        </div>

        <div class="form-field full-width">
          <label for="phone">Telefone</label>
          <q-input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="(85) 99999-9999"
            outlined
            dense
            autocomplete="tel"
            :rules="[
              value => !!value?.trim() || 'Informe seu telefone',
              value => isValidPhone(String(value ?? '')) ||'Digite um telefone válido'
              ]"

          />
        </div>

        <div class="form-field full-width">
          <label for="address">Endereço completo</label>
          <q-input
            id="address"
            v-model="form.address"
            placeholder="Rua das Flores, 123, Centro"
            outlined
            dense
            autocomplete="street-address"
            :rules="[value => !!value?.trim() || 'Informe seu endereço']"
          />
        </div>
        <div class="form-field full-width">
          <label for="email">E-mail</label>
          <q-input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seuemail@email.com"
            outlined
            dense
            autocomplete="email"
            :rules="[
              value => !!value?.trim() || 'Informe seu e-mail',
              value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Informe um e-mail válido'
            ]"
          />
        </div>

        <div class="form-field full-width">
          <label for="password">Senha</label>
          <q-input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Digite sua senha"
            outlined
            dense
            autocomplete="new-password"
            :rules="[
              value => !!value || 'Informe sua senha',
              value => value.length >= 15 || 'A senha deve ter no mínimo 15 caracteres'
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
          <label for="confirmPassword">Confirmar senha</label>
          <q-input
            id="confirmPassword"
            v-model="form.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirme sua senha"
            outlined
            dense
            autocomplete="new-password"
            :rules="[
              value => !!value || 'Confirme sua senha',
              value => value === form.password || 'As senhas não coincidem'
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
            label="Cadastrar"
            type="submit"
            unelevated
            no-caps
          />

          <q-btn
            class="back-button"
            label="Voltar ao Login"
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
import { reactive, ref } from 'vue';

defineOptions({
  name: 'RegisterForm',
});

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