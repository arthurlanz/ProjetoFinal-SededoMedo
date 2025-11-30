<template>
  <div class="movie-detail">
    <LoadingScreen :loading="loading" text="Carregando detalhes..." />

    <div v-if="movie && !loading" class="movie-detail__content">
      <!-- Backdrop Hero -->
      <div class="movie-detail__hero">
        <img
          v-if="movie.backdrop_path"
          :src="getBackdrop(movie.backdrop_path)"
          :alt="movie.title"
          class="movie-detail__backdrop"
        />
        <div class="movie-detail__backdrop-overlay"></div>
      </div>

      <!-- Main Content -->
      <div class="container movie-detail__container">
        <div class="movie-detail__grid">
          <!-- Poster -->
          <div class="movie-detail__poster-section">
            <div class="movie-detail__poster-wrapper">
              <img
                v-if="movie.poster_path"
                :src="getPosterUrl(movie.poster_path)"
                :alt="movie.title"
                class="movie-detail__poster"
              />
              <div v-else class="movie-detail__poster-placeholder">
                <font-awesome-icon :icon="['fas', 'film']" />
              </div>
            </div>

            <!-- Action Buttons - ESTILO NETFLIX -->
            <div class="movie-detail__actions">
              <!-- Botão Principal - Assistir Trailer -->
              <button
                v-if="movie.trailer"
                @click="showTrailerModal = true"
                class="movie-detail__btn-play"
              >
                <font-awesome-icon :icon="['fas', 'play']" />
                <span>Assistir Trailer</span>
              </button>

              <!-- Botões Circulares Secundários -->
              <div class="movie-detail__actions-secondary">
                <button
                  @click="toggleFavorite(movie)"
                  class="movie-detail__btn-icon"
                  :class="{ 'movie-detail__btn-icon--active': isFavorite(movie.id) }"
                  :title="isFavorite(movie.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'"
                >
                  <font-awesome-icon
                    :icon="isFavorite(movie.id) ? ['fas', 'heart'] : ['far', 'heart']"
                  />
                </button>

                <button
                  @click="handleWatchlistToggle"
                  class="movie-detail__btn-icon movie-detail__btn-icon--watchlist"
                  :class="{ 'movie-detail__btn-icon--watchlist-active': isInWatchlist }"
                  :title="isInWatchlist ? 'Remover da Lista' : 'Adicionar à Lista'"
                >
                  <font-awesome-icon
                    :icon="isInWatchlist ? ['fas', 'bookmark'] : ['far', 'bookmark']"
                  />
                </button>

                <button @click="shareMovie" class="movie-detail__btn-icon" title="Compartilhar">
                  <font-awesome-icon :icon="['fas', 'share-nodes']" />
                </button>
              </div>
            </div>

            <!-- Avaliar Filme - MOVIDO PARA CÁ -->
            <div class="movie-detail__rating-box">
              <h2 class="movie-detail__section-title">Avaliar Filme</h2>
              <MovieRating :movie-id="movie.id" />
            </div>
          </div>

          <!-- Info -->
          <div class="movie-detail__info">
            <button @click="goBack" class="movie-detail__back">
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
              Voltar
            </button>

            <h1 class="movie-detail__title">{{ movie.title }}</h1>
            <p v-if="movie.tagline" class="movie-detail__tagline">"{{ movie.tagline }}"</p>

            <!-- Meta Info -->
            <div class="movie-detail__meta">
              <div class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'star']" />
                <span class="movie-detail__rating">{{ movie.vote_average.toFixed(1) }}</span>
                <span class="movie-detail__votes">({{ formatVotes(movie.vote_count) }} votos)</span>
              </div>

              <div v-if="movie.release_date" class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'calendar']" />
                <span>{{ formatDate(movie.release_date) }}</span>
              </div>

              <div v-if="movie.runtime" class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'clock']" />
                <span>{{ formatRuntime(movie.runtime) }}</span>
              </div>
            </div>

            <!-- Genres -->
            <div class="movie-detail__genres">
              <span v-for="genre in movie.genres" :key="genre.id" class="movie-detail__genre">
                {{ genre.name }}
              </span>
            </div>

            <!-- Overview -->
            <div class="movie-detail__section">
              <h2 class="movie-detail__section-title">Sinopse</h2>
              <p class="movie-detail__overview">
                {{ movie.overview || 'Sinopse não disponível.' }}
              </p>
            </div>

            <!-- Additional Info - LAYOUT MODERNO -->
            <div class="movie-detail__stats">
              <div v-if="movie.budget" class="movie-detail__stat-card">
                <div class="movie-detail__stat-icon">
                  <font-awesome-icon :icon="['fas', 'money-bill-wave']" />
                </div>
                <div class="movie-detail__stat-content">
                  <span class="movie-detail__stat-label">Orçamento:</span>
                  <span class="movie-detail__stat-value">{{ formatCurrency(movie.budget) }}</span>
                </div>
              </div>

              <div v-if="movie.revenue" class="movie-detail__stat-card">
                <div class="movie-detail__stat-icon movie-detail__stat-icon--success">
                  <font-awesome-icon :icon="['fas', 'chart-line']" />
                </div>
                <div class="movie-detail__stat-content">
                  <span class="movie-detail__stat-label">Bilheteria:</span>
                  <span class="movie-detail__stat-value">{{ formatCurrency(movie.revenue) }}</span>
                </div>
              </div>

              <div v-if="movie.status" class="movie-detail__stat-card">
                <div class="movie-detail__stat-icon movie-detail__stat-icon--info">
                  <font-awesome-icon :icon="['fas', 'circle-info']" />
                </div>
                <div class="movie-detail__stat-content">
                  <span class="movie-detail__stat-label">Status:</span>
                  <span class="movie-detail__stat-value">{{ translateStatus(movie.status) }}</span>
                </div>
              </div>

              <div v-if="movie.original_language" class="movie-detail__stat-card">
                <div class="movie-detail__stat-icon movie-detail__stat-icon--language">
                  <font-awesome-icon :icon="['fas', 'language']" />
                </div>
                <div class="movie-detail__stat-content">
                  <span class="movie-detail__stat-label">Idioma:</span>
                  <span class="movie-detail__stat-value">{{
                    movie.original_language.toUpperCase()
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cast -->
        <section v-if="movie.cast && movie.cast.length > 0" class="movie-detail__cast-section">
          <h2 class="movie-detail__section-title">
            <font-awesome-icon :icon="['fas', 'users']" />
            Elenco Principal
          </h2>
          <div class="movie-detail__cast">
            <div v-for="person in movie.cast" :key="person.id" class="movie-detail__cast-item">
              <img
                v-if="person.profile_path"
                :src="getPosterUrl(person.profile_path, 'w185')"
                :alt="person.name"
                class="movie-detail__cast-photo"
              />
              <div v-else class="movie-detail__cast-photo-placeholder">
                <font-awesome-icon :icon="['fas', 'user']" />
              </div>
              <div class="movie-detail__cast-info">
                <p class="movie-detail__cast-name">{{ person.name }}</p>
                <p class="movie-detail__cast-character">{{ person.character }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Similar Movies -->
        <section v-if="similarMovies.length > 0" class="movie-detail__similar-section">
          <h2 class="movie-detail__section-title">
            <font-awesome-icon :icon="['fas', 'film']" />
            Filmes Similares
          </h2>
          <div class="movie-detail__similar">
            <MovieCard
              v-for="similarMovie in similarMovies"
              :key="similarMovie.id"
              :movie="similarMovie"
              view-mode="grid"
            />
          </div>
        </section>
      </div>
    </div>

    <TrailerModal
      :show="showTrailerModal"
      :trailer="movie?.trailer"
      :movie="movie"
      @close="showTrailerModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '@/stores/movie'
import { useFavorites } from '@/composables/useFavorites'
import { useAuthStore } from '@/stores/auth'
import { getImageUrl, getBackdropUrl } from '@/plugins/axios'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import TrailerModal from '@/components/modal/TrailerModal.vue'
import MovieRating from '@/components/movie/MovieRating.vue'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()
const authStore = useAuthStore()
const { isFavorite, toggleFavorite: toggleFav, addToHistory } = useFavorites()

const showTrailerModal = ref(false)
const similarMovies = ref([])
const isInWatchlist = ref(false)

const movie = computed(() => movieStore.selectedMovie)
const loading = computed(() => movieStore.loading)

const getPosterUrl = (path, size = 'w500') => {
  return getImageUrl(path, size)
}

const getBackdrop = (path) => {
  return getBackdropUrl(path, 'original')
}

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('pt-BR', options)
}

const formatRuntime = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
}

const formatVotes = (votes) => {
  if (votes >= 1000) {
    return `${(votes / 1000).toFixed(1)}k`
  }
  return votes
}

const formatCurrency = (amount) => {
  if (amount === 0) return 'N/A'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const translateStatus = (status) => {
  const translations = {
    Released: 'Lançado',
    'Post Production': 'Pós-Produção',
    'In Production': 'Em Produção',
    Planned: 'Planejado',
    Rumored: 'Rumores',
    Canceled: 'Cancelado',
  }
  return translations[status] || status
}

const toggleFavorite = (movie) => {
  toggleFav(movie)
}

const handleWatchlistToggle = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login' })
    return
  }

  try {
    const success = await authStore.toggleWatchlist(movie.value.id, !isInWatchlist.value, 'movie')
    if (success) {
      isInWatchlist.value = !isInWatchlist.value
    }
  } catch (error) {
    console.error('Erro ao alternar watchlist:', error)
  }
}

const checkWatchlistStatus = async () => {
  if (!authStore.isAuthenticated) return

  try {
    const watchlist = await authStore.getWatchlist()
    isInWatchlist.value = watchlist.some((item) => item.id === parseInt(route.params.id))
  } catch (error) {
    console.error('Erro ao verificar watchlist:', error)
  }
}

const shareMovie = async () => {
  const shareData = {
    title: movie.value.title,
    text: `Confira ${movie.value.title} na Sede do Medo!`,
    url: window.location.href,
  }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      console.log('Erro ao compartilhar:', err)
    }
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copiado para a área de transferência!')
  }
}

const goBack = () => {
  router.back()
}

const loadMovieData = async () => {
  const movieId = route.params.id
  await movieStore.getMovieDetails(movieId)

  if (movie.value) {
    addToHistory(movie.value)
    similarMovies.value = await movieStore.getSimilarMovies(movieId)
    await checkWatchlistStatus()
  }
}

watch(
  () => route.params.id,
  () => {
    if (route.name === 'movie-detail') {
      loadMovieData()
    }
  },
)

onMounted(() => {
  loadMovieData()
})
</script>

<style scoped>
.movie-detail__content {
  background: rgb(20, 20, 20);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.movie-detail__hero {
  position: relative;
  height: 80vh;
  min-height: 500px;
  overflow: hidden;
  margin-top: -70px;
  margin-bottom: -250px;
}

.movie-detail__backdrop {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.movie-detail__backdrop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 30%,
    rgba(20, 20, 20, 0.3) 50%,
    rgba(20, 20, 20, 0.8) 70%,
    rgba(20, 20, 20, 0.95) 90%,
    rgb(20, 20, 20) 100%
  );
}

.movie-detail__container {
  position: relative;
  z-index: 1;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.movie-detail__grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

.movie-detail__poster-section {
  top: 2rem;
  height: fit-content;
}

.movie-detail__poster-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  margin-bottom: 1.5rem;
}

.movie-detail__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.movie-detail__poster-placeholder {
  width: 100%;
  height: 100%;
  background: #1f2937;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 5rem;
}

/* Action Buttons - Estilo Netflix */
.movie-detail__actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Botão Principal - Play/Assistir Trailer */
.movie-detail__btn-play {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 2rem;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.movie-detail__btn-play:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: scale(1.05);
}

.movie-detail__btn-play svg {
  width: 20px;
  height: 20px;
}

/* Botões Circulares Secundários */
.movie-detail__actions-secondary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.movie-detail__btn-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(42, 42, 42, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  color: #fff;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.movie-detail__btn-icon:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.movie-detail__btn-icon--active {
  background: rgba(220, 38, 38, 0.9);
  border-color: #dc2626;
  color: #fff;
}

.movie-detail__btn-icon--active:hover {
  background: #dc2626;
}

.movie-detail__btn-icon--watchlist-active {
  background: rgba(251, 191, 36, 0.9);
  border-color: #fbbf24;
  color: #000;
}

.movie-detail__btn-icon--watchlist-active:hover {
  background: #fbbf24;
}

/* Rating Box - Avaliar Filme */
.movie-detail__rating-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
}

.movie-detail__rating-box .movie-detail__section-title {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.movie-detail__info {
  min-width: 0;
}

.movie-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgb(20, 20, 20);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.movie-detail__back:hover {
  background: rgb(30, 30, 30);
  border-color: #dc2626;
}

.movie-detail__title {
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
  line-height: 1.1;
}

.movie-detail__tagline {
  font-size: 1.25rem;
  color: #9ca3af;
  font-style: italic;
  margin-bottom: 2rem;
}

.movie-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.movie-detail__meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
  font-size: 1rem;
}

.movie-detail__meta-item svg {
  color: #dc2626;
  font-size: 1.25rem;
}

.movie-detail__rating {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fbbf24;
}

.movie-detail__votes {
  font-size: 0.875rem;
  color: #6b7280;
}

.movie-detail__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.movie-detail__genre {
  padding: 0.5rem 1rem;
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 0.5rem;
  color: #fca5a5;
  font-weight: 600;
  font-size: 0.875rem;
}

.movie-detail__section {
  margin-bottom: 2rem;
}

.movie-detail__section-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #dc2626;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.movie-detail__overview {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #d1d5db;
}

/* Stats Cards - Layout Moderno */
.movie-detail__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.movie-detail__stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.movie-detail__stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.movie-detail__stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(220, 38, 38, 0.15);
  border-radius: 12px;
  color: #dc2626;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.movie-detail__stat-icon--success {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.movie-detail__stat-icon--info {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.movie-detail__stat-icon--language {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
}

.movie-detail__stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.movie-detail__stat-label {
  font-size: 0.813rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.movie-detail__stat-value {
  font-size: 1.125rem;
  color: #fff;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.movie-detail__cast-section,
.movie-detail__similar-section {
  margin-top: 4rem;
}

.movie-detail__cast {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.movie-detail__cast-item {
  text-align: center;
}

.movie-detail__cast-photo {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  border: 2px solid rgba(220, 38, 38, 0.2);
}

.movie-detail__cast-photo-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: #1f2937;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  margin-bottom: 0.75rem;
  font-size: 2.5rem;
}

.movie-detail__cast-info {
  padding: 0 0.5rem;
}

.movie-detail__cast-name {
  font-weight: 700;
  color: white;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.movie-detail__cast-character {
  font-size: 0.75rem;
  color: #9ca3af;
}

.movie-detail__similar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .movie-detail__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .movie-detail__poster-section {
    position: relative;
    top: 0;
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .movie-detail__poster-wrapper {
    grid-column: 1;
  }

  .movie-detail__actions {
    grid-column: 2;
    grid-row: 1;
  }

  .movie-detail__rating-box {
    grid-column: 1 / -1;
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .movie-detail__hero {
    height: 50vh;
    min-height: 300px;
    margin-bottom: -150px;
  }

  .movie-detail__title {
    font-size: 2rem;
  }

  .movie-detail__poster-section {
    grid-template-columns: 1fr;
  }

  .movie-detail__poster-wrapper {
    grid-column: 1;
  }

  .movie-detail__actions {
    grid-column: 1;
    grid-row: 2;
  }

  .movie-detail__rating-box {
    grid-column: 1;
    grid-row: 3;
  }

  .movie-detail__cast {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .movie-detail__similar {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .movie-detail__stats {
    grid-template-columns: 1fr;
  }

  .movie-detail__stat-card {
    padding: 1rem 1.25rem;
  }

  .movie-detail__stat-icon {
    width: 40px;
    height: 40px;
    font-size: 1.125rem;
  }

  .movie-detail__stat-value {
    font-size: 1rem;
  }
}
</style>
