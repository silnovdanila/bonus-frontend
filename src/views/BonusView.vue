<template>
  <div class="bonus-page">
    <h1>Бонусный баланс</h1>

    <!-- Баланс -->
    <div class="balance-card" v-if="balance !== null">
      <div class="balance-amount">{{ balance }} бонусов</div>
      <div class="balance-rub">≈ {{ balanceRub }} ₽</div>
      <div class="balance-updated">Обновлено: {{ lastUpdated }}</div>
    </div>
    <div v-else class="loading">Загрузка...</div>

    <!-- Фильтры -->
    <div class="filters">
      <div class="filter-group">
        <label>Тип:</label>
        <select v-model="filters.type">
          <option value="ALL">Все</option>
          <option value="EARN">Начисления</option>
          <option value="BURN">Списания</option>
          <option value="EXPIRE">Сгорания</option>
        </select>
      </div>

      <div class="filter-group">
        <label>С:</label>
        <input type="date" v-model="filters.dateFrom" />
      </div>

      <div class="filter-group">
        <label>По:</label>
        <input type="date" v-model="filters.dateTo" />
      </div>

      <button class="btn-apply" @click="applyFilters">Применить</button>
      <button class="btn-reset" @click="resetFilters">Сбросить</button>
    </div>

    <!-- История транзакций -->
    <h2>История операций</h2>
    <div class="transactions-list">
      <div v-if="transactions.length === 0" class="empty">Нет транзакций</div>
      <div
        v-for="tx in transactions"
        :key="tx.id"
        class="transaction-item"
        @click="showDetail(tx.id)"
      >
        <div class="tx-left">
          <span class="tx-date">{{ formatDate(tx.date) }}</span>
          <span class="tx-description">{{ tx.description || '—' }}</span>
        </div>
        <div class="tx-right">
          <span :class="['tx-amount', getTypeClass(tx.type)]">
            {{ tx.type === 'EARN' ? '+' : '-' }}{{ tx.amount }}
          </span>
        </div>
      </div>
    </div>

    <!-- Пагинация -->
    <div class="pagination" v-if="totalPages > 1">
      <button @click="prevPage" :disabled="page === 0">←</button>
      <span>{{ page + 1 }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="page >= totalPages - 1">→</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const balance = ref(null);
const balanceRub = ref(0);
const lastUpdated = ref('');
const transactions = ref([]);
const page = ref(0);
const size = ref(10);
const totalPages = ref(0);

// Фильтры
const filters = ref({
  type: 'ALL',
  dateFrom: '',
  dateTo: ''
});

const loadBalance = async () => {
  try {
    const response = await api.get('/bonus/balance');
    balance.value = response.data.balance;
    balanceRub.value = response.data.balanceRub;
    lastUpdated.value = formatDate(response.data.lastUpdated);
  } catch (error) {
    console.error('Ошибка загрузки баланса:', error);
  }
};

const loadTransactions = async () => {
  try {
    const params = {
      page: page.value,
      size: size.value
    };

    if (filters.value.type !== 'ALL') {
      params.type = filters.value.type;
    }
    if (filters.value.dateFrom) {
      params.dateFrom = filters.value.dateFrom;
    }
    if (filters.value.dateTo) {
      params.dateTo = filters.value.dateTo;
    }

    const response = await api.get('/bonus/transactions', { params });
    transactions.value = response.data.content || [];
    totalPages.value = response.data.totalPages || 0;
  } catch (error) {
    console.error('Ошибка загрузки транзакций:', error);
  }
};

const applyFilters = () => {
  page.value = 0;
  console.log('Применяем фильтры:', filters.value);
  loadTransactions();
};

const resetFilters = () => {
  filters.value = {
    type: 'ALL',
    dateFrom: '',
    dateTo: ''
  };
  page.value = 0;
  loadTransactions();
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

const getTypeClass = (type) => {
  return {
    EARN: 'earn',
    BURN: 'burn',
    EXPIRE: 'expire'
  }[type] || '';
};

const showDetail = (id) => {
  console.log('Детали транзакции:', id);
};

const prevPage = () => {
  if (page.value > 0) {
    page.value--;
    loadTransactions();
  }
};

const nextPage = () => {
  if (page.value < totalPages.value - 1) {
    page.value++;
    loadTransactions();
  }
};

onMounted(() => {
  loadBalance();
  loadTransactions();
});
</script>

<style scoped>
.bonus-page {
  max-width: 800px;
  margin: 0 auto;
}

h1, h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.balance-card {
  background: linear-gradient(135deg, #42b883, #2d8f6f);
  color: white;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
}

.balance-amount {
  font-size: 48px;
  font-weight: bold;
}

.balance-rub {
  font-size: 20px;
  opacity: 0.9;
}

.balance-updated {
  margin-top: 10px;
  font-size: 14px;
  opacity: 0.7;
}

/* Фильтры */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.filter-group select,
.filter-group input {
  padding: 6px 10px;
  border: 1px solid #dce1e8;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: #42b883;
}

.btn-apply {
  padding: 6px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-apply:hover {
  background: #3aa876;
}

.btn-reset {
  padding: 6px 16px;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-reset:hover {
  background: #7f8c8d;
}

/* Транзакции */
.transactions-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ecf0f1;
  cursor: pointer;
  transition: background 0.15s;
}

.transaction-item:hover {
  background: #f8f9fa;
}

.transaction-item:last-child {
  border-bottom: none;
}

.tx-left {
  display: flex;
  flex-direction: column;
}

.tx-date {
  font-size: 12px;
  color: #95a5a6;
}

.tx-description {
  font-size: 14px;
}

.tx-amount {
  font-weight: bold;
  font-size: 16px;
}

.earn {
  color: #27ae60;
}

.burn {
  color: #e74c3c;
}

.expire {
  color: #f39c12;
}

.loading, .empty {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
}

.pagination button {
  padding: 6px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .filter-group select,
  .filter-group input {
    flex: 1;
    min-width: 120px;
  }

  .btn-apply, .btn-reset {
    width: 100%;
    padding: 10px;
  }

  .balance-amount {
    font-size: 36px;
  }
}
</style>
