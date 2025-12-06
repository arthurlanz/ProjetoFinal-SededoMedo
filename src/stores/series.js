import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useSeriesStore = defineStore('series', () => {
  const state = reactive({
    series: [],
    trendingSeries: [],
    popularSeries: [],
    topRatedSeries: [],
    selectedSeries: null,
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  });

  const series = computed(() => state.series);
  const trendingSeries = computed(() => state.trendingSeries);
  const popularSeries = computed(() => state.popularSeries);
  const topRatedSeries = computed(() => state.topRatedSeries);
  const selectedSeries = computed(() => state.selectedSeries);
  const loading = computed(() => state.loading);
  const error = computed(() => state.error);

  const getHorrorSeries = async (page = 1) => {
    state.loading = true;
    state.error = null;
    try {
      const response = await api.get('discover/tv', {
        params: {
          language: 'pt-BR',
          page,
          with_genres: 27,
          sort_by: 'popularity.desc',
        },
      });
      state.series = response.data.results;
      state.currentPage = response.data.page;
      state.totalPages = response.data.total_pages;
    } catch (err) {
      state.error = 'Erro ao carregar séries de terror';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const getTrendingHorrorSeries = async () => {
    state.loading = true;
    try {
      const response = await api.get('trending/tv/week', {
        params: {
          language: 'pt-BR',
        },
      });
      state.trendingSeries = response.data.results.filter((show) =>
        show.genre_ids.includes(27)
      );
    } catch (err) {
      state.error = 'Erro ao carregar séries em alta';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const getPopularHorrorSeries = async () => {
    state.loading = true;
    try {
      const response = await api.get('discover/tv', {
        params: {
          language: 'pt-BR',
          with_genres: 27,
          sort_by: 'popularity.desc',
          page: 1,
        },
      });
      state.popularSeries = response.data.results.slice(0, 10);
    } catch (err) {
      state.error = 'Erro ao carregar séries populares';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const getTopRatedHorrorSeries = async () => {
    state.loading = true;
    try {
      const response = await api.get('discover/tv', {
        params: {
          language: 'pt-BR',
          with_genres: 27,
          sort_by: 'vote_average.desc',
          'vote_count.gte': 100,
          page: 1,
        },
      });
      state.topRatedSeries = response.data.results.slice(0, 10);
    } catch (err) {
      state.error = 'Erro ao carregar séries melhor avaliadas';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const getSeriesDetails = async (id) => {
    state.loading = true;
    state.error = null;
    try {
      const [seriesResponse, creditsResponse, videosResponse] = await Promise.all([
        api.get(`tv/${id}`, {
          params: { language: 'pt-BR' },
        }),
        api.get(`tv/${id}/credits`, {
          params: { language: 'pt-BR' },
        }),
        api.get(`tv/${id}/videos`, {
          params: { language: 'pt-BR' },
        }),
      ]);

      state.selectedSeries = {
        ...seriesResponse.data,
        cast: creditsResponse.data.cast.slice(0, 10),
        crew: creditsResponse.data.crew,
        videos: videosResponse.data.results,
        trailer: videosResponse.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        ),
      };
    } catch (err) {
      state.error = 'Erro ao carregar detalhes da série';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const getSimilarSeries = async (id) => {
    try {
      const response = await api.get(`tv/${id}/similar`, {
        params: {
          language: 'pt-BR',
          page: 1,
        },
      });
      return response.data.results.slice(0, 6);
    } catch (err) {
      console.error('Erro ao carregar séries similares:', err);
      return [];
    }
  };

  const searchSeries = async (query, page = 1) => {
    if (!query.trim()) {
      state.series = [];
      return;
    }

    state.loading = true;
    state.error = null;
    try {
      const response = await api.get('search/tv', {
        params: {
          language: 'pt-BR',
          query,
          page,
        },
      });
      state.series = response.data.results.filter((show) =>
        show.genre_ids.includes(27)
      );
      state.currentPage = response.data.page;
      state.totalPages = response.data.total_pages;
    } catch (err) {
      state.error = 'Erro ao buscar séries';
      console.error(err);
    } finally {
      state.loading = false;
    }
  };

  const discoverSeries = async (params) => {
    try {
      const response = await api.get('discover/tv', {
        params: {
          language: 'pt-BR',
          ...params,
        },
      });
      return response.data.results;
    } catch (err) {
      console.error('Erro ao descobrir séries:', err);
      return [];
    }
  };

  const clearSelectedSeries = () => {
    state.selectedSeries = null;
  };

  return {
    series,
    trendingSeries,
    popularSeries,
    topRatedSeries,
    selectedSeries,
    loading,
    error,
    getHorrorSeries,
    getTrendingHorrorSeries,
    getPopularHorrorSeries,
    getTopRatedHorrorSeries,
    getSeriesDetails,
    getSimilarSeries,
    searchSeries,
    discoverSeries,
    clearSelectedSeries,
  };
});
