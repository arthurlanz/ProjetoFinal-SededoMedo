import { ref, computed } from 'vue';
import { useMovieStore } from '@/stores/movie';
import { useGenreStore } from '@/stores/genre';

export function useMovies() {
  const movieStore = useMovieStore();
  const genreStore = useGenreStore();

  const viewMode = ref(localStorage.getItem('view-mode') || 'grid');
  const filterGenre = ref('all');
  const sortBy = ref('popularity');

  // Computed
  const movies = computed(() => movieStore.movies);
  const loading = computed(() => movieStore.loading);
  const error = computed(() => movieStore.error);

  // Filtrar e ordenar filmes
  const filteredMovies = computed(() => {
    let filtered = [...movies.value];

    // Filtrar por gênero
    if (filterGenre.value !== 'all') {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.includes(parseInt(filterGenre.value))
      );
    }

    // Ordenar
    switch (sortBy.value) {
      case 'rating':
        filtered.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'date':
        filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default: // popularity
        filtered.sort((a, b) => b.popularity - a.popularity);
    }

    return filtered;
  });

  // Mudar modo de visualização
  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
    localStorage.setItem('view-mode', viewMode.value);
  };

  // Setar filtro de gênero
  const setGenreFilter = (genreId) => {
    filterGenre.value = genreId;
  };

  // Setar ordenação
  const setSortBy = (sort) => {
    sortBy.value = sort;
  };

  // Carregar filmes iniciais
  const loadInitialMovies = async () => {
    await Promise.all([
      movieStore.getHorrorMovies(),
      movieStore.getTrendingHorrorMovies(),
      movieStore.getPopularHorrorMovies(),
      movieStore.getTopRatedHorrorMovies(),
      genreStore.getAllGenres('movie'),
    ]);
  };

  // Buscar filmes
  const searchMovies = async (query) => {
    await movieStore.searchMovies(query);
  };

  // Carregar mais filmes (paginação)
  const loadMoreMovies = async (page) => {
    await movieStore.getHorrorMovies(page);
  };

  return {
    movies,
    filteredMovies,
    loading,
    error,
    viewMode,
    filterGenre,
    sortBy,
    toggleViewMode,
    setGenreFilter,
    setSortBy,
    loadInitialMovies,
    searchMovies,
    loadMoreMovies,
  };
}
