import api from './api'

const HORROR_GENRE_ID = 27

export const tmdbService = {
  async fetchPopularHorror(page = 1) {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: HORROR_GENRE_ID,
        sort_by: 'popularity.desc',
        page
      }
    })
    return response.data
  },
  async fetchTopRatedHorror(page = 1) {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: HORROR_GENRE_ID,
        sort_by: 'vote_average.desc',
        'vote_count.gte': 100,
        page
      }
    })
    return response.data
  },
  async fetchClassicHorror(page = 1) {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: HORROR_GENRE_ID,
        'primary_release_date.lte': '2000-12-31',
        sort_by: 'vote_average.desc',
        'vote_count.gte': 500,
        page
      }
    })
    return response.data
  },

  // Buscar filme por ID
  async fetchMovieDetails(movieId) {
    const response = await api.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'videos,credits,similar'
      }
    })
    return response.data
  },

  // Buscar filmes
  async searchMovies(query, page = 1) {
    const response = await api.get('/search/movie', {
      params: {
        query,
        page,
        with_genres: HORROR_GENRE_ID
      }
    })
    return response.data
  },

  // Buscar gêneros
  async fetchGenres() {
    const response = await api.get('/genre/movie/list')
    return response.data.genres
  },

  // Helper para construir URL de imagem
  getImageUrl(path, size = 'w500') {
    if (!path) return null
    return `${import.meta.env.VITE_TMDB_IMAGE_BASE}/${size}${path}`
  }
}
