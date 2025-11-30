<template>
  <div class="home-view">
    <!-- Hero Carousel -->
    <section class="hero-section">
      <div v-if="featuredMovies.length > 0" class="hero-carousel">
        <transition name="fade" mode="out-in">
          <div :key="currentSlide" class="hero-slide">
            <div class="hero-slide__backdrop">
              <img
                :src="`https://image.tmdb.org/t/p/original${featuredMovies[currentSlide].backdrop_path}`"
                :alt="featuredMovies[currentSlide].title"
                class="hero-slide__image"
              />
              <div class="hero-slide__gradient"></div>
            </div>

            <div class="hero-slide__content">
              <div class="container">
                <h1 class="hero-slide__title">{{ featuredMovies[currentSlide].title }}</h1>
                <p class="hero-slide__overview">{{ featuredMovies[currentSlide].overview }}</p>

                <div class="hero-slide__meta">
                  <span class="hero-slide__rating">
                    ⭐ {{ featuredMovies[currentSlide].vote_average.toFixed(1) }}
                  </span>
                  <span class="hero-slide__year">
                    {{ new Date(featuredMovies[currentSlide].release_date).getFullYear() }}
                  </span>
                </div>

                <div class="hero-slide__actions">
                  <router-link
                    :to="`/movie/${featuredMovies[currentSlide].id}`"
                    class="hero-slide__button hero-slide__button--play"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Ver Detalhes
                  </router-link>

                  <button
                    @click.stop="handleToggleFavorite(featuredMovies[currentSlide])"
                    class="hero-slide__button hero-slide__button--info"
                    :class="{ 'hero-slide__button--favorited': isFavorited(featuredMovies[currentSlide].id) }"
                  >
                    <svg v-if="isFavorited(featuredMovies[currentSlide].id)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    {{ isFavorited(featuredMovies[currentSlide].id) ? 'Adicionado' : 'Adicionar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Indicadores -->
        <div class="hero-carousel__indicators">
          <button
            v-for="(movie, index) in featuredMovies"
            :key="movie.id"
            @click="currentSlide = index"
            class="hero-carousel__indicator"
            :class="{ 'hero-carousel__indicator--active': index === currentSlide }"
          ></button>
        </div>
      </div>

      <LoadingScreen v-else message="Carregando destaques..." />
    </section>

    <!-- Movie Sections -->
    <section class="movie-sections">
      <div class="container">
        <!-- Clássicos do Terror -->
        <div class="section-group" v-if="classicHorrorMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            </div>
            <h2 class="section-title">
              Clássicos do Terror
              <button @click="toggleSection('classicos')" class="section-title__link">
                {{ expandedSections.classicos ? 'Ver Menos' : 'Ver Tudo' }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedSections.classicos ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row" :class="{ 'movies-row--expanded': expandedSections.classicos }">
            <MovieCard
              v-for="movie in (expandedSections.classicos ? classicHorrorMovies : classicHorrorMovies.slice(0, 15))"
              :key="movie.id"
              :movie="movie"
              class="movie-card-small"
            />
          </div>
        </div>

        <!-- Lançamentos Recentes -->
        <div class="section-group" v-if="recentMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <h2 class="section-title">
              Lançamentos Recentes
              <button @click="toggleSection('recentes')" class="section-title__link">
                {{ expandedSections.recentes ? 'Ver Menos' : 'Ver Tudo' }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedSections.recentes ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row" :class="{ 'movies-row--expanded': expandedSections.recentes }">
            <MovieCard
              v-for="movie in (expandedSections.recentes ? recentMovies : recentMovies.slice(0, 15))"
              :key="movie.id"
              :movie="movie"
              class="movie-card-small"
            />
          </div>
        </div>

        <!-- Em Alta Agora -->
        <div class="section-group" v-if="displayTrendingMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 0.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
            </div>
            <h2 class="section-title">
              Em Alta Agora
              <button @click="toggleSection('trending')" class="section-title__link">
                {{ expandedSections.trending ? 'Ver Menos' : 'Ver Tudo' }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedSections.trending ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row" :class="{ 'movies-row--expanded': expandedSections.trending }">
            <MovieCard
              v-for="movie in (expandedSections.trending ? displayTrendingMovies : displayTrendingMovies.slice(0, 15))"
              :key="movie.id"
              :movie="movie"
              class="movie-card-small"
            />
          </div>
        </div>

        <!-- Terror dos Anos 80 -->
        <div class="section-group" v-if="moviesFrom80s.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <h2 class="section-title">
              Terror dos Anos 80
              <button @click="toggleSection('anos80')" class="section-title__link">
                {{ expandedSections.anos80 ? 'Ver Menos' : 'Ver Tudo' }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedSections.anos80 ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row" :class="{ 'movies-row--expanded': expandedSections.anos80 }">
            <MovieCard
              v-for="movie in (expandedSections.anos80 ? moviesFrom80s : moviesFrom80s.slice(0, 15))"
              :key="movie.id"
              :movie="movie"
              class="movie-card-small"
            />
          </div>
        </div>

        <!-- Terror dos Anos 90 -->
        <div class="section-group" v-if="moviesFrom90s.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <h2 class="section-title">
              Terror dos Anos 90
              <button @click="toggleSection('anos90')" class="section-title__link">
                {{ expandedSections.anos90 ? 'Ver Menos' : 'Ver Tudo' }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedSections.anos90 ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row" :class="{ 'movies-row--expanded': expandedSections.anos90 }">
            <MovieCard
              v-for="movie in (expandedSections.anos90 ? moviesFrom90s : moviesFrom90s.slice(0, 15))"
              :key="movie.id"
              :movie="movie"
              class="movie-card-small"
            />
          </div>
        </div>

        <!-- Mais Bem Avaliados -->
        <div class="section-group" v-if="highRatedMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
              </svg>
            </div>
            <h2 class="section-title">
              Mais Bem Avaliados
              <button @click="toggleSection('topRated')" class="section-title__link">
                {{ expandedSections.topRated ? 'Ver Menos' : 'Ver Tudo' }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedSections.topRated ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row" :class="{ 'movies-row--expanded': expandedSections.topRated }">
            <MovieCard
              v-for="movie in (expandedSections.topRated ? highRatedMovies : highRatedMovies.slice(0, 15))"
              :key="movie.id"
              :movie="movie"
              class="movie-card-small"
            />
          </div>
        </div>

        <!-- Populares -->
        <div class="section-group" v-if="popularMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <h2 class="section-title">
              Populares
              <button @click="toggleSection('populares')" class="section-title__link">
                {{ expandedSections.populares ? 'Ver Menos' : 'Ver Tudo' }}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline :points="expandedSections.populares ? '18 15 12 9 6 15' : '9 18 15 12 9 6'"/>
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row" :class="{ 'movies-row--expanded': expandedSections.populares }">
            <MovieCard
              v-for="movie in (expandedSections.populares ? popularMovies : popularMovies.slice(0, 15))"
              :key="movie.id"
              :movie="movie"
              class="movie-card-small"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useMovieStore } from '@/stores/movie';
import { useGenreStore } from '@/stores/genre';
import { useFavoritesStore } from '@/stores/favorites';
import { useFavorites } from '@/composables/useFavorites';
import MovieCard from '@/components/movie/MovieCard.vue';
import LoadingScreen from '@/components/layout/LoadingScreen.vue';

const movieStore = useMovieStore();
const genreStore = useGenreStore();
const favoritesStore = useFavoritesStore();
const { toggleFavorite } = useFavorites();

// Lista de IDs de filmes bloqueados
const BLOCKED_MOVIE_IDS = [203101, 1481331, 1084222];

const featuredMovies = ref([]);
const allMovies = ref([]);
const currentSlide = ref(0);
const expandedSections = ref({
  classicos: false,
  recentes: false,
  trending: false,
  anos80: false,
  anos90: false,
  topRated: false,
  populares: false
});
let carouselInterval = null;

// Função para filtrar filmes de qualidade
const isQualityMovie = (movie) => {
  return (
    movie.backdrop_path &&
    movie.poster_path &&
    movie.overview &&
    movie.overview.trim().length > 20 &&
    !BLOCKED_MOVIE_IDS.includes(movie.id)
  );
};

// Verificar se filme está favoritado
const isFavorited = (movieId) => {
  return favoritesStore.favorites.some(fav => fav.id === movieId);
};

// Função para favoritar no carrossel
const handleToggleFavorite = async (movie) => {
  await toggleFavorite(movie);
};

// Toggle de expansão de seções
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// Seção: Clássicos do Terror - CRITÉRIOS MUITO REDUZIDOS
const classicHorrorMovies = computed(() => {
  return allMovies.value
    .filter(m => {
      if (!isQualityMovie(m)) return false;
      const year = new Date(m.release_date).getFullYear();
      // Reduzido: rating >= 6.0 (era 7.0), ano < 2015 (era 2010)
      return m.vote_average >= 6.0 && year >= 1970 && year < 2015;
    })
    .sort((a, b) => b.vote_average - a.vote_average);
});

// Seção: Lançamentos Recentes (2018-2025)
const recentMovies = computed(() => {
  const currentYear = new Date().getFullYear();
  return allMovies.value
    .filter(m => {
      if (!isQualityMovie(m)) return false;
      const year = new Date(m.release_date).getFullYear();
      return year >= 2018 && year <= currentYear; // Reduzido de 2020
    })
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
});

// Seção: Em Alta Agora (trending) - SEM FILTRO DE QUALIDADE RÍGIDO
const displayTrendingMovies = computed(() => {
  return movieStore.trendingMovies.filter(m => {
    return (
      m.backdrop_path &&
      m.poster_path &&
      m.overview &&
      !BLOCKED_MOVIE_IDS.includes(m.id)
    );
  });
});

// Seção: Anos 80 (1980-1989)
const moviesFrom80s = computed(() => {
  return allMovies.value
    .filter(m => {
      if (!isQualityMovie(m)) return false;
      const year = new Date(m.release_date).getFullYear();
      return year >= 1980 && year <= 1989;
    })
    .sort((a, b) => b.vote_average - a.vote_average);
});

// Seção: Anos 90 (1990-1999)
const moviesFrom90s = computed(() => {
  return allMovies.value
    .filter(m => {
      if (!isQualityMovie(m)) return false;
      const year = new Date(m.release_date).getFullYear();
      return year >= 1990 && year <= 1999;
    })
    .sort((a, b) => b.vote_average - a.vote_average);
});

// Seção: Mais Bem Avaliados (rating >= 6.0) - CRITÉRIO REDUZIDO
const highRatedMovies = computed(() => {
  return allMovies.value
    .filter(m => isQualityMovie(m) && m.vote_average >= 6.0) // Era 6.5
    .sort((a, b) => b.vote_average - a.vote_average);
});

// Seção: Populares (por popularidade)
const popularMovies = computed(() => {
  return allMovies.value
    .filter(isQualityMovie)
    .sort((a, b) => b.popularity - a.popularity);
});

const startCarousel = () => {
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % featuredMovies.value.length;
  }, 5000);
};

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
};

onMounted(async () => {
  try {
    // Carregar filmes populares para o carrossel
    await movieStore.getPopularHorrorMovies();
    const popularFiltered = movieStore.popularMovies.filter(isQualityMovie);
    featuredMovies.value = popularFiltered.slice(0, 5);

    // Carregar filmes em alta (trending)
    await movieStore.getTrendingHorrorMovies();

    // Carregar clássicos (top rated)
    await movieStore.getTopRatedHorrorMovies();

    // Carregar gêneros
    await genreStore.getAllGenres('movie');

    // Carregar múltiplas páginas de filmes de terror (100 filmes)
    for (let page = 1; page <= 5; page++) {
      await movieStore.getHorrorMovies(page);
      const newMovies = movieStore.movies.filter(
        m => !allMovies.value.some(existing => existing.id === m.id)
      );
      allMovies.value.push(...newMovies);
    }

    startCarousel();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
});


onUnmounted(() => {
  stopCarousel();
});
</script>

<style scoped>
.home-view {
  position: relative;
}

/* ==================== HERO SECTION ==================== */
.hero-section {
  position: relative;
  margin-top: -70px;
  height: 100vh;
  min-height: 600px;
  background: rgb(20, 20, 20);
}

.hero-carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: rgb(20, 20, 20)
}

.hero-slide {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hero-slide__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hero-slide__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.hero-slide__gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, transparent, rgba(20, 20, 20, 0.9) 80%, rgb(20, 20, 20) 100%);
}

.hero-slide__content {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  z-index: 2;
  color: #fff;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4%;
}

.hero-slide__title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.1;
}

.hero-slide__overview {
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 600px;
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.hero-slide__meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.hero-slide__rating,
.hero-slide__year {
  font-weight: 600;
}

.hero-slide__actions {
  display: flex;
  gap: 1rem;
}

.hero-slide__button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
  font-weight: 700;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.hero-slide__button svg {
  width: 24px;
  height: 24px;
}

.hero-slide__button--play {
  background: #fff;
  color: #000;
}

.hero-slide__button--play:hover {
  background: rgba(255, 255, 255, 0.85);
}

.hero-slide__button--info {
  background: rgba(109, 109, 110, 0.7);
  color: #fff;
}

.hero-slide__button--info:hover {
  background: rgba(109, 109, 110, 0.5);
}

.hero-slide__button--favorited {
  background: #e50914 !important;
  color: #fff !important;
}

.hero-slide__button--favorited:hover {
  background: #b20710 !important;
}

.hero-carousel__indicators {
  position: absolute;
  bottom: 5%;
  right: 4%;
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.hero-carousel__indicator {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.hero-carousel__indicator--active {
  background: #e50914;
  transform: scale(1.2);
}

/* ==================== MOVIE SECTIONS ==================== */
.movie-sections {
  position: relative;
  z-index: 1;
  background: rgb(20, 20, 20);
  padding: 3rem 0;
}

.section-group {
  margin-bottom: 4rem;
}

.section-header-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  width: 32px;
  height: 32px;
  color: #e50914;
}

.section-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.section-title__link {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #e5e5e5;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;
  position: absolute;
  left: 100%;
  margin-left: 1rem;
  white-space: nowrap;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.section-title:hover .section-title__link {
  opacity: 1;
}

.section-title__link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.section-title__link svg {
  width: 16px;
  height: 16px;
}

.movies-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: thin;
  scrollbar-color: #e50914 #1a1a1a;
  transition: all 0.3s;
}

.movies-row--expanded {
  flex-wrap: wrap;
  overflow-x: visible;
}

.movies-row::-webkit-scrollbar {
  height: 8px;
}

.movies-row::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.movies-row::-webkit-scrollbar-thumb {
  background: #e50914;
  border-radius: 4px;
}

.movie-card-small {
  flex: 0 0 200px;
}

/* ==================== TRANSITIONS ==================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* ==================== FIX PARA HOVER ==================== */
.movie-sections {
  position: relative;
  z-index: 1;
  background: rgb(20, 20, 20);
  padding: 3rem 0;
  overflow: visible !important; /* ✅ CRUCIAL */
}

.section-group {
  margin-bottom: 4rem;
  overflow: visible !important; /* ✅ IMPORTANTE */
}

.movies-row {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: visible; /* ✅ Permite hover expandir verticalmente */
  padding: 2rem 0; /* ✅ Padding para não cortar */
  scrollbar-width: thin;
  scrollbar-color: #e50914 #1a1a1a;
  transition: all 0.3s;
}

.movies-row--expanded {
  flex-wrap: wrap;
  overflow-x: visible;
  overflow-y: visible; /* ✅ Importante */
}

.movie-card-small {
  flex: 0 0 200px;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .hero-section {
    min-height: 500px;
  }

  .hero-slide__title {
    font-size: 2rem;
  }

  .hero-slide__overview {
    font-size: 0.9375rem;
    max-width: 100%;
  }

  .hero-slide__button {
    padding: 0.625rem 1.5rem;
    font-size: 1rem;
  }

  .movie-card-small {
    flex: 0 0 150px;
  }

  .section-icon {
    width: 28px;
    height: 28px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .section-title__link {
    position: static;
    margin-left: 0;
    opacity: 1;
  }
}
</style>
