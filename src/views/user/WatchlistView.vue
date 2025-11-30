<template>
  <div class="watchlist-view">
    <div class="container">
      <header class="watchlist-view__header">
        <h1 class="watchlist-view__title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          Minha Lista de Interesses
        </h1>
        <p class="watchlist-view__subtitle">
          {{ movies.length }} {{ movies.length === 1 ? 'filme' : 'filmes' }} para assistir
        </p>
      </header>

      <LoadingScreen :loading="loading" text="Carregando lista..." />

      <div v-if="!loading && movies.length > 0">
        <MovieGrid
          :movies="movies"
          :view-mode="viewMode"
          :loading="false"
          :has-more="false"
        />
      </div>

      <div v-if="!loading && movies.length === 0" class="watchlist-view__empty">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <h2>Sua lista está vazia</h2>
        <p>Adicione filmes que você deseja assistir!</p>
        <button @click="goHome" class="watchlist-view__cta">
          Explorar Filmes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import MovieGrid from '@/components/movie/MovieGrid.vue';
import LoadingScreen from '@/components/layout/LoadingScreen.vue';

const router = useRouter();
const authStore = useAuthStore();

const movies = ref([]);
const loading = ref(true);
const viewMode = ref(localStorage.getItem('view-mode') || 'grid');

const goHome = () => {
  router.push({ name: 'home' });
};

onMounted(async () => {
  try {
    movies.value = await authStore.getWatchlist();
  } catch (error) {
    console.error('Erro ao carregar watchlist:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.watchlist-view {
  min-height: 100vh;
  background: rgb(20, 20, 20);
  padding: 5rem 0 4rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4%;
}

.watchlist-view__header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.watchlist-view__title {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

.watchlist-view__title svg {
  width: 48px;
  height: 48px;
}

.watchlist-view__subtitle {
  color: #9ca3af;
  font-size: 1.125rem;
}

.watchlist-view__empty {
  text-align: center;
  padding: 6rem 2rem;
  color: #6b7280;
}

.watchlist-view__empty svg {
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  color: #374151;
}

.watchlist-view__empty h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.watchlist-view__empty p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.watchlist-view__cta {
  padding: 1rem 2rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.watchlist-view__cta:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

@media (max-width: 768px) {
  .watchlist-view__title {
    font-size: 2rem;
  }

  .watchlist-view__title svg {
    width: 36px;
    height: 36px;
  }
}
</style>
