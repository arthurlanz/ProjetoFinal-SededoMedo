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

            <!-- Action Buttons -->
            <div class="movie-detail__actions">
              <button
                v-if="movie.trailer"
                @click="showTrailerModal = true"
                class="movie-detail__btn-play"
              >
                <font-awesome-icon :icon="['fas', 'play']" />
                <span>Assistir Trailer</span>
              </button>

              <div class="movie-detail__actions-secondary">
                <button
                  @click="toggleFavorite(movie)"
                  class="movie-detail__btn-icon"
                  :class="{ 'movie-detail__btn-icon--active': isFavorite(movie.id) }"
                  :title="
                    isFavorite(movie.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'
                  "
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

            <div class="movie-detail__rating-section">
              <MovieRating
                :movie-id="movie.id"
                media-type="movie"
                :vote-average="movie.vote_average || 0"
                :vote-count="movie.vote_count || 0"
              />
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
                <span class="movie-detail__rating">{{
                  movie.vote_average?.toFixed(1) || 'N/A'
                }}</span>
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

              <div v-if="movie.status" class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'info-circle']" />
                <span>{{ translateStatus(movie.status) }}</span>
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

            <!-- Director/Producer -->
            <div v-if="movie.director || movie.producer" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Equipe</h2>
              <p v-if="movie.director" class="movie-detail__text">
                <strong>Direção:</strong> {{ movie.director }}
              </p>
              <p v-if="movie.producer" class="movie-detail__text">
                <strong>Produção:</strong> {{ movie.producer }}
              </p>
            </div>

            <!-- Production Companies -->
            <div
              v-if="movie.production_companies && movie.production_companies.length"
              class="movie-detail__section"
            >
              <h2 class="movie-detail__section-title">Produtoras</h2>
              <div class="movie-detail__companies">
                <div
                  v-for="company in movie.production_companies.slice(0, 4)"
                  :key="company.id"
                  class="movie-detail__company"
                >
                  <img
                    v-if="company.logo_path"
                    :src="getLogoUrl(company.logo_path)"
                    :alt="company.name"
                  />
                  <span v-else>{{ company.name }}</span>
                </div>
              </div>
            </div>

            <!-- Stats Cards -->
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

            <!-- Cast -->
            <div v-if="movie.cast && movie.cast.length" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Elenco Principal</h2>
              <div class="movie-detail__cast">
                <div
                  v-for="person in movie.cast.slice(0, 12)"
                  :key="person.id"
                  class="movie-detail__cast-item"
                >
                  <div class="movie-detail__cast-avatar">
                    <img
                      v-if="person.profile_path"
                      :src="getProfileUrl(person.profile_path)"
                      :alt="person.name"
                    />
                    <div v-else class="movie-detail__cast-placeholder">
                      <font-awesome-icon :icon="['fas', 'user']" />
                    </div>
                  </div>
                  <p class="movie-detail__cast-name">{{ person.name }}</p>
                  <p class="movie-detail__cast-role">{{ person.character }}</p>
                </div>
              </div>
            </div>

            <!-- Similar Movies -->
            <div v-if="similarMovies.length" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Filmes Similares</h2>
              <div class="movie-detail__similar">
                <div
                  v-for="similar in similarMovies.slice(0, 6)"
                  :key="similar.id"
                  @click="goToMovie(similar.id)"
                  class="movie-detail__similar-item"
                >
                  <img
                    v-if="similar.poster_path"
                    :src="getPosterUrl(similar.poster_path)"
                    :alt="similar.title"
                  />
                  <div v-else class="movie-detail__similar-placeholder">
                    <font-awesome-icon :icon="['fas', 'film']" />
                  </div>
                  <p class="movie-detail__similar-title">{{ similar.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trailer Modal -->
      <TrailerModal
        v-if="movie.trailer"
        :visible="showTrailerModal"
        :trailer-key="movie.trailer"
        :title="movie.title"
        @close="showTrailerModal = false"
      />
    </div>
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

const getPosterUrl = (path) => getImageUrl(path, 'w500')
const getBackdrop = (path) => getBackdropUrl(path, 'original')
const getProfileUrl = (path) => getImageUrl(path, 'w185')
const getLogoUrl = (path) => getImageUrl(path, 'w154')

const formatVotes = (votes) => {
  if (!votes) return '0'
  if (votes >= 1000000) return `${(votes / 1000000).toFixed(1)}M`
  if (votes >= 1000) return `${(votes / 1000).toFixed(1)}k`
  return votes.toString()
}

const formatDate = (date) => {
  if (!date) return 'Data não disponível'
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
}

const formatCurrency = (amount) => {
  if (!amount || amount === 0) return 'N/A'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const translateStatus = (status) => {
  const statusMap = {
    Released: 'Lançado',
    'Post Production': 'Pós-Produção',
    'In Production': 'Em Produção',
    Planned: 'Planejado',
    Rumored: 'Rumores',
    Canceled: 'Cancelado',
  }
  return statusMap[status] || status
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
    text: `Confira "${movie.value.title}" no Sede do Medo!`,
    url: window.location.href,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert('Link copiado para a área de transferência!')
    }
  } catch (error) {
    console.error('Erro ao compartilhar:', error)
  }
}

const goBack = () => {
  router.back()
}

const goToMovie = (id) => {
  router.push({ name: 'movie-detail', params: { id } })
  window.scrollTo(0, 0)
  loadMovieData()
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
/* Todos os estilos anteriores permanecem iguais, apenas adicione: */

/* Rating Section - NOVO */
.movie-detail__rating-section {
  margin-top: 1.5rem;
}

/* Remover a antiga .movie-detail__rating-box e substituir por: */
.movie-detail__rating-section :deep(.movie-rating) {
  margin: 0;
}

.movie-detail__rating-section :deep(.movie-rating__container) {
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

/* Resto do CSS permanece igual */
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
  margin-top: -15rem;
  position: relative;
  z-index: 10;
}

.movie-detail__grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 3rem;
  align-items: start;
}

/* Poster Section */
.movie-detail__poster-section {
  position: sticky;
  top: 100px;
}

.movie-detail__poster-wrapper {
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.movie-detail__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-detail__poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2937;
  color: #6b7280;
}

.movie-detail__poster-placeholder svg {
  width: 80px;
  height: 80px;
}

/* Actions */
.movie-detail__actions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movie-detail__btn-play {
  width: 100%;
  padding: 1rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
}

.movie-detail__btn-play:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.movie-detail__actions-secondary {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.movie-detail__btn-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.movie-detail__btn-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.movie-detail__btn-icon--active {
  background: #dc2626;
  border-color: #dc2626;
}

.movie-detail__btn-icon--watchlist-active {
  background: #f59e0b;
  border-color: #f59e0b;
}

/* Info Section */
.movie-detail__info {
  color: white;
}

.movie-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.movie-detail__back:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

.movie-detail__title {
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.movie-detail__tagline {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  margin-bottom: 2rem;
}

.movie-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.movie-detail__meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.movie-detail__rating {
  color: #fbbf24;
  font-weight: 700;
  font-size: 1.125rem;
}

.movie-detail__votes {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.875rem;
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
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
}

.movie-detail__section {
  margin-bottom: 3rem;
}

.movie-detail__section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 1rem;
}

.movie-detail__overview {
  font-size: 1.125rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.9);
}

.movie-detail__text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

/* Companies */
.movie-detail__companies {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.movie-detail__company {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.movie-detail__company img {
  max-height: 40px;
  max-width: 120px;
  object-fit: contain;
}

/* Stats Cards */
.movie-detail__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
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
}

.movie-detail__stat-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(220, 38, 38, 0.3);
  transform: translateY(-2px);
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
}

.movie-detail__stat-label {
  font-size: 0.813rem;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
}

.movie-detail__stat-value {
  font-size: 1.125rem;
  color: #fff;
  font-weight: 700;
}

/* Cast */
.movie-detail__cast {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
}

.movie-detail__cast-item {
  text-align: center;
}

.movie-detail__cast-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 0.75rem;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.movie-detail__cast-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-detail__cast-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2937;
  color: #6b7280;
}

.movie-detail__cast-name {
  font-weight: 700;
  color: white;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.movie-detail__cast-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

/* Similar Movies */
.movie-detail__similar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
}

.movie-detail__similar-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-detail__similar-item:hover {
  transform: translateY(-5px);
}

.movie-detail__similar-item img {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.movie-detail__similar-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2937;
  color: #6b7280;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.movie-detail__similar-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  text-align: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .movie-detail__grid {
    grid-template-columns: 1fr;
  }

  .movie-detail__poster-section {
    position: relative;
    top: 0;
    max-width: 300px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .movie-detail__title {
    font-size: 2rem;
  }

  .movie-detail__cast {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .movie-detail__similar {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .movie-detail__stats {
    grid-template-columns: 1fr;
  }
}
</style>
