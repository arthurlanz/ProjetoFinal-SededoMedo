<template>
  <div class="series-view">
    <!-- Hero Carousel -->
    <section class="series-hero">
      <Transition name="fade" mode="out-in">
        <div
          v-if="featuredSeries.length > 0"
          :key="currentSlide"
          class="series-hero__slide"
          :style="{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredSeries[currentSlide]?.backdrop_path})`
          }"
        >
          <div class="series-hero__overlay"></div>

          <!-- Info à esquerda -->
          <div class="series-hero__info">
            <h1 class="series-hero__title">{{ featuredSeries[currentSlide]?.name }}</h1>
            <router-link
              :to="{ name: 'series-detail', params: { id: featuredSeries[currentSlide]?.id } }"
              class="series-hero__btn"
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
      <div v-if="featuredSeries.length > 0" class="series-hero__indicators">
        <button
          v-for="(show, index) in featuredSeries"
          :key="show.id"
          @click="goToSlide(index)"
          :class="['series-hero__indicator', { 'series-hero__indicator--active': index === currentSlide }]"
        ></button>
      </div>
    </section>

    <!-- Filters -->
    <section class="series-filters">
      <div class="container">
        <div class="series-filters__wrapper">
          <div class="series-filters__group">
            <label class="series-filters__label">Ordenar por:</label>
            <select v-model="sortBy" @change="handleSortChange" class="series-filters__select">
              <option value="popularity.desc">Mais Populares</option>
              <option value="vote_average.desc">Melhor Avaliadas</option>
              <option value="first_air_date.desc">Mais Recentes</option>
            </select>
          </div>

          <div class="series-filters__group">
            <label class="series-filters__label">Gênero:</label>
            <select v-model="selectedGenre" @change="handleGenreChange" class="series-filters__select">
              <option value="9648">Mistério</option>
              <option value="80">Crime</option>
              <option value="18">Drama</option>
              <option value="10765">Sci-Fi & Fantasy</option>
            </select>
          </div>

          <div class="series-filters__group">
            <label class="series-filters__label">Ano:</label>
            <select v-model="selectedYear" @change="handleYearChange" class="series-filters__select">
              <option value="">Todos</option>
              <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>

          <div class="series-filters__group">
            <label class="series-filters__label">Avaliação:</label>
            <select v-model="minRating" @change="handleRatingChange" class="series-filters__select">
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

    <!-- Series Grid -->
    <section class="series-content">
      <div class="container">
        <LoadingScreen v-if="loading" :loading="loading" text="Carregando séries..." />

        <div v-else-if="seriesList.length > 0" class="series-grid">
          <SeriesCard
            v-for="show in seriesList"
            :key="show.id"
            :series="show"
          />
        </div>

        <div v-else class="series-empty">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
            <polyline points="17 2 12 7 7 2"/>
          </svg>
          <p>Nenhuma série encontrada com esses filtros.</p>
        </div>

        <!-- Load More Button -->
        <div v-if="seriesList.length > 0 && !loading" class="series-load-more">
          <button @click="loadMore" :disabled="loadingMore" class="series-load-more__btn">
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
import api from '@/plugins/axios'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'
import SeriesCard from '@/components/series/SeriesCard.vue'

const seriesList = ref([])
const featuredSeries = ref([])
const currentSlide = ref(0)
const loading = ref(true)
const loadingMore = ref(false)
const currentPage = ref(1)
const sortBy = ref('popularity.desc')
const selectedGenre = ref('9648') // Mistério por padrão
const selectedYear = ref('')
const minRating = ref('')

let carouselInterval = null

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1959 }, (_, i) => currentYear - i)

const fetchSeries = async (page = 1) => {
  try {
    const params = {
      with_genres: selectedGenre.value,
      sort_by: sortBy.value,
      page,
      'vote_count.gte': 50,
      language: 'pt-BR',
    }

    if (selectedYear.value) {
      params.first_air_date_year = selectedYear.value
    }

    if (minRating.value) {
      params['vote_average.gte'] = minRating.value
    }

    const response = await api.get('discover/tv', { params })
    return response.data.results || []
  } catch (error) {
    console.error('❌ Erro ao buscar séries:', error)
    return []
  }
}

const fetchFeaturedSeries = async () => {
  try {
    const response = await api.get('discover/tv', {
      params: {
        with_genres: '9648', // Mistério
        sort_by: 'popularity.desc',
        page: 1,
        'vote_count.gte': 300,
        language: 'pt-BR',
      }
    })
    featuredSeries.value = response.data.results.slice(0, 5)
    console.log('🎬 Séries em destaque:', featuredSeries.value.length)
  } catch (error) {
    console.error('❌ Erro ao buscar séries em destaque:', error)
  }
}

const loadSeries = async () => {
  loading.value = true
  currentPage.value = 1
  seriesList.value = await fetchSeries(1)
  loading.value = false
}

const loadMore = async () => {
  loadingMore.value = true
  currentPage.value++
  const newSeries = await fetchSeries(currentPage.value)
  seriesList.value = [...seriesList.value, ...newSeries]
  loadingMore.value = false
}

const handleSortChange = () => {
  loadSeries()
}

const handleGenreChange = () => {
  loadSeries()
}

const handleYearChange = () => {
  loadSeries()
}

const handleRatingChange = () => {
  loadSeries()
}

const startCarousel = () => {
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % featuredSeries.value.length
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
  console.log('🚀 SeriesView montado, carregando séries de Mistério...')
  await Promise.all([
    fetchFeaturedSeries(),
    loadSeries()
  ])
  startCarousel()
})

onBeforeUnmount(() => {
  stopCarousel()
})
</script>

<style scoped>
/* Estilos permanecem iguais ao original */
.series-view {
  min-height: 100vh;
  background: rgb(20, 20, 20);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* HERO CAROUSEL */
.series-hero {
  position: relative;
  height: 70vh;
  min-height: 500px;
  overflow: hidden;
}

.series-hero__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

.series-hero__overlay {
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

/* Info esquerda */
.series-hero__info {
  position: absolute;
  left: 8%;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  max-width: 500px;
}

.series-hero__title {
  font-size: 3rem;
  font-weight: 900;
  color: #fff;
  margin-bottom: 2rem;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.9);
  line-height: 1;
  letter-spacing: -2px;
}

.series-hero__btn {
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

.series-hero__btn:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(220, 38, 38, 0.6);
}

.series-hero__btn svg {
  width: 24px;
  height: 24px;
}

/* Indicators */
.series-hero__indicators {
  position: absolute;
  bottom: 1rem;
  right: 4%;
  z-index: 10;
  display: flex;
  gap: 0.5rem;
}

.series-hero__indicator {
  width: 50px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.series-hero__indicator--active {
  background: #dc2626;
  width: 70px;
}

.series-hero__indicator:hover {
  background: rgba(255, 255, 255, 0.5);
}

/* FILTERS */
.series-filters {
  background: rgba(20, 20, 20, 0.95);
  padding: 2rem 0;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 70px;
  z-index: 50;
}

.series-filters__wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.series-filters__group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.series-filters__label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
}

.series-filters__select {
  padding: 0.75rem 1rem;
  background: rgba(32, 31, 31, 0.8);
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.series-filters__select:hover {
  border-color: #dc2626;
  background: rgba(32, 31, 31, 1);
}

.series-filters__select:focus {
  outline: none;
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.1);
}

/* CONTENT */
.series-content {
  padding: 4rem 0;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.series-empty {
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.5);
}

.series-empty svg {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  opacity: 0.3;
}

.series-empty p {
  font-size: 1.125rem;
}

/* LOAD MORE */
.series-load-more {
  display: flex;
  justify-content: center;
  margin-top: 4rem;
}

.series-load-more__btn {
  padding: 1rem 3rem;
  background: #dc2626;
  border: 2px solid transparent;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.series-load-more__btn:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2620;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.series-load-more__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .series-hero__title {
    font-size: 3.5rem;
  }
}

@media (max-width: 768px) {
  .series-hero {
    height: 60vh;
    min-height: 400px;
  }

  .series-hero__info {
    left: 2rem;
    right: 2rem;
    max-width: none;
  }

  .series-hero__title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .series-hero__btn {
    padding: 1rem 2rem;
    font-size: 1rem;
  }

  .series-hero__indicators {
    bottom: 1rem;
    right: 2rem;
  }

  .series-filters__wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .series-filters__group {
    flex-direction: column;
    align-items: stretch;
  }

  .series-filters__select {
    width: 100%;
  }

  .series-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .series-hero__title {
    font-size: 2rem;
  }

  .series-hero__btn {
    padding: 0.875rem 1.75rem;
    font-size: 0.875rem;
  }

  .series-hero__btn svg {
    width: 20px;
    height: 20px;
  }
}
</style>
