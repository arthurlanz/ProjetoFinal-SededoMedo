import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {

  const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

  const favoritesCount = computed(() => favorites.value.length)

  const isFavorite = computed(() => {
    return movieId => favorites.value.some(fav => fav.id === movieId)
  })
  function addFavorite(movie) {
    if (!isFavorite.value(movie.id)) {
      const favoriteMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        addedAt: new Date().toISOString()
      }
      favorites.value.push(favoriteMovie)
      saveFavorites()
    }
  }

  function removeFavorite(movieId) {
    favorites.value = favorites.value.filter(fav => fav.id !== movieId)
    saveFavorites()
  }

  function toggleFavorite(movie) {
    if (isFavorite.value(movie.id)) {
      removeFavorite(movie.id)
    } else {
      addFavorite(movie)
    }
  }

  function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function clearFavorites() {
    favorites.value = []
    saveFavorites()
  }

  return {
    favorites,
    favoritesCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites
  }
})
