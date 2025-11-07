import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tmdbService } from '@/services/tmdbService'

export const useSearchStore = defineStore('search', () => {
  // State
  const searchQuery = ref('')
  const searchResults = ref([])
  const searchHistory = ref(JSON.parse(localStorage.getItem('searchHistory') || '[]'))
  const loading = ref(false)
  const error = ref(null)

  // Actions
  async function searchMovies(query) {
    if (!query || query.trim().length < 3) {
      searchResults.value = []
      return
    }

    loading.value = true
    error.value = null
    searchQuery.value = query

    try {
      const data = await tmdbService.searchMovies(query)
      searchResults.value = data.results
      addToHistory(query)
    } catch (err) {
      error.value = err.message
      console.error('Erro ao buscar filmes:', err)
    } finally {
      loading.value = false
    }
  }

  function addToHistory(query) {
    const trimmedQuery = query.trim()
    if (!searchHistory.value.includes(trimmedQuery)) {
      searchHistory.value.unshift(trimmedQuery)
      if (searchHistory.value.length > 10) {
        searchHistory.value = searchHistory.value.slice(0, 10)
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }
  }

  function clearHistory() {
    searchHistory.value = []
    localStorage.setItem('searchHistory', '[]')
  }

  function clearResults() {
    searchResults.value = []
    searchQuery.value = ''
  }

  return {
    // State
    searchQuery,
    searchResults,
    searchHistory,
    loading,
    error,
    // Actions
    searchMovies,
    addToHistory,
    clearHistory,
    clearResults
  }
})
