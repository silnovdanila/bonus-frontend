<template>
  <div class="auth-page">
    <div class="card auth-card">
      <h1>Вход в ArtixBonus</h1>

      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="login">Email или телефон</label>
          <input
            id="login"
            v-model="login"
            type="text"
            placeholder="example@mail.ru или +79138888888"
            @blur="validateLogin"
            :class="{ 'invalid': loginError }"
          />
          <span v-if="loginError" class="error-message">{{ loginError }}</span>
        </div>

        <div class="input-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            @blur="validatePassword"
            :class="{ 'invalid': passwordError }"
          />
          <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
        </div>

        <button class="btn btn-primary" type="submit" :disabled="loading || !isFormValid">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>
        <p v-if="error" class="error-message">{{ error }}</p>

        <p class="link">Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link></p>
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

const login = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const loginError = ref('');
const passwordError = ref('');

const phoneRegex = /^(\+7|8|7)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;

const validateLogin = () => {
  if (!login.value) {
    loginError.value = 'Введите email или телефон';
    return;
  }

  const trimmed = login.value.trim();

  if (trimmed.length < 3) {
    loginError.value = 'Введите корректный email или телефон';
    return;
  }

  const isPhone = phoneRegex.test(trimmed.replace(/\s/g, ''));
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

  if (!isPhone && !isEmail) {
    loginError.value = 'Введите корректный email или телефон';
  } else {
    loginError.value = '';
  }
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'Пароль обязателен';
  } else if (password.value.length < 6) {
    passwordError.value = 'Пароль должен быть не менее 6 символов';
  } else {
    passwordError.value = '';
  }
};

const isFormValid = computed(() => {
  const trimmed = login.value?.trim() || '';
  const isPhone = phoneRegex.test(trimmed.replace(/\s/g, ''));
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

  return (
    trimmed.length >= 3 &&
    (isPhone || isEmail) &&
    password.value &&
    password.value.length >= 6 &&
    !loginError.value &&
    !passwordError.value
  );
});

const handleLogin = async () => {
  validateLogin();
  validatePassword();

  if (!isFormValid.value) return;

  loading.value = true;
  error.value = '';

  const result = await authStore.login(login.value.trim(), password.value);

  if (result.success) {
    router.push('/bonus');
  } else {
    error.value = result.message || 'Неверный логин или пароль';
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
  max-width: 400px;
  width: 100%;
  padding: 40px;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 30px;
}

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
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #42b883;
  color: white;
}

.btn-primary:hover {
  background: #3aa876;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link {
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
}

.link a {
  color: #42b883;
  text-decoration: none;
}

.link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 24px;
  }
}
</style>
