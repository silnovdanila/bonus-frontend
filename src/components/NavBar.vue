<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/bonus">ArtixBonus</router-link>
      </div>

      <button class="navbar-toggle" @click="isMenuOpen = !isMenuOpen">
        ☰
      </button>

      <div class="navbar-links" :class="{ 'navbar-links-open': isMenuOpen }">
        <router-link to="/bonus" @click="closeMenu">Бонусы</router-link>
        <router-link to="/purchases" @click="closeMenu">Покупки</router-link>
        <router-link to="/profile" @click="closeMenu">Профиль</router-link>
        <button @click="logout" class="logout-btn">Выйти</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const isMenuOpen = ref(false);

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.navbar {
  background: #2c3e50;
  color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
}

.navbar-brand a {
  color: white;
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
}

.navbar-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
}

.navbar-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.navbar-links a {
  color: #ecf0f1;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}

.navbar-links a:hover {
  background: #34495e;
}

.navbar-links a.router-link-active {
  background: #3a5a7a;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c0392b;
}

/* Адаптивность */
@media (max-width: 768px) {
  .navbar-toggle {
    display: block;
  }

  .navbar-links {
    display: none;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    padding: 12px 0;
  }

  .navbar-links-open {
    display: flex;
  }

  .navbar-container {
    flex-wrap: wrap;
  }

  .navbar-links a {
    width: 100%;
    text-align: center;
    padding: 10px;
  }

  .logout-btn {
    width: 100%;
    text-align: center;
    padding: 10px;
  }
}
</style>
