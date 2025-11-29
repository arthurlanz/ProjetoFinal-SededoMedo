import { computed } from 'vue';
import { useFavoritesStore } from '@/stores/favorites';

export function useFavorites() {
  const favoritesStore = useFavoritesStore();

  const favorites = computed(() => favoritesStore.favorites);
  const history = computed(() => favoritesStore.history);

  const isFavorite = (movieId) => {
    return favoritesStore.isFavorite(movieId);
  };

  const toggleFavorite = (movie) => {
    favoritesStore.toggleFavorite(movie);
  };

  const addToFavorites = (movie) => {
    favoritesStore.addToFavorites(movie);
  };

  const removeFromFavorites = (movieId) => {
    favoritesStore.removeFromFavorites(movieId);
  };

  const addToHistory = (movie) => {
    favoritesStore.addToHistory(movie);
  };

  const clearHistory = () => {
    favoritesStore.clearHistory();
  };

  const favoritesCount = computed(() => favorites.value.length);
  const hasHistory = computed(() => history.value.length > 0);

  return {
    favorites,
    history,
    favoritesCount,
    hasHistory,
    isFavorite,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    addToHistory,
    clearHistory,
  };
}
