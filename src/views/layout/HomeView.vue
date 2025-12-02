<template>
  <div class="home-view">
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
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Ver Detalhes
                  </router-link>

                  <button
                    @click.stop="handleToggleFavorite(featuredMovies[currentSlide])"
                    class="hero-slide__button hero-slide__button--info"
                    :class="{
                      'hero-slide__button--favorited': isFavorited(featuredMovies[currentSlide].id),
                    }"
                  >
                    <svg
                      v-if="isFavorited(featuredMovies[currentSlide].id)"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                      />
                    </svg>
                    {{ isFavorited(featuredMovies[currentSlide].id) ? 'Adicionado' : 'Adicionar' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>

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

    <section class="movie-sections">
      <div class="container">
        <div class="section-group" v-if="classicHorrorMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </svg>
            </div>
            <h2 class="section-title">
              Clássicos do Terror
              <button
                @click="openModal('Clássicos do Terror', classicHorrorMovies)"
                class="section-title__link"
              >
                Ver Tudo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row-wrapper">
            <button
              class="carousel-arrow carousel-arrow--left"
              @click="scrollCarousel('classic', 'left')"
              v-show="carouselScrollPositions.classic > 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <div class="movies-row" ref="classicRow">
              <MovieCard
                v-for="(movie, index) in classicHorrorMovies.slice(0, 50)"
                :key="movie.id"
                :movie="movie"
                :index="index"
                :total-cards="50"
                class="movie-card-small"
              />
            </div>
            <button
              class="carousel-arrow carousel-arrow--right"
              @click="scrollCarousel('classic', 'right')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="section-group" v-if="recentMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"
                />
              </svg>
            </div>
            <h2 class="section-title">
              Lançamentos Recentes
              <button
                @click="openModal('Lançamentos Recentes', recentMovies)"
                class="section-title__link"
              >
                Ver Tudo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row-wrapper">
            <button
              class="carousel-arrow carousel-arrow--left"
              @click="scrollCarousel('recent', 'left')"
              v-show="carouselScrollPositions.recent > 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <div class="movies-row" ref="recentRow">
              <MovieCard
                v-for="(movie, index) in recentMovies.slice(0, 50)"
                :key="movie.id"
                :movie="movie"
                :index="index"
                :total-cards="50"
                class="movie-card-small"
              />
            </div>
            <button
              class="carousel-arrow carousel-arrow--right"
              @click="scrollCarousel('recent', 'right')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="section-group" v-if="moviesFrom80s.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </svg>
            </div>
            <h2 class="section-title">
              Terror dos Anos 80
              <button
                @click="openModal('Terror dos Anos 80', moviesFrom80s, true)"
                class="section-title__link"
              >
                Ver Tudo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row-wrapper">
            <button
              class="carousel-arrow carousel-arrow--left"
              @click="scrollCarousel('80s', 'left')"
              v-show="carouselScrollPositions['80s'] > 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <div class="movies-row" ref="row80s">
              <MovieCard
                v-for="(movie, index) in moviesFrom80s.slice(0, 50)"
                :key="movie.id"
                :movie="movie"
                :index="index"
                :total-cards="50"
                class="movie-card-small"
              />
            </div>
            <button
              class="carousel-arrow carousel-arrow--right"
              @click="scrollCarousel('80s', 'right')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="section-group" v-if="moviesFrom90s.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                />
              </svg>
            </div>
            <h2 class="section-title">
              Terror dos Anos 90
              <button
                @click="openModal('Terror dos Anos 90', moviesFrom90s, true)"
                class="section-title__link"
              >
                Ver Tudo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row-wrapper">
            <button
              class="carousel-arrow carousel-arrow--left"
              @click="scrollCarousel('90s', 'left')"
              v-show="carouselScrollPositions['90s'] > 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <div class="movies-row" ref="row90s">
              <MovieCard
                v-for="(movie, index) in moviesFrom90s.slice(0, 50)"
                :key="movie.id"
                :movie="movie"
                :index="index"
                :total-cards="50"
                class="movie-card-small"
              />
            </div>
            <button
              class="carousel-arrow carousel-arrow--right"
              @click="scrollCarousel('90s', 'right')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="section-group" v-if="highRatedMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
                />
              </svg>
            </div>
            <h2 class="section-title">
              Mais Bem Avaliados
              <button
                @click="openModal('Mais Bem Avaliados', highRatedMovies)"
                class="section-title__link"
              >
                Ver Tudo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row-wrapper">
            <button
              class="carousel-arrow carousel-arrow--left"
              @click="scrollCarousel('rated', 'left')"
              v-show="carouselScrollPositions.rated > 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <div class="movies-row" ref="ratedRow">
              <MovieCard
                v-for="(movie, index) in highRatedMovies.slice(0, 50)"
                :key="movie.id"
                :movie="movie"
                :index="index"
                :total-cards="50"
                class="movie-card-small"
              />
            </div>
            <button
              class="carousel-arrow carousel-arrow--right"
              @click="scrollCarousel('rated', 'right')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>

        <div class="section-group" v-if="popularMovies.length > 0">
          <div class="section-header-wrapper">
            <div class="section-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                />
              </svg>
            </div>
            <h2 class="section-title">
              Populares
              <button @click="openModal('Populares', popularMovies)" class="section-title__link">
                Ver Tudo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </h2>
          </div>
          <div class="movies-row-wrapper">
            <button
              class="carousel-arrow carousel-arrow--left"
              @click="scrollCarousel('popular', 'left')"
              v-show="carouselScrollPositions.popular > 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <div class="movies-row" ref="popularRow">
              <MovieCard
                v-for="(movie, index) in popularMovies.slice(0, 50)"
                :key="movie.id"
                :movie="movie"
                :index="index"
                :total-cards="50"
                class="movie-card-small"
              />
            </div>
            <button
              class="carousel-arrow carousel-arrow--right"
              @click="scrollCarousel('popular', 'right')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="showModal" class="modal-overlay" @click="closeModal">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">{{ modalTitle }}</h2>
              <button @click="closeModal" class="modal-close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div class="modal-filters">
              <div class="filter-group">
                <label class="filter-label">Ordenar por:</label>
                <select v-model="modalFilters.sortBy" class="filter-select">
                  <option value="popularity">Popularidade</option>
                  <option value="rating">Avaliação</option>
                  <option value="release_date">Lançamento</option>
                  <option value="title">Título</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">Avaliação mínima:</label>
                <select v-model="modalFilters.minRating" class="filter-select">
                  <option value="0">Todas</option>
                  <option value="5">5.0+</option>
                  <option value="6">6.0+</option>
                  <option value="7">7.0+</option>
                  <option value="8">8.0+</option>
                  <option value="9">9.0+</option>
                </select>
              </div>

              <div class="filter-group" v-if="!hideYearFilter">
                <label class="filter-label">Ano:</label>
                <select v-model="modalFilters.year" class="filter-select">
                  <option value="">Todos</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2020s">2020-2029</option>
                  <option value="2010s">2010-2019</option>
                  <option value="2000s">2000-2009</option>
                  <option value="1990s">1990-1999</option>
                  <option value="1980s">1980-1989</option>
                  <option value="1970s">1970-1979</option>
                </select>
              </div>
            </div>

            <div class="modal-grid">
              <MovieCard
                v-for="(movie, index) in filteredModalMovies"
                :key="movie.id"
                :movie="movie"
                :index="index % 4"
                :total-cards="4"
                class="modal-card"
              />
            </div>

            <div v-if="filteredModalMovies.length === 0" class="modal-empty">
              <p>Nenhum filme encontrado com esses filtros</p>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMovieStore } from '@/stores/movie'
import { useGenreStore } from '@/stores/genre'
import { useFavoritesStore } from '@/stores/favorites'
import { useFavorites } from '@/composables/useFavorites'
import MovieCard from '@/components/movie/MovieCard.vue'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'

const movieStore = useMovieStore()
const genreStore = useGenreStore()
const favoritesStore = useFavoritesStore()
const { toggleFavorite } = useFavorites()

const BLOCKED_MOVIE_IDS = [203101, 1481331, 1084222]

const featuredMovies = ref([])
const allMovies = ref([])
const currentSlide = ref(0)
let carouselInterval = null

const showModal = ref(false)
const modalTitle = ref('')
const modalMovies = ref([])
const hideYearFilter = ref(false)

const modalFilters = ref({
  sortBy: 'popularity',
  minRating: '0',
  year: '',
})

const carouselScrollPositions = ref({
  classic: 0,
  recent: 0,
  trending: 0,
  '80s': 0,
  '90s': 0,
  rated: 0,
  popular: 0,
})

const classicRow = ref(null)
const recentRow = ref(null)
const trendingRow = ref(null)
const row80s = ref(null)
const row90s = ref(null)
const ratedRow = ref(null)
const popularRow = ref(null)

const scrollCarousel = (category, direction) => {
  const rowRefs = {
    classic: classicRow,
    recent: recentRow,
    trending: trendingRow,
    '80s': row80s,
    '90s': row90s,
    rated: ratedRow,
    popular: popularRow,
  }

  const rowRef = rowRefs[category]
  if (!rowRef.value) return

  const scrollAmount = rowRef.value.offsetWidth * 0.8
  const newPosition =
    direction === 'left'
      ? rowRef.value.scrollLeft - scrollAmount
      : rowRef.value.scrollLeft + scrollAmount

  rowRef.value.scrollTo({
    left: newPosition,
    behavior: 'smooth',
  })

  setTimeout(() => {
    carouselScrollPositions.value[category] = rowRef.value.scrollLeft
  }, 300)
}

const isQualityMovie = (movie) => {
  return (
    movie.backdrop_path &&
    movie.poster_path &&
    movie.overview &&
    movie.overview.trim().length > 20 &&
    !BLOCKED_MOVIE_IDS.includes(movie.id)
  )
}

const isFavorited = (movieId) => {
  return favoritesStore.favorites.some((fav) => fav.id === movieId)
}

const handleToggleFavorite = async (movie) => {
  await toggleFavorite(movie)
}

const filteredModalMovies = computed(() => {
  let filtered = [...modalMovies.value]

  const minRating = parseFloat(modalFilters.value.minRating)
  if (minRating > 0) {
    filtered = filtered.filter((m) => m.vote_average >= minRating)
  }

  if (modalFilters.value.year && !hideYearFilter.value) {
    const yearFilter = modalFilters.value.year
    filtered = filtered.filter((m) => {
      if (!m.release_date) return false
      const year = new Date(m.release_date).getFullYear()

      if (yearFilter === '2020s') return year >= 2020 && year <= 2029
      if (yearFilter === '2010s') return year >= 2010 && year <= 2019
      if (yearFilter === '2000s') return year >= 2000 && year <= 2009
      if (yearFilter === '1990s') return year >= 1990 && year <= 1999
      if (yearFilter === '1980s') return year >= 1980 && year <= 1989
      if (yearFilter === '1970s') return year >= 1970 && year <= 1979

      return year === parseInt(yearFilter)
    })
  }

  switch (modalFilters.value.sortBy) {
    case 'rating':
      filtered.sort((a, b) => b.vote_average - a.vote_average)
      break
    case 'release_date':
      filtered.sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
      break
    case 'title':
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'popularity':
    default:
      filtered.sort((a, b) => b.popularity - a.popularity)
      break
  }

  return filtered
})

const openModal = (title, movies, hideYear = false) => {
  modalTitle.value = title
  modalMovies.value = movies
  hideYearFilter.value = hideYear
  modalFilters.value = {
    sortBy: 'popularity',
    minRating: '0',
    year: '',
  }
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  showModal.value = false
  document.body.style.overflow = ''
}

const classicHorrorMovies = computed(() => {
  return allMovies.value
    .filter((m) => {
      if (!isQualityMovie(m)) return false
      const year = new Date(m.release_date).getFullYear()
      return m.vote_average >= 6.0 && year >= 1970 && year < 2015
    })
    .sort((a, b) => b.vote_average - a.vote_average)
})

const recentMovies = computed(() => {
  const currentYear = new Date().getFullYear()
  return allMovies.value
    .filter((m) => {
      if (!isQualityMovie(m)) return false
      const year = new Date(m.release_date).getFullYear()
      return year >= 2018 && year <= currentYear
    })
    .sort((a, b) => new Date(b.release_date) - new Date(a.release_date))
})

const moviesFrom80s = computed(() => {
  return allMovies.value
    .filter((m) => {
      if (!isQualityMovie(m)) return false
      const year = new Date(m.release_date).getFullYear()
      return year >= 1980 && year <= 1989
    })
    .sort((a, b) => b.vote_average - a.vote_average)
})

const moviesFrom90s = computed(() => {
  return allMovies.value
    .filter((m) => {
      if (!isQualityMovie(m)) return false
      const year = new Date(m.release_date).getFullYear()
      return year >= 1990 && year <= 1999
    })
    .sort((a, b) => b.vote_average - a.vote_average)
})

const highRatedMovies = computed(() => {
  return allMovies.value
    .filter((m) => isQualityMovie(m) && m.vote_average >= 6.0)
    .sort((a, b) => b.vote_average - a.vote_average)
})

const popularMovies = computed(() => {
  return allMovies.value.filter(isQualityMovie).sort((a, b) => b.popularity - a.popularity)
})

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

onMounted(async () => {
  try {
    await movieStore.getPopularHorrorMovies()
    const popularFiltered = movieStore.popularMovies.filter(isQualityMovie)
    featuredMovies.value = popularFiltered.slice(0, 5)

    await movieStore.getTrendingHorrorMovies()
    await movieStore.getTopRatedHorrorMovies()
    await genreStore.getAllGenres('movie')

    for (let page = 1; page <= 15; page++) {
      await movieStore.getHorrorMovies(page)
      const newMovies = movieStore.movies.filter(
        (m) => !allMovies.value.some((existing) => existing.id === m.id),
      )
      allMovies.value.push(...newMovies)
    }

    startCarousel()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})

onUnmounted(() => {
  stopCarousel()
  document.body.style.overflow = ''
})
</script>

<style scoped>
.home-view {
  position: relative;
}

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
  height: 120%;
  object-fit: cover;
  object-position: center top;
}

.hero-slide__gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
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

.hero-section .container {
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
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

.movie-sections {
  position: relative;
  z-index: 1;
  background: rgb(20, 20, 20);
  padding: 3rem 0;
  overflow-x: hidden;
  overflow-y: visible;
}

.section-group {
  margin-bottom: 2.5rem;
  overflow: visible;
}

.section-header-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
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

.movies-row-wrapper {
  position: relative;
  overflow: visible;
}

.movies-row-wrapper:hover .carousel-arrow {
  opacity: 1;
}

.movies-row {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 2.5rem 0 4rem 0;
}
.movies-row::-webkit-scrollbar {
  display: none;
}

.movie-card-small {
  flex: 0 0 calc((100% - 2rem) / 5);
  min-width: 160px;
  max-width: 260px;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 100%;
  max-height: 400px;
  border: none;
  cursor: pointer;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: transparent;
}
.carousel-arrow:hover {
 opacity: 1 !important;
}
.movies-row-wrapper:hover .carousel-arrow {
  pointer-events: all;
}
.carousel-arrow svg {
  width: 40px;
  height: 40px;
  color: #fff;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8));
  background: rgba(0, 0, 0, 0.7);
  border-radius: 50%;
  padding: 8px;
}
.carousel-arrow:hover svg {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.15);
}
.carousel-arrow--left {
  left: -30px;
}

.carousel-arrow--right {
  right: -30px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  overflow-y: auto;
}

.modal-content {
  background: #181818;
  border-radius: 8px;
  width: 100%;
  max-width: 1200px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
}

.modal-header {
  position: sticky;
  top: 0;
  background: #181818;
  padding: 2rem 2rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  z-index: 10;
}

.modal-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(255, 0, 0, 0.596);
  transform: scale(1.1);
}

.modal-close svg {
  width: 24px;
  height: 24px;
  color: #fff;
}

.modal-filters {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  color: #aaa;
  font-weight: 600;
}

.filter-select {
  padding: 0.5rem 1rem;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.filter-select:hover {
  border-color: #e50914;
}

.filter-select:focus {
  outline: none;
  border-color: #e50914;
  box-shadow: 0 0 0 2px rgba(229, 9, 20, 0.2);
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 2rem;
}

.modal-card {
  width: 100%;
}

.modal-empty {
  padding: 4rem 2rem;
  text-align: center;
  color: #aaa;
}

.modal-empty p {
  font-size: 1.125rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1200px) {
  .modal-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .movie-card-small {
    flex: 0 0 calc((100% - 1rem) / 4);
  }
}

@media (max-width: 768px) {
  .movies-row-wrapper {
    padding: 0;
    margin: 0;
  }
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
    flex: 0 0 calc((100% - 0.5rem) / 2);
    min-width: 150px;
  }

  .carousel-arrow {
    width: 40px;
  }

  .carousel-arrow svg {
    width: 24px;
    height: 24px;
  }

  .modal-filters {
    padding: 1rem;
    gap: 1rem;
  }

  .filter-select {
    min-width: 120px;
  }

  .modal-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 1.5rem;
  }

  .modal-title {
    font-size: 1.5rem;
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

  .section-group {
    margin-bottom: 2rem;
  }

  .movies-row {
    padding: 1.5rem 0 2.5rem 0;
  }
}

@media (max-width: 480px) {
  .modal-grid {
    grid-template-columns: repeat(1, 1fr);
  }

  .modal-filters {
    flex-direction: column;
  }

  .filter-select {
    min-width: 100%;
  }
  .movie-card-small {
    flex: 0 0 100%;
    min-width: 150px;
    margin: 0 0 0 5vw;
  }
}
</style>
