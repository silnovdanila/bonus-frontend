<template>
  <div id="app">
    <NavBar v-if="isLoggedIn" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
@import '@/assets/main.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  width: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
