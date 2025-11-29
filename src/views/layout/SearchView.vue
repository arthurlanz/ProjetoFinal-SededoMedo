<template>
  <div class="search-view">
    <div class="container">
      <header class="search-view__header">
        <h1 class="search-view__title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          Buscar Filmes
        </h1>
      </header>

      <!-- Search Bar -->
      <div class="search-view__search">
        <SearchBar @search="handleSearch" @clear="handleClear" />
      </div>

      <!-- Results Info -->
      <div v-if="searchQuery" class="search-view__info">
        <p v-if="!loading">
          {{ movies.length }} {{ movies.length === 1 ? 'resultado' : 'resultados' }}
          para "<strong>{{ searchQuery }}</strong>"
        </p>
        <p v-else>Buscando...</p>
      </div>

      <!-- Loading -->
      <LoadingScreen :loading="loading" text="Procurando filmes..." />

      <!-- Results -->
      <div v-if="!loading && searchQuery">
        <MovieGrid
          :movies="movies"
          :view-mode="viewMode"
          :loading="loading"
          :has-more="false"
        />
      </div>

      <!-- Initial State -->
      <div v-if="!searchQuery && !loading" class="search-view__initial">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <h2>Encontre seu próximo pesadelo</h2>
        <p>Digite o título de um filme, ator ou diretor para começar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movie';
import SearchBar from '@/components/layout/SearchBar.vue';
import MovieGrid from '@/components/movie/MovieGrid.vue';
import LoadingScreen from '@/components/layout/LoadingScreen.vue';

const route = useRoute();
const router = useRouter();
const movieStore = useMovieStore();

const searchQuery = ref('');
const viewMode = ref(localStorage.getItem('view-mode') || 'grid');

const movies = computed(() => movieStore.movies);
const loading = computed(() => movieStore.loading);

const handleSearch = async (query) => {
  searchQuery.value = query;
  await movieStore.searchMovies(query);

  // Update URL
  router.push({ name: 'search', query: { q: query } });
};

const handleClear = () => {
  searchQuery.value = '';
  movieStore.movies = [];
  router.push({ name: 'search' });
};

onMounted(() => {
  const query = route.query.q;
  if (query) {
    searchQuery.value = query;
    movieStore.searchMovies(query);
  }
});
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.search-view__header {
  text-align: center;
  margin-bottom: 2rem;
  padding-top: 2rem;
}

.search-view__title {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

.search-view__title svg {
  width: 48px;
  height: 48px;
}

.search-view__search {
  max-width: 700px;
  margin: 0 auto 2rem;
}

.search-view__info {
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  text-align: center;
  color: #d1d5db;
}

.search-view__info strong {
  color: #dc2626;
  font-weight: 700;
}

.search-view__initial {
  text-align: center;
  padding: 6rem 2rem;
  color: #6b7280;
}

.search-view__initial svg {
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  color: #374151;
}

.search-view__initial h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.search-view__initial p {
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .search-view__title {
    font-size: 2rem;
  }

  .search-view__title svg {
    width: 36px;
    height: 36px;
  }
}
</style>
