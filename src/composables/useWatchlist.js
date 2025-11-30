// src/composables/useWatchlist.js
import { ref, computed } from 'vue'
import {
  addToWatchlist,
  removeFromWatchlist,
  getMovieWatchlist,
  getTVWatchlist,
  checkWatchlist
} from '@/stores/watchlist'

const watchlistMovies = ref([])
const watchlistTV = ref([])
const isLoading = ref(false)

export function useWatchlist() {
  const watchlistCount = computed(() => watchlistMovies.value.length + watchlistTV.value.length)

  const isInWatchlist = (mediaId) => {
    return watchlistMovies.value.some(item => item.id === mediaId) ||
           watchlistTV.value.some(item => item.id === mediaId)
  }

  const toggleWatchlist = async (mediaId, mediaType = 'movie') => {
    try {
      const inWatchlist = isInWatchlist(mediaId)

      if (inWatchlist) {
        await removeFromWatchlist(mediaId, mediaType)
        if (mediaType === 'movie') {
          watchlistMovies.value = watchlistMovies.value.filter(item => item.id !== mediaId)
        } else {
          watchlistTV.value = watchlistTV.value.filter(item => item.id !== mediaId)
        }
      } else {
        await addToWatchlist(mediaId, mediaType)
        await loadWatchlist()
      }

      return !inWatchlist
    } catch (error) {
      console.error('Erro ao alternar watchlist:', error)
      throw error
    }
  }

  const loadWatchlist = async () => {
    isLoading.value = true
    try {
      const [movies, tv] = await Promise.all([
        getMovieWatchlist(),
        getTVWatchlist()
      ])
      watchlistMovies.value = movies
      watchlistTV.value = tv
    } catch (error) {
      console.error('Erro ao carregar watchlist:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    watchlistMovies,
    watchlistTV,
    watchlistCount,
    isInWatchlist,
    toggleWatchlist,
    loadWatchlist,
    isLoading,
    checkWatchlist
  }
}
