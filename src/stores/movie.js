import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useMovieStore = defineStore('movie', () => {
  const state = reactive({
    movies: [],
    trendingMovies: [],
    popularMovies: [],
    topRatedMovies: [],
    selectedMovie: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  });
  const movies = computed(() => state.movies);
  const trendingMovies = computed(() => state.trendingMovies);
  const popularMovies = computed(() => state.popularMovies);
  const topRatedMovies = computed(() => state.topRatedMovies);
  const selectedMovie = computed(() => state.selectedMovie);
  const loading = computed(() => state.loading);
  const error = computed(() => state.error);
  const getHorrorMovies = async (page = 1) => {
    state.loading = true;
    state.error = null;
    try {
      const response = await api.get('discover/movie', {
        params: {
          language: 'pt-BR',
          page,
          with_genres: 27,
          sort_by: 'popularity.desc',
        },
      });
      state.movies = response.data.results;
      state.currentPage = response.data.page;
      state.totalPages = response.data.total_pages;
    } catch (err) {
      state.error = 'Erro ao carregar filmes de terror';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };
  const getTrendingHorrorMovies = async () => {
    state.loading = true;
    try {
      const response = await api.get('trending/movie/week', {
        params: {
          language: 'pt-BR',
        },
      });
      state.trendingMovies = response.data.results.filter((movie) =>
        movie.genre_ids.includes(27)
      );
    } catch (err) {
      state.error = 'Erro ao carregar filmes em alta';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };
  const getPopularHorrorMovies = async () => {
    state.loading = true;
    try {
      const response = await api.get('discover/movie', {
        params: {
          language: 'pt-BR',
          with_genres: 27,
          sort_by: 'popularity.desc',
          page: 1,
        },
      });
      state.popularMovies = response.data.results.slice(0, 10);
    } catch (err) {
      state.error = 'Erro ao carregar filmes populares';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };
  const getTopRatedHorrorMovies = async () => {
    state.loading = true;
    try {
      const response = await api.get('discover/movie', {
        params: {
          language: 'pt-BR',
          with_genres: 27,
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          page: 1,
        },
      });
      state.topRatedMovies = response.data.results.slice(0, 10);
    } catch (err) {
      state.error = 'Erro ao carregar filmes melhor avaliados';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };
  const getMovieDetails = async (id) => {
    state.loading = true;
    state.error = null;
    try {
      const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
        api.get(`movie/${id}`, {
          params: { language: 'pt-BR' },
        }),
        api.get(`movie/${id}/credits`, {
          params: { language: 'pt-BR' },
        }),
        api.get(`movie/${id}/videos`, {
          params: { language: 'pt-BR' },
        }),
      ]);

      state.selectedMovie = {
        ...movieResponse.data,
        cast: creditsResponse.data.cast.slice(0, 10),
        crew: creditsResponse.data.crew,
        videos: videosResponse.data.results,
        trailer: videosResponse.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        ),
      };
    } catch (err) {
      state.error = 'Erro ao carregar detalhes do filme';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };
  const getSimilarMovies = async (id) => {
    try {
      const response = await api.get(`movie/${id}/similar`, {
        params: {
          language: 'pt-BR',
          page: 1,
        },
      });
      return response.data.results.slice(0, 6);
    } catch (err) {
      console.error('Erro ao carregar filmes similares:', err);
      return [];
    }
  };
  const searchMovies = async (query, page = 1) => {
    if (!query.trim()) {
      state.movies = [];
      return;
    }

    state.loading = true;
    state.error = null;
    try {
      const response = await api.get('search/movie', {
        params: {
          language: 'pt-BR',
          query,
          page,
          with_genres: 27,
        },
      });
      state.movies = response.data.results.filter((movie) =>
        movie.genre_ids.includes(27)
      );
      state.currentPage = response.data.page;
      state.totalPages = response.data.total_pages;
    } catch (err) {
      state.error = 'Erro ao buscar filmes';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };
  const clearSelectedMovie = () => {
    state.selectedMovie = null;
  };

  return {
    movies,
    trendingMovies,
    popularMovies,
    topRatedMovies,
    selectedMovie,
    loading,
    error,
    getHorrorMovies,
    getTrendingHorrorMovies,
    getPopularHorrorMovies,
    getTopRatedHorrorMovies,
    getMovieDetails,
    getSimilarMovies,
    searchMovies,
    clearSelectedMovie,
  };
});
