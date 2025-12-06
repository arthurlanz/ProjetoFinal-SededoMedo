import { ref, computed } from 'vue';
import { useSeriesStore } from '@/stores/series';
import { useGenreStore } from '@/stores/genre';

export function useSeries() {
  const seriesStore = useSeriesStore();
  const genreStore = useGenreStore();

  const viewMode = ref(localStorage.getItem('series-view-mode') || 'grid');
  const filterGenre = ref('all');
  const sortBy = ref('popularity');

  // Computed
  const series = computed(() => seriesStore.series);
  const loading = computed(() => seriesStore.loading);
  const error = computed(() => seriesStore.error);

  // Filtrar e ordenar séries
  const filteredSeries = computed(() => {
    let filtered = [...series.value];

    // Filtrar por gênero
    if (filterGenre.value !== 'all') {
      filtered = filtered.filter((show) =>
        show.genre_ids.includes(parseInt(filterGenre.value))
      );
    }

    // Ordenar
    switch (sortBy.value) {
      case 'rating':
        filtered.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.first_air_date) - new Date(a.first_air_date));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // popularity
        filtered.sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  });

  // Mudar modo de visualização
  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
    localStorage.setItem('series-view-mode', viewMode.value);
  };

  // Setar filtro de gênero
  const setGenreFilter = (genreId) => {
    filterGenre.value = genreId;
  };

  // Setar ordenação
  const setSortBy = (sort) => {
    sortBy.value = sort;
  };

  // Carregar séries iniciais
  const loadInitialSeries = async () => {
    await Promise.all([
      seriesStore.getHorrorSeries(),
      seriesStore.getTrendingHorrorSeries(),
      seriesStore.getPopularHorrorSeries(),
      seriesStore.getTopRatedHorrorSeries(),
      genreStore.getAllGenres('tv'),
    ]);
  };

  // Buscar séries
  const searchSeries = async (query) => {
    await seriesStore.searchSeries(query);
  };

  // Carregar mais séries (paginação)
  const loadMoreSeries = async (page) => {
    await seriesStore.getHorrorSeries(page);
  };

  return {
    series,
    filteredSeries,
    loading,
    error,
    viewMode,
    filterGenre,
    sortBy,
    toggleViewMode,
    setGenreFilter,
    setSortBy,
    loadInitialSeries,
    searchSeries,
    loadMoreSeries,
  };
}
