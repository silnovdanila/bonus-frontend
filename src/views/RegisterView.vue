<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Регистрация</h1>
      <p class="subtitle">Создайте аккаунт в ArtixBonus</p>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="fullName">ФИО</label>
          <input id="fullName" v-model="fullName" type="text" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>

        <div class="form-group">
          <label for="phone">Телефон</label>
          <input id="phone" v-model="phone" type="tel" />
        </div>

        <div class="form-group">
          <label for="birthDate">Дата рождения</label>
          <input id="birthDate" v-model="birthDate" type="date" />
        </div>

        <div class="form-group">
          <label for="password">Пароль</label>
          <input id="password" v-model="password" type="password" required />
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <p v-if="error" class="error-message">{{ error }}</p>

        <p class="login-link">
          Уже есть аккаунт? <router-link to="/login">Войти</router-link>
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

const fullName = ref('');
const email = ref('');
const phone = ref('');
const birthDate = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
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
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f7fa;
}

.register-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

h1 {
  text-align: center;
  margin-bottom: 6px;
  color: #2c3e50;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 16px;
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
  margin-top: 10px;
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

.login-link {
  margin-top: 20px;
  text-align: center;
  color: #7f8c8d;
}

.login-link a {
  color: #42b883;
  text-decoration: none;
}
</style>
