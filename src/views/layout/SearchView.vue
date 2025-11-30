<template>
  <div class="search-view">
    <div class="container">
      <!-- Info de resultados - quando há busca ativa -->
      <div v-if="searchQuery" class="search-view__results-info">
        <p v-if="!loading">
          {{ movies.length }} {{ movies.length === 1 ? 'resultado' : 'resultados' }} para "<strong>{{ searchQuery }}</strong>"
        </p>
        <p v-else>Buscando...</p>
      </div>

      <!-- Loading -->
      <LoadingScreen v-if="loading" message="Buscando filmes..." />

      <!-- Results -->
      <MovieGrid
        v-else-if="movies.length > 0 && searchQuery"
        :movies="movies"
        :view-mode="viewMode"
        :loading="loading"
        :has-more="false"
      />

      <!-- No Results -->
      <div v-else-if="searchQuery && !loading && movies.length === 0" class="search-view__empty">
        <div class="search-view__icon">🔍</div>
        <h2>Nenhum resultado encontrado</h2>
        <p>Tente buscar por outro termo ou filme diferente</p>
      </div>

      <!-- Initial State - só quando não há busca -->
      <div v-if="!searchQuery && !loading" class="search-view__initial">
        <div class="search-view__icon">🎬</div>
        <h2>Encontre seu próximo pesadelo</h2>
        <p>Use a barra de pesquisa no topo da página para começar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMovieStore } from '@/stores/movie';
import MovieGrid from '@/components/movie/MovieGrid.vue';
import LoadingScreen from '@/components/layout/LoadingScreen.vue';

const route = useRoute();
const movieStore = useMovieStore();

const searchQuery = ref('');
const viewMode = ref(localStorage.getItem('view-mode') || 'grid');

const movies = computed(() => movieStore.movies);
const loading = computed(() => movieStore.loading);

watch(
  () => route.query.q,
  async (newQuery) => {
    if (newQuery && newQuery.trim()) {
      searchQuery.value = newQuery;
      await movieStore.searchMovies(newQuery);
    } else {
      searchQuery.value = '';
      movieStore.movies = [];
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.search-view {
  min-height: 100vh;
  background: rgb(20, 20, 20);
  padding: 4rem 0 4rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4%;
}

.search-view__results-info {
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background: rgba(229, 9, 20, 0.1);
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: 4px;
  text-align: center;
  color: #e5e5e5;
  font-size: 1rem;
}

.search-view__results-info strong {
  color: #e50914;
  font-weight: 700;
}

.search-view__empty,
.search-view__initial {
  text-align: center;
  padding: 8rem 2rem;
  color: #808080;
}

.search-view__icon {
  font-size: 6rem;
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.search-view__empty h2,
.search-view__initial h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fff;
}

.search-view__empty p,
.search-view__initial p {
  font-size: 1.125rem;
  color: #808080;
}

@media (max-width: 768px) {
  .search-view__initial h2,
  .search-view__empty h2 {
    font-size: 1.5rem;
  }

  .search-view__icon {
    font-size: 4rem;
  }
}
</style>
