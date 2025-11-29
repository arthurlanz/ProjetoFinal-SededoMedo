import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from '@/stores/auth';

export const useFavoritesStore = defineStore('favorites', () => {
  const state = reactive({
    favorites: [],
    history: [],
  });

  const favorites = computed(() => state.favorites);
  const history = computed(() => state.history);

  const loadFromStorage = () => {
    const savedFavorites = localStorage.getItem('horror-favorites');
    const savedHistory = localStorage.getItem('horror-history');

    if (savedFavorites) {
      state.favorites = JSON.parse(savedFavorites);
    }

    if (savedHistory) {
      state.history = JSON.parse(savedHistory);
    }
  };

  // 🆕 NOVA FUNÇÃO: Carregar favoritos da API e SUBSTITUIR os locais
  const loadFromTMDB = async () => {
    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      try {
        console.log('📥 Carregando favoritos da API TMDB...');
        const tmdbFavorites = await authStore.getFavoriteMovies();

        // SUBSTITUI os favoritos locais pelos da API (não faz merge)
        state.favorites = tmdbFavorites.map(movie => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          addedAt: new Date().toISOString(),
        }));

        localStorage.setItem('horror-favorites', JSON.stringify(state.favorites));
        console.log(`✅ ${state.favorites.length} favoritos carregados da API`);
      } catch (error) {
        console.error('❌ Erro ao carregar favoritos da API:', error);
      }
    }
  };

  // Mantida para compatibilidade (mas não usada mais)
  const syncWithTMDB = async () => {
    await loadFromTMDB();
  };

  const isFavorite = (movieId) => {
    return state.favorites.some((movie) => movie.id === movieId);
  };

  const addToFavorites = async (movie) => {
    if (!isFavorite(movie.id)) {
      const favoriteMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        addedAt: new Date().toISOString(),
      };

      state.favorites.push(favoriteMovie);
      localStorage.setItem('horror-favorites', JSON.stringify(state.favorites));

      const authStore = useAuthStore();
      if (authStore.isAuthenticated && authStore.user?.id) {
        const success = await authStore.toggleFavoriteTMDB(movie.id, true);
        if (success) {
          console.log('✅ Favorito salvo no TMDB');
        }
      }
    }
  };

  const removeFromFavorites = async (movieId) => {
    state.favorites = state.favorites.filter((movie) => movie.id !== movieId);
    localStorage.setItem('horror-favorites', JSON.stringify(state.favorites));

    const authStore = useAuthStore();
    if (authStore.isAuthenticated) {
      await authStore.toggleFavoriteTMDB(movieId, false);
    }
  };

  const toggleFavorite = async (movie) => {
    if (isFavorite(movie.id)) {
      await removeFromFavorites(movie.id);
    } else {
      await addToFavorites(movie);
    }
  };

  const addToHistory = (movie) => {
    state.history = state.history.filter((m) => m.id !== movie.id);
    state.history.unshift({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      viewedAt: new Date().toISOString(),
    });

    if (state.history.length > 20) {
      state.history = state.history.slice(0, 20);
    }

    localStorage.setItem('horror-history', JSON.stringify(state.history));
  };

  const clearHistory = () => {
    state.history = [];
    localStorage.removeItem('horror-history');
  };

  // 🆕 NOVA FUNÇÃO: Limpar tudo (favoritos + histórico)
  const clearAll = () => {
    state.favorites = [];
    state.history = [];
    localStorage.removeItem('horror-favorites');
    localStorage.removeItem('horror-history');
    console.log('🧹 Favoritos e histórico limpos');
  };

  loadFromStorage();

  return {
    favorites,
    history,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    addToHistory,
    clearHistory,
    syncWithTMDB,
    loadFromTMDB,
    clearAll,
  };
});
