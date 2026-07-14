<template>
  <div class="profile-page">
    <h1>Профиль</h1>
    <div class="profile-card">
      <div class="profile-field">
        <label>Email</label>
        <span>{{ user.email || '—' }}</span>
      </div>
      <div class="profile-field">
        <label>ФИО</label>
        <input v-model="editData.fullName" placeholder="Введите ФИО" />
      </div>
      <div class="profile-field">
        <label>Телефон</label>
        <input v-model="editData.phone" placeholder="Введите телефон" />
      </div>
      <div class="profile-field">
        <label>Дата рождения</label>
        <input v-model="editData.birthDate" type="date" />
      </div>

      <button @click="updateProfile" class="btn-primary" :disabled="loading">
        {{ loading ? 'Сохранение...' : 'Сохранить изменения' }}
      </button>
      <p v-if="updateMessage" class="success-message">{{ updateMessage }}</p>
      <p v-if="updateError" class="error-message">{{ updateError }}</p>
    </div>
    <div class="profile-card">
      <h2>Смена пароля</h2>
      <div class="profile-field">
        <label>Текущий пароль</label>
        <input v-model="passwordData.oldPassword" type="password" placeholder="Введите текущий пароль" />
      </div>
      <div class="profile-field">
        <label>Новый пароль</label>
        <input v-model="passwordData.newPassword" type="password" placeholder="Введите новый пароль" />
      </div>

      <button @click="changePassword" class="btn-secondary" :disabled="loadingPassword">
        {{ loadingPassword ? 'Смена...' : 'Сменить пароль' }}
      </button>
      <p v-if="passwordMessage" class="success-message">{{ passwordMessage }}</p>
      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
    </div>

    <div class="profile-card danger">
      <h2>Удаление аккаунта</h2>
      <p class="warning">Это действие необратимо. Все данные будут потеряны.</p>
      <div class="profile-field">
        <label>Подтверждение паролем</label>
        <input v-model="deleteData.password" type="password" placeholder="Введите пароль" />
      </div>
      <div class="profile-field">
        <label>
          <input v-model="deleteData.confirm" type="checkbox" />
          Я подтверждаю удаление
        </label>
      </div>

      <button @click="deleteAccount" class="btn-danger" :disabled="loadingDelete || !deleteData.confirm">
        {{ loadingDelete ? 'Удаление...' : 'Удалить аккаунт' }}
      </button>
      <p v-if="deleteMessage" class="success-message">{{ deleteMessage }}</p>
      <p v-if="deleteError" class="error-message">{{ deleteError }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import api from '@/api';

const router = useRouter();
const authStore = useAuthStore();

const user = ref({ email: '', fullName: '', phone: '', birthDate: '' });
const editData = ref({ fullName: '', phone: '', birthDate: '' });

const loading = ref(false);
const loadingPassword = ref(false);
const loadingDelete = ref(false);
const updateMessage = ref('');
const updateError = ref('');
const passwordMessage = ref('');
const passwordError = ref('');
const deleteMessage = ref('');
const deleteError = ref('');

const passwordData = ref({ oldPassword: '', newPassword: '' });

const deleteData = ref({ password: '', confirm: false });

const loadProfile = async () => {
  try {
    const response = await api.get('/profile');
    console.log('Профиль загружен:', response.data);

    user.value = response.data || {};
    editData.value = {
      fullName: response.data.fullName || '',
      phone: response.data.phone || '',
      birthDate: response.data.birthDate || '',
    };
  } catch (error) {
    console.error('Ошибка загрузки профиля:', error);
    updateError.value = 'Ошибка загрузки профиля';
  }
};

const updateProfile = async () => {
  loading.value = true;
  updateMessage.value = '';
  updateError.value = '';

  try {
    const response = await api.put('/profile', editData.value);
    user.value = response.data;
    authStore.updateUser({ fullName: response.data.fullName });
    updateMessage.value = 'Профиль успешно обновлён';
  } catch (error) {
    updateError.value = error.response?.data || 'Ошибка обновления профиля';
  }

  loading.value = false;
};

const changePassword = async () => {
  loadingPassword.value = true;
  passwordMessage.value = '';
  passwordError.value = '';

  try {
    await api.put('/profile/password', passwordData.value);
    passwordMessage.value = 'Пароль успешно изменён';
    passwordData.value = { oldPassword: '', newPassword: '' };
  } catch (error) {
    passwordError.value = error.response?.data || 'Ошибка смены пароля';
  }

  loadingPassword.value = false;
};

const deleteAccount = async () => {
  if (!confirm('Вы уверены, что хотите удалить аккаунт?')) return;

  loadingDelete.value = true;
  deleteMessage.value = '';
  deleteError.value = '';

  try {
    await api.delete('/profile', { data: deleteData.value });
    deleteMessage.value = 'Аккаунт удалён. Перенаправление...';
    setTimeout(() => {
      authStore.logout();
      router.push('/login');
    }, 2000);
  } catch (error) {
    deleteError.value = error.response?.data || 'Ошибка удаления аккаунта';
  }

  loadingDelete.value = false;
};

onMounted(() => {
  loadProfile();
});
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 24px;
  color: #2c3e50;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.profile-card h2 {
  margin-bottom: 16px;
  font-size: 18px;
  color: #2c3e50;
}

.profile-card.danger {
  border: 1px solid #e74c3c;
  background: #fdf2f2;
}

.profile-field {
  margin-bottom: 16px;
}

.profile-field label {
  display: block;
  font-weight: 500;
  margin-bottom: 4px;
  color: #555;
}

.profile-field span {
  display: block;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #333;
}

.profile-field input[type="text"],
.profile-field input[type="password"],
.profile-field input[type="date"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dce1e8;
  border-radius: 6px;
  font-size: 16px;
}

.profile-field input:focus {
  outline: none;
  border-color: #42b883;
}

.profile-field input[type="checkbox"] {
  width: auto;
  margin-right: 8px;
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.btn-primary {
  background: #42b883;
  color: white;
}

.btn-primary:hover {
  background: #3aa876;
}

.btn-primary:disabled {
  background: #a0c4b0;
  cursor: not-allowed;
}

.btn-secondary {
  background: #3498db;
  color: white;
}

.btn-secondary:hover {
  background: #2980b9;
}

.btn-secondary:disabled {
  background: #8bb9d6;
  cursor: not-allowed;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-danger:disabled {
  background: #e8a098;
  cursor: not-allowed;
}

.success-message {
  margin-top: 12px;
  color: #27ae60;
  text-align: center;
}

.error-message {
  margin-top: 12px;
  color: #e74c3c;
  text-align: center;
}

.warning {
  color: #e67e22;
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .profile-card {
    padding: 16px;
  }
}
</style>
