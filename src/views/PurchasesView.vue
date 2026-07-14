<template>
  <div class="purchases-page">
    <h1>История покупок</h1>

    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="purchases.length === 0" class="empty">Нет покупок</div>

    <div v-else>
      <div
        v-for="p in purchases"
        :key="p.id"
        class="purchase-card"
        @click="togglePurchase(p.id)"
      >
        <div class="purchase-header">
          <span class="store">{{ p.storeName }}</span>
          <span class="date">{{ formatDate(p.date) }}</span>
        </div>

        <div class="purchase-details">
          <span>Сумма: {{ p.totalSum }} ₽</span>
          <span v-if="p.bonusEarned > 0" class="earn">+{{ p.bonusEarned }} бон.</span>
          <span v-if="p.bonusBurned > 0" class="burn">-{{ p.bonusBurned }} бон.</span>
          <span class="expand-icon">{{ expandedPurchases.includes(p.id) ? '▲' : '▼' }}</span>
        </div>
        <div v-if="expandedPurchases.includes(p.id)" class="purchase-items">
          <div v-if="loadingItems[p.id]" class="loading-items">Загрузка позиций...</div>
          <div v-else-if="p.items && p.items.length > 0">
            <div class="items-header">
              <span>Товар</span>
              <span>Цена</span>
              <span>Кол-во</span>
              <span>Сумма</span>
            </div>
            <div
              v-for="item in p.items"
              :key="item.productName"
              class="item"
            >
              <span class="item-name">{{ item.productName }}</span>
              <span class="item-price">{{ item.price }} ₽</span>
              <span class="item-quantity">{{ item.quantity }}</span>
              <span class="item-sum">{{ item.sum }} ₽</span>
            </div>
          </div>
          <div v-else class="no-items">Нет позиций</div>
        </div>
      </div>
      <div class="pagination" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="page === 0">←</button>
        <span>{{ page + 1 }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="page >= totalPages - 1">→</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const purchases = ref([]);
const loading = ref(false);
const page = ref(0);
const size = ref(5);
const totalPages = ref(0);
const expandedPurchases = ref([]);
const loadingItems = ref({});

const loadPurchases = async () => {
  loading.value = true;
  try {
    const response = await api.get('/purchases', {
      params: { page: page.value, size: size.value }
    });
    purchases.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Ошибка загрузки покупок:', error);
  } finally {
    loading.value = false;
  }
};

const togglePurchase = async (id) => {
  const index = expandedPurchases.value.indexOf(id);

  if (index === -1) {
    expandedPurchases.value.push(id);
    const purchase = purchases.value.find(p => p.id === id);
    if (purchase && !purchase.items) {
      await loadItems(id);
    }
  } else {
    expandedPurchases.value.splice(index, 1);
  }
};

const loadItems = async (purchaseId) => {
  loadingItems.value[purchaseId] = true;
  try {
    const response = await api.get(`/purchases/${purchaseId}`);
    const purchase = purchases.value.find(p => p.id === purchaseId);
    if (purchase) {
      purchase.items = response.data.items || [];
    }
  } catch (error) {
    console.error('Ошибка загрузки позиций:', error);
  } finally {
    loadingItems.value[purchaseId] = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadPurchases();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) {
    page.value++;
    loadPurchases();
  }
};

onMounted(loadPurchases);
</script>

<style scoped>
.purchases-page {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 24px;
  color: #2c3e50;
}

.loading, .empty {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

.purchase-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.purchase-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.purchase-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.store {
  font-weight: bold;
  font-size: 16px;
}

.date {
  color: #95a5a6;
  font-size: 14px;
}

.purchase-details {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #555;
  align-items: center;
}

.earn {
  color: #27ae60;
  font-weight: 600;
}

.burn {
  color: #e74c3c;
  font-weight: 600;
}

.expand-icon {
  margin-left: auto;
  font-size: 12px;
  color: #95a5a6;
}

.purchase-items {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #ecf0f1;
}

.items-header {
  display: grid;
  grid-template-columns: 1fr 80px 60px 80px;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #7f8c8d;
  padding: 4px 0;
  border-bottom: 1px solid #ecf0f1;
  margin-bottom: 8px;
}

.item {
  display: grid;
  grid-template-columns: 1fr 80px 60px 80px;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
  color: #2c3e50;
}

.item-name {
  font-weight: 500;
}

.item-price, .item-quantity, .item-sum {
  text-align: right;
}

.loading-items, .no-items {
  padding: 12px;
  text-align: center;
  color: #95a5a6;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination button {
  padding: 6px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #3aa876;
}

.pagination button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.pagination span {
  font-size: 14px;
  color: #2c3e50;
}

@media (max-width: 600px) {
  .purchase-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .purchase-details {
    flex-wrap: wrap;
    gap: 8px;
  }

  .items-header, .item {
    grid-template-columns: 1fr 50px 40px 50px;
    font-size: 12px;
    gap: 4px;
  }

  .purchase-card {
    padding: 12px;
  }
}
</style>
