<template>
  <div id="app">
    <NavBar v-if="isLoggedIn" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import NavBar from '@/components/NavBar.vue';

const isLoggedIn = ref(false);

const checkAuth = () => {
  isLoggedIn.value = !!localStorage.getItem('accessToken');
};

onMounted(() => {
  checkAuth();
  window.addEventListener('storage', checkAuth);
});

const router = useRouter();
router.afterEach(checkAuth);

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f5f7fa;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
}

@media (max-width: 600px) {
  .main-content {
    padding: 12px;
  }
}
</style>
