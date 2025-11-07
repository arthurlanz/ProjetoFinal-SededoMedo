import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tmdbService } from '@/services/tmdbService'

export const useMoviesStore = defineStore('movies', () => {
  // State
  const popularMovies = ref([])
  const topRatedMovies = ref([])
  const classicMovies = ref([])
  const currentMovie = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allMovies = computed(() => [
    ...popularMovies.value,
    ...topRatedMovies.value,
    ...classicMovies.value
  ])

  // Actions
  async function fetchPopular() {
    loading.value = true
    error.value = null
    try {
      const data = await tmdbService.fetchPopularHorror()
      popularMovies.value = data.results
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar filmes populares:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchTopRated() {
    loading.value = true
    error.value = null
    try {
      const data = await tmdbService.fetchTopRatedHorror()
      topRatedMovies.value = data.results
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar filmes mais avaliados:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchClassics() {
    loading.value = true
    error.value = null
    try {
      const data = await tmdbService.fetchClassicHorror()
      classicMovies.value = data.results
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar clássicos:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchMovieById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await tmdbService.fetchMovieDetails(id)
      currentMovie.value = data
      return data
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar detalhes do filme:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchAllSections() {
    await Promise.all([fetchPopular(), fetchTopRated(), fetchClassics()])
  }

  return {
    // State
    popularMovies,
    topRatedMovies,
    classicMovies,
    currentMovie,
    loading,
    error,
    // Getters
    allMovies,
    // Actions
    fetchPopular,
    fetchTopRated,
    fetchClassics,
    fetchMovieById,
    fetchAllSections
  }
})
