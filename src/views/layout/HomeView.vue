<template>
    <div class="home">
      <section v-if="trendingMovies.length > 0" class="home__hero">
        <div class="home__hero-slider">
          <Transition name="fade" mode="out-in">
            <div :key="currentHeroIndex" class="home__hero-slide">
              <img
                :src="getBackdrop(trendingMovies[currentHeroIndex].backdrop_path)"
                :alt="trendingMovies[currentHeroIndex].title"
                class="home__hero-image"
              />
              <div class="home__hero-overlay"></div>
              <div class="home__hero-content">
                <h1 class="home__hero-title">{{ trendingMovies[currentHeroIndex].title }}</h1>
                <p class="home__hero-overview">{{ truncateText(trendingMovies[currentHeroIndex].overview, 200) }}</p>
                <div class="home__hero-meta">
                  <span class="home__hero-rating">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    {{ trendingMovies[currentHeroIndex].vote_average.toFixed(1) }}
                  </span>
                  <span v-if="trendingMovies[currentHeroIndex].release_date">
                    {{ new Date(trendingMovies[currentHeroIndex].release_date).getFullYear() }}
                  </span>
                </div>
                <div class="home__hero-actions">
                  <button @click="goToMovie(trendingMovies[currentHeroIndex].id)" class="home__hero-btn home__hero-btn--primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="10"/>
                      <polygon points="10 8 16 12 10 16 10 8" fill="white"/>
                    </svg>
                    Ver Detalhes
                  </button>
                  <button @click="toggleFavorite(trendingMovies[currentHeroIndex])" class="home__hero-btn home__hero-btn--secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isFavorite(trendingMovies[currentHeroIndex].id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {{ isFavorite(trendingMovies[currentHeroIndex].id) ? 'Nos Favoritos' : 'Adicionar' }}
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
        <div class="home__hero-nav">
          <button
            v-for="(movie, index) in trendingMovies.slice(0, 5)"
            :key="movie.id"
            @click="currentHeroIndex = index"
            class="home__hero-dot"
            :class="{ 'home__hero-dot--active': currentHeroIndex === index }"
          ></button>
        </div>
      </section>
      <div class="home__content container">
        <div class="home__controls">
          <div class="home__filters">
            <select v-model="filterGenre" @change="handleGenreChange" class="home__select">
              <option value="all">Todos os Gêneros</option>
              <option v-for="genre in genres" :key="genre.id" :value="genre.id">
                {{ genre.name }}
              </option>
            </select>
  
            <select v-model="sortBy" @change="handleSortChange" class="home__select">
              <option value="popularity">Mais Populares</option>
              <option value="rating">Melhor Avaliados</option>
              <option value="date">Mais Recentes</option>
              <option value="title">Título (A-Z)</option>
            </select>
          </div>
  
          <button @click="toggleViewMode" class="home__view-toggle">
            <svg v-if="viewMode === 'grid'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
        <section class="home__section">
          <h2 class="home__section-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="2" x2="12" y2="6"/>
              <line x1="12" y1="18" x2="12" y2="22"/>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
              <line x1="2" y1="12" x2="6" y2="12"/>
              <line x1="18" y1="12" x2="22" y2="12"/>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
            </svg>
            Em Alta
          </h2>
          <MovieGrid
            :movies="filteredMovies"
            :view-mode="viewMode"
            :loading="loading"
            :has-more="currentPage < totalPages"
            @load-more="loadMore"
          />
        </section>
        <section v-if="topRatedMovies.length > 0" class="home__section">
          <h2 class="home__section-title">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Clássicos do Terror
          </h2>
          <div class="home__horizontal-scroll">
            <MovieCard
              v-for="movie in topRatedMovies"
              :key="movie.id"
              :movie="movie"
              view-mode="grid"
            />
          </div>
        </section>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  import { useMovieStore } from '@/stores/movie';
  import { useGenreStore } from '@/stores/genre';
  import { useFavorites } from '@/composables/useFavorites';
  import { getBackdropUrl } from '@/plugins/axios';
  import MovieGrid from '@/components/movie/MovieGrid.vue';
  import MovieCard from '@/components/movie/MovieCard.vue';
  
  const router = useRouter();
  const movieStore = useMovieStore();
  const genreStore = useGenreStore();
  const { isFavorite, toggleFavorite: toggleFav } = useFavorites();
  
  const currentHeroIndex = ref(0);
  const viewMode = ref(localStorage.getItem('view-mode') || 'grid');
  const filterGenre = ref('all');
  const sortBy = ref('popularity');
  const currentPage = ref(1);
  
  const trendingMovies = computed(() => movieStore.trendingMovies.slice(0, 5));
  const movies = computed(() => movieStore.movies);
  const topRatedMovies = computed(() => movieStore.topRatedMovies);
  const genres = computed(() => genreStore.genres);
  const loading = computed(() => movieStore.loading);
  const totalPages = computed(() => movieStore.totalPages || 1);
  
  const filteredMovies = computed(() => {
    let filtered = [...movies.value];
  
    if (filterGenre.value !== 'all') {
      filtered = filtered.filter((movie) =>
        movie.genre_ids.includes(parseInt(filterGenre.value))
      );
    }
  
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
      default:
        filtered.sort((a, b) => b.popularity - a.popularity);
    }
  
    return filtered;
  });
  
  const getBackdrop = (path) => {
    return getBackdropUrl(path, 'original');
  };
  
  const truncateText = (text, length) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };
  
  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
    localStorage.setItem('view-mode', viewMode.value);
  };
  
  const handleGenreChange = () => {
    currentPage.value = 1;
    loadMovies();
  };
  
  const handleSortChange = () => {
    currentPage.value = 1;
    loadMovies();
  };
  
  const goToMovie = (id) => {
    router.push({ name: 'movie-detail', params: { id } });
  };
  
  const toggleFavorite = (movie) => {
    toggleFav(movie);
  };
  
  const loadMovies = async () => {
    await movieStore.getHorrorMovies(currentPage.value);
  };
  
  const loadMore = async () => {
    currentPage.value++;
    await loadMovies();
  };
  
  // Auto-rotate hero slider
  let heroInterval;
  onMounted(async () => {
    await Promise.all([
      movieStore.getTrendingHorrorMovies(),
      movieStore.getHorrorMovies(),
      movieStore.getTopRatedHorrorMovies(),
      genreStore.getAllGenres('movie'),
    ]);
  
    heroInterval = setInterval(() => {
      if (trendingMovies.value.length > 0) {
        currentHeroIndex.value = (currentHeroIndex.value + 1) % trendingMovies.value.length;
      }
    }, 5000);
  });
  
  onBeforeUnmount(() => {
    if (heroInterval) {
      clearInterval(heroInterval);
    }
  });
  </script>
  
  <style scoped>
  .container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }
  
  .home__hero {
    position: relative;
    height: 80vh;
    min-height: 500px;
    margin-bottom: 4rem;
    overflow: hidden;
  }
  
  .home__hero-slider {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .home__hero-slide {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .home__hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .home__hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.95) 0%,
      rgba(0, 0, 0, 0.3) 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
  
  .home__hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 4rem 2rem 3rem;
    max-width: 1400px;
    margin: 0 auto;
  }
  
  .home__hero-title {
    font-size: 3.5rem;
    font-weight: 900;
    color: #dc2626;
    margin-bottom: 1rem;
    text-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
    line-height: 1.1;
  }
  
  .home__hero-overview {
    font-size: 1.125rem;
    color: #d1d5db;
    margin-bottom: 1.5rem;
    max-width: 700px;
    line-height: 1.6;
  }
  
  .home__hero-meta {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    font-size: 1.125rem;
    color: #9ca3af;
  }
  
  .home__hero-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #fbbf24;
    font-weight: 700;
  }
  
  .home__hero-rating svg {
    width: 20px;
    height: 20px;
  }
  
  .home__hero-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .home__hero-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 700;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .home__hero-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .home__hero-btn--primary {
    background: #dc2626;
    color: white;
  }
  
  .home__hero-btn--primary:hover {
    background: #b91c1c;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
  }
  
  .home__hero-btn--secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .home__hero-btn--secondary:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
  }
  
  .home__hero-nav {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
    display: flex;
    gap: 0.75rem;
    z-index: 10;
  }
  
  .home__hero-dot {
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.3);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .home__hero-dot--active {
    background: #dc2626;
    width: 40px;
    border-radius: 6px;
  }
  
  .home__content {
    padding-bottom: 4rem;
  }
  
  .home__controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .home__filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    flex: 1;
  }
  
  .home__select {
    padding: 0.75rem 1rem;
    background: #111827;
    border: 1px solid rgba(139, 0, 0, 0.3);
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 180px;
  }
  
  .home__select:hover,
  .home__select:focus {
    outline: none;
    border-color: #dc2626;
  }
  
  .home__view-toggle {
    width: 44px;
    height: 44px;
    background: #111827;
    border: 1px solid rgba(139, 0, 0, 0.3);
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .home__view-toggle:hover {
    border-color: #dc2626;
    background: rgba(220, 38, 38, 0.1);
  }
  
  .home__view-toggle svg {
    width: 20px;
    height: 20px;
  }
  
  .home__section {
    margin-bottom: 4rem;
  }
  
  .home__section-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 2rem;
    font-weight: 900;
    color: #dc2626;
    margin-bottom: 2rem;
    text-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
  }
  
  .home__section-title svg {
    width: 32px;
    height: 32px;
  }
  
  .home__horizontal-scroll {
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 1rem;
    scrollbar-width: thin;
    scrollbar-color: #dc2626 #111827;
  }
  
  .home__horizontal-scroll::-webkit-scrollbar {
    height: 8px;
  }
  
  .home__horizontal-scroll::-webkit-scrollbar-track {
    background: #111827;
    border-radius: 4px;
  }
  
  .home__horizontal-scroll::-webkit-scrollbar-thumb {
    background: #dc2626;
    border-radius: 4px;
  }
  
  .home__horizontal-scroll > * {
    flex: 0 0 250px;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  
  @media (max-width: 768px) {
    .home__hero {
      height: 60vh;
      min-height: 400px;
    }
  
    .home__hero-title {
      font-size: 2rem;
    }
  
    .home__hero-overview {
      font-size: 0.875rem;
    }
  
    .home__hero-content {
      padding: 2rem 1.5rem 2rem;
    }
  
    .home__hero-nav {
      bottom: 1rem;
      right: 1rem;
    }
  
    .home__section-title {
      font-size: 1.5rem;
    }
  
    .home__horizontal-scroll > * {
      flex: 0 0 180px;
    }
  }
  </style>
  