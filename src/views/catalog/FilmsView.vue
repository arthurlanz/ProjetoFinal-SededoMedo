<template>
  <div class="films-view">
    <!-- Hero Carousel -->
    <section class="films-hero">
      <Transition name="fade" mode="out-in">
        <div
          v-if="featuredMovies.length > 0"
          :key="currentSlide"
          class="films-hero__slide"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovies[currentSlide]?.backdrop_path})`
          }"
        >
          <div class="films-hero__overlay"></div>

          <!-- Info à esquerda -->
          <div class="films-hero__info">
            <h1 class="films-hero__title">{{ featuredMovies[currentSlide]?.title }}</h1>
            <router-link
              :to="`/movie/${featuredMovies[currentSlide]?.id}`"
              class="films-hero__btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Ver Detalhes
            </router-link>
          </div>
        </div>
      </Transition>

      <!-- Indicators -->
      <div v-if="featuredMovies.length > 0" class="films-hero__indicators">
        <button
          v-for="(movie, index) in featuredMovies"
          :key="movie.id"
          @click="goToSlide(index)"
          :class="['films-hero__indicator', { 'films-hero__indicator--active': index === currentSlide }]"
        ></button>
      </div>
    </section>

    <!-- Filters -->
    <section class="films-filters">
      <div class="container">
        <div class="films-filters__wrapper">
          <div class="films-filters__group">
            <label class="films-filters__label">Ordenar por:</label>
            <select v-model="sortBy" @change="handleSortChange" class="films-filters__select">
              <option value="popularity.desc">Mais Populares</option>
              <option value="vote_average.desc">Melhor Avaliados</option>
              <option value="primary_release_date.desc">Mais Recentes</option>
              <option value="revenue.desc">Maior Bilheteria</option>
            </select>
          </div>

          <div class="films-filters__group">
            <label class="films-filters__label">Ano:</label>
            <select v-model="selectedYear" @change="handleYearChange" class="films-filters__select">
              <option value="">Todos</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <div class="films-filters__group">
            <label class="films-filters__label">Avaliação:</label>
            <select v-model="minRating" @change="handleRatingChange" class="films-filters__select">
              <option value="">Todas</option>
              <option value="8">8+ ⭐</option>
              <option value="7">7+ ⭐</option>
              <option value="6">6+ ⭐</option>
              <option value="5">5+ ⭐</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Movies Grid -->
    <section class="films-content">
      <div class="container">
        <LoadingScreen v-if="loading" :loading="loading" text="Carregando filmes..." />

        <div v-else-if="movies.length > 0" class="films-grid">
          <MovieCard
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            view-mode="grid"
          />
        </div>

        <div v-else class="films-empty">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
            <line x1="7" y1="2" x2="7" y2="22"/>
            <line x1="17" y1="2" x2="17" y2="22"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="2" y1="7" x2="7" y2="7"/>
            <line x1="2" y1="17" x2="7" y2="17"/>
            <line x1="17" y1="17" x2="22" y2="17"/>
            <line x1="17" y1="7" x2="22" y2="7"/>
          </svg>
          <p>Nenhum filme encontrado com esses filtros.</p>
        </div>

        <!-- Load More Button -->
        <div v-if="movies.length > 0 && !loading" class="films-load-more">
          <button @click="loadMore" :disabled="loadingMore" class="films-load-more__btn">
            <span v-if="!loadingMore">Carregar Mais</span>
            <span v-else>Carregando...</span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMovieStore } from '@/stores/movie'
import MovieCard from '@/components/movie/MovieCard.vue'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'

const movieStore = useMovieStore()

const movies = ref([])
const featuredMovies = ref([])
const currentSlide = ref(0)
const loading = ref(true)
const loadingMore = ref(false)
const currentPage = ref(1)
const sortBy = ref('popularity.desc')
const selectedYear = ref('')
const minRating = ref('')

let carouselInterval = null

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1959 }, (_, i) => currentYear - i)

const fetchMovies = async (page = 1) => {
  try {
    const params = {
      with_genres: 27,
      sort_by: sortBy.value,
      page,
      'vote_count.gte': 100,
    }

    if (selectedYear.value) {
      params.primary_release_year = selectedYear.value
    }

    if (minRating.value) {
      params['vote_average.gte'] = minRating.value
    }

    const response = await movieStore.discoverMovies(params)
    return response
  } catch (error) {
    console.error('Erro ao buscar filmes:', error)
    return []
  }
}

const fetchFeaturedMovies = async () => {
  try {
    const response = await movieStore.discoverMovies({
      with_genres: 27,
      sort_by: 'popularity.desc',
      page: 1,
      'vote_count.gte': 500,
    })
    featuredMovies.value = response.slice(0, 5)
  } catch (error) {
    console.error('Erro ao buscar filmes em destaque:', error)
  }
}

const loadMovies = async () => {
  loading.value = true
  currentPage.value = 1
  movies.value = await fetchMovies(1)
  loading.value = false
}

const loadMore = async () => {
  loadingMore.value = true
  currentPage.value++
  const newMovies = await fetchMovies(currentPage.value)
  movies.value = [...movies.value, ...newMovies]
  loadingMore.value = false
}

const handleSortChange = () => {
  loadMovies()
}

const handleYearChange = () => {
  loadMovies()
}

const handleRatingChange = () => {
  loadMovies()
}

const startCarousel = () => {
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % featuredMovies.value.length
  }, 5000)
}

const stopCarousel = () => {
  if (carouselInterval) {
    clearInterval(carouselInterval)
  }
}

const goToSlide = (index) => {
  stopCarousel()
  currentSlide.value = index
  startCarousel()
}

onMounted(async () => {
  await Promise.all([
    fetchFeaturedMovies(),
    loadMovies()
  ])
  startCarousel()
})

onBeforeUnmount(() => {
  stopCarousel()
})
</script>

<style scoped>
.films-view {
  min-height: 100vh;
  background: rgb(20, 20, 20);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ==================== HERO CAROUSEL ==================== */
.films-hero {
  position: relative;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
}

.films-hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.films-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(20, 20, 20, 0.98) 0%,
    rgba(20, 20, 20, 0.8) 30%,
    rgba(20, 20, 20, 0.3) 60%,
    transparent 100%
  ),
  linear-gradient(
    to top,
    rgba(20, 20, 20, 1) 0%,
    transparent 40%
  );
}

/* Info à esquerda */
.films-hero__info {
  position: absolute;
  left: 8%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  max-width: 500px;
}

.films-hero__title {
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 2rem;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.9);
  line-height: 1;
  letter-spacing: -2px;
}

.films-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.8rem;
  background: #dc2626;
  color: #fff;
  border-radius: 0.7rem;
  font-size: 1.145rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
}

.films-hero__btn:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(220, 38, 38, 0.6);
}

.films-hero__btn svg {
  width: 24px;
  height: 24px;
}

/* Indicators */
.films-hero__indicators {
  position: absolute;
  bottom: 1rem;
  right: 4%;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
}

.films-hero__indicator {
  width: 50px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.films-hero__indicator--active {
  background: #dc2626;
  width: 70px;
}

.films-hero__indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* ==================== FILTERS ==================== */
.films-filters {
  background: rgba(20, 20, 20, 0.95);
  padding: 2rem 0;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 70px;
  z-index:50;
}

.films-filters__wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.films-filters__group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.films-filters__label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.films-filters__select {
  padding: 0.75rem 1rem;
  background: rgba(32, 31, 31, 0.8);
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.films-filters__select:hover {
  border-color: #dc2626;
  background: rgba(32, 31, 31, 1);
}

.films-filters__select:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

/* ==================== CONTENT ==================== */
.films-content {
  padding: 4rem 0;
}

.films-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.films-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.films-empty svg {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  opacity: 0.3;
}

.films-empty p {
  font-size: 1.125rem;
}

/* ==================== LOAD MORE ==================== */
.films-load-more {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}

.films-load-more__btn {
  padding: 1rem 3rem;
  background: rgba(220, 38, 38, 0.9);
  border: 2px solid transparent;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.films-load-more__btn:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.films-load-more__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== TRANSITIONS ==================== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1024px) {
  .films-hero__title {
    font-size: 3.5rem;
  }
}

@media (max-width: 768px) {
  .films-hero {
    height: 60vh;
    min-height: 400px;
  }

  .films-hero__info {
    left: 2rem;
    right: 2rem;
    max-width: none;
  }

  .films-hero__title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .films-hero__btn {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  .films-hero__indicators {
    bottom: 1rem;
    right: 2rem;
  }

  .films-filters__wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .films-filters__group {
    flex-direction: column;
    align-items: stretch;
  }

  .films-filters__select {
    width: 100%;
  }

  .films-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .films-hero__title {
    font-size: 2rem;
  }

  .films-hero__btn {
    padding: 0.875rem 1.75rem;
    font-size: 0.875rem;
  }

  .films-hero__btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>
