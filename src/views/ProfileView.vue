<template>
  <div class="profile-page">
    <h1>Профиль</h1>

    <div class="card profile-card">
      <div class="input-group">
        <label>Email</label>
        <span class="profile-email">{{ user.email || '—' }}</span>
      </div>
      <div class="input-group">
        <label>ФИО</label>
        <input v-model="editData.fullName" placeholder="Введите ФИО" />
      </div>
      <div class="input-group">
        <label>Телефон</label>
        <input v-model="editData.phone" placeholder="Введите телефон" />
      </div>
      <div class="input-group">
        <label>Дата рождения</label>
        <input v-model="editData.birthDate" type="date" />
      </div>

      <button class="btn btn-primary" @click="updateProfile" :disabled="loading">
        {{ loading ? 'Сохранение...' : 'Сохранить' }}
      </button>
      <p v-if="updateMessage" class="success-message">{{ updateMessage }}</p>
      <p v-if="updateError" class="error-message">{{ updateError }}</p>
    </div>

    <div class="card profile-card">
      <h2>Смена пароля</h2>
      <div class="input-group">
        <label>Текущий пароль</label>
        <input v-model="passwordData.oldPassword" type="password" placeholder="Введите текущий пароль" />
      </div>
      <div class="input-group">
        <label>Новый пароль</label>
        <input v-model="passwordData.newPassword" type="password" placeholder="Введите новый пароль" />
      </div>
      <button class="btn btn-secondary" @click="changePassword" :disabled="loadingPassword">
        {{ loadingPassword ? 'Смена...' : 'Сменить пароль' }}
      </button>
      <p v-if="passwordMessage" class="success-message">{{ passwordMessage }}</p>
      <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
    </div>

    <div class="card profile-card danger">
      <h2>Удаление аккаунта</h2>
      <p class="warning">Это действие необратимо.</p>
      <div class="input-group">
        <label>Подтверждение паролем</label>
        <input v-model="deleteData.password" type="password" placeholder="Введите пароль" />
      </div>
      <div class="input-group">
        <label>
          <input v-model="deleteData.confirm" type="checkbox" />
          Я подтверждаю удаление
        </label>
      </div>
      <button class="btn btn-danger" @click="deleteAccount" :disabled="loadingDelete || !deleteData.confirm">
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
const passwordData = ref({ oldPassword: '', newPassword: '' });
const deleteData = ref({ password: '', confirm: false });

const loading = ref(false);
const loadingPassword = ref(false);
const loadingDelete = ref(false);
const updateMessage = ref('');
const updateError = ref('');
const passwordMessage = ref('');
const passwordError = ref('');
const deleteMessage = ref('');
const deleteError = ref('');

const loadProfile = async () => {
  try {
    const res = await api.get('/profile');
    user.value = res.data || {};
    editData.value = {
      fullName: res.data.fullName || '',
      phone: res.data.phone || '',
      birthDate: res.data.birthDate || '',
    };
  } catch (e) { console.error(e); }
};

const updateProfile = async () => {
  loading.value = true;
  updateMessage.value = '';
  updateError.value = '';
  try {
    const res = await api.put('/profile', editData.value);
    user.value = res.data;
    authStore.updateUser({ fullName: res.data.fullName });
    updateMessage.value = 'Профиль обновлён';
  } catch (e) { updateError.value = e.response?.data || 'Ошибка обновления'; }
  finally { loading.value = false; }
};

const changePassword = async () => {
  loadingPassword.value = true;
  passwordMessage.value = '';
  passwordError.value = '';
  try {
    await api.put('/profile/password', passwordData.value);
    passwordMessage.value = 'Пароль изменён';
    passwordData.value = { oldPassword: '', newPassword: '' };
  } catch (e) { passwordError.value = e.response?.data || 'Ошибка смены пароля'; }
  finally { loadingPassword.value = false; }
};

const deleteAccount = async () => {
  if (!confirm('Вы уверены?')) return;
  loadingDelete.value = true;
  deleteMessage.value = '';
  deleteError.value = '';
  try {
    await api.delete('/profile', { data: deleteData.value });
    deleteMessage.value = 'Аккаунт удалён';
    setTimeout(() => { authStore.logout(); router.push('/login'); }, 1500);
  } catch (e) { deleteError.value = e.response?.data || 'Ошибка удаления'; }
  finally { loadingDelete.value = false; }
};

onMounted(loadProfile);
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.profile-card.danger {
  border: 1px solid #e74c3c;
  background: #fdf2f2;
}
.profile-email {
  display: block;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #333;
}
.warning { color: #e67e22; margin-bottom: 16px; }

.btn { width: 100%; margin-top: 8px; }
.btn-primary { background: #42b883; color: white; }
.btn-primary:hover { background: #3aa876; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-secondary { background: #3498db; color: white; }
.btn-secondary:hover { background: #2980b9; }
.btn-danger { background: #e74c3c; color: white; }
.btn-danger:hover { background: #c0392b; }

.success-message { color: #27ae60; text-align: center; margin-top: 12px; }
.error-message { color: #e74c3c; text-align: center; margin-top: 12px; }
</style>
