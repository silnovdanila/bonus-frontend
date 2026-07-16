<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h1>Регистрация</h1>
      <p class="subtitle">Создайте аккаунт в ArtixBonus</p>

      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <label>ФИО</label>
          <input
            v-model="fullName"
            type="text"
            @blur="validateFullName"
            :class="{ 'invalid': fullNameError }"
          />
          <span v-if="fullNameError" class="error-message">{{ fullNameError }}</span>
        </div>

        <div class="input-group">
          <label>Email</label>
          <input
            v-model="email"
            type="email"
            @blur="validateEmail"
            :class="{ 'invalid': emailError }"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>

        <div class="input-group">
          <label>Телефон</label>
          <input v-model="phone" type="tel" />
        </div>

        <div class="input-group">
          <label>Дата рождения</label>
          <input v-model="birthDate" type="date" />
        </div>

        <div class="input-group">
          <label>Пароль</label>
          <input
            v-model="password"
            type="password"
            @blur="validatePassword"
            :class="{ 'invalid': passwordError }"
          />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <div class="input-group">
          <label>Подтверждение пароля</label>
          <input
            v-model="confirmPassword"
            type="password"
            @blur="validateConfirmPassword"
            :class="{ 'invalid': confirmPasswordError }"
          />
          <span v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</span>
        </div>

        <button class="btn btn-primary" type="submit" :disabled="loading || !isFormValid">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>

        <p class="link">Уже есть аккаунт? <router-link to="/login">Войти</router-link></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const fullName = ref('');
const email = ref('');
const phone = ref('');
const birthDate = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');

const emailError = ref('');
const passwordError = ref('');
const confirmPasswordError = ref('');

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.value = 'Email обязателен';
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Введите корректный email (пример: name@domain.com)';
  } else {
    emailError.value = '';
  }
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Пароль обязателен';
  } else if (password.value.length < 6) {
    passwordError.value = 'Пароль должен содержать минимум 6 символов';
  } else {
    passwordError.value = '';
  }
  if (confirmPassword.value) {
    validateConfirmPassword();
  }
};

const validateConfirmPassword = () => {
  if (!confirmPassword.value) {
    confirmPasswordError.value = 'Подтверждение пароля обязательно';
  } else if (password.value !== confirmPassword.value) {
    confirmPasswordError.value = 'Пароли не совпадают';
  } else {
    confirmPasswordError.value = '';
  }
};

const isFormValid = computed(() => {
  return (
    fullName.value && fullName.value.trim().length >= 2 &&
    email.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
    password.value && password.value.length >= 6 &&
    confirmPassword.value && password.value === confirmPassword.value &&
    !emailError.value &&
    !passwordError.value &&
    !confirmPasswordError.value
  );
});

const handleRegister = async () => {
  validateEmail();
  validatePassword();
  validateConfirmPassword();

  if (!isFormValid.value) return;

  loading.value = true;
  error.value = '';

  const result = await authStore.register(
    email.value,
    password.value,
    fullName.value,
    phone.value,
    birthDate.value
  );

  if (result.success) {
    router.push('/bonus');
  } else {
    error.value = result.message || 'Ошибка регистрации';
  }

  loading.value = false;
};
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.auth-card {
  max-width: 450px;
  width: 100%;
  padding: 40px;
}

.auth-card h1 { text-align: center; margin-bottom: 6px; }
.subtitle { text-align: center; color: #7f8c8d; margin-bottom: 25px; }

.input-group {
  margin-bottom: 16px;
}

.input-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
  color: #555;
  font-size: 14px;
}

.input-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dce1e8;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.input-group input:focus {
  outline: none;
  border-color: #42b883;
}

.input-group input.invalid {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  display: block;
  margin-top: 4px;
}

.btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px;
  font-size: 16px;
}
.btn-primary {
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary:hover {
  background: #3aa876;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link { text-align: center; margin-top: 20px; color: #7f8c8d; }
.link a { color: #42b883; text-decoration: none; }
.link a:hover { text-decoration: underline; }

.error-message { color: #e74c3c; text-align: center; margin-top: 12px; }

@media (max-width: 480px) {
  .auth-card { padding: 24px; }
}
</style>
