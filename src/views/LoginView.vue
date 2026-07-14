<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Вход в ArtixBonus</h1>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="example@mail.ru"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Вход...' : 'Войти' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>

        <p class="register-link">
          Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  const result = await authStore.login(email.value, password.value);

  if (result.success) {
    router.push('/bonus');
  } else {
    error.value = result.message || 'Неверный email или пароль';
  }

  loading.value = false;
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #2c3e50;
}

input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dce1e8;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #42b883;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #3aa876;
}

.btn-primary:disabled {
  background: #a0c4b0;
  cursor: not-allowed;
}

.error-message {
  margin-top: 12px;
  color: #e74c3c;
  text-align: center;
}

.register-link {
  margin-top: 20px;
  text-align: center;
  color: #7f8c8d;
}

.register-link a {
  color: #42b883;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
