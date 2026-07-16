<template>
  <div class="bonus-page">
    <h1>Бонусный баланс</h1>

    <div class="card balance-card" v-if="balance !== null">
      <div class="balance-amount">{{ balance }} бонусов</div>
      <div class="balance-rub">≈ {{ balanceRub }} ₽</div>
      <div class="balance-updated">Обновлено: {{ lastUpdated }}</div>
    </div>
    <div v-else class="loading">Загрузка...</div>

    <div class="card filters">
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

    <h2>История операций</h2>
    <div class="card transactions-list">
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

const filters = ref({ type: 'ALL', dateFrom: '', dateTo: '' });

const loadBalance = async () => {
  try {
    const res = await api.get('/bonus/balance');
    balance.value = res.data.balance;
    balanceRub.value = res.data.balanceRub;
    lastUpdated.value = formatDate(res.data.lastUpdated);
  } catch (e) { console.error(e); }
};

const loadTransactions = async () => {
  try {
    const params = { page: page.value, size: size.value };
    if (filters.value.type !== 'ALL') params.type = filters.value.type;
    if (filters.value.dateFrom) params.dateFrom = filters.value.dateFrom;
    if (filters.value.dateTo) params.dateTo = filters.value.dateTo;

    const res = await api.get('/bonus/transactions', { params });
    transactions.value = res.data.content || [];
    totalPages.value = res.data.totalPages || 0;
  } catch (e) { console.error(e); }
};

const applyFilters = () => { page.value = 0; loadTransactions(); };
const resetFilters = () => {
  filters.value = { type: 'ALL', dateFrom: '', dateTo: '' };
  page.value = 0;
  loadTransactions();
};

const formatDate = (s) => s ? new Date(s).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
const getTypeClass = (t) => ({ EARN: 'earn', BURN: 'burn', EXPIRE: 'expire' }[t] || '');
const showDetail = (id) => console.log('Детали транзакции:', id);

const prevPage = () => { if (page.value > 0) { page.value--; loadTransactions(); } };
const nextPage = () => { if (page.value < totalPages.value - 1) { page.value++; loadTransactions(); } };

onMounted(() => { loadBalance(); loadTransactions(); });
</script>

<style scoped>
.bonus-page {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
}

.balance-card {
  background: linear-gradient(135deg, #42b883, #2d8f6f);
  color: white;
  text-align: center;
}
.balance-amount { font-size: clamp(32px, 8vw, 48px); font-weight: bold; }
.balance-rub { font-size: clamp(16px, 3vw, 20px); opacity: 0.9; }
.balance-updated { margin-top: 10px; font-size: 14px; opacity: 0.7; }

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 120px;
}
.filter-group label { font-weight: 500; color: #555; font-size: 14px; white-space: nowrap; }
.filter-group select,
.filter-group input {
  padding: 6px 10px;
  border: 1px solid #dce1e8;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  width: 100%;
  min-height: 40px;
}
.btn-apply, .btn-reset {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  min-height: 40px;
  flex: 1 1 auto;
}
.btn-apply { background: #42b883; color: white; }
.btn-apply:hover { background: #3aa876; }
.btn-reset { background: #95a5a6; color: white; }
.btn-reset:hover { background: #7f8c8d; }

.transactions-list { padding: 0; overflow: hidden; }
.transaction-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ecf0f1;
  cursor: pointer;
}
.transaction-item:hover { background: #f8f9fa; }
.transaction-item:last-child { border-bottom: none; }
.tx-left { display: flex; flex-direction: column; min-width: 0; }
.tx-date { font-size: 12px; color: #95a5a6; }
.tx-description { font-size: 14px; word-break: break-word; }
.tx-amount { font-weight: bold; font-size: 16px; white-space: nowrap; }
.earn { color: #27ae60; }
.burn { color: #e74c3c; }
.expire { color: #f39c12; }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}
.pagination button {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  min-height: 44px;
  min-width: 44px;
}
.pagination button:disabled { background: #95a5a6; cursor: not-allowed; }
.pagination button:hover:not(:disabled) { background: #3aa876; }

@media (max-width: 600px) {
  .filters { flex-direction: column; align-items: stretch; }
  .filter-group { flex-direction: column; align-items: stretch; gap: 4px; }
  .btn-apply, .btn-reset { width: 100%; }
  .transaction-item { flex-wrap: wrap; gap: 8px; }
}
</style>
