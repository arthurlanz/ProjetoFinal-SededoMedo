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
            <img
              v-if="movie.poster_path"
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title"
              class="movie-detail__poster"
            />
            <div v-else class="movie-detail__poster-placeholder">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                <line x1="7" y1="2" x2="7" y2="22" />
                <line x1="17" y1="2" x2="17" y2="22" />
              </svg>
            </div>

            <!-- Action Buttons -->
            <div class="movie-detail__actions">
              <button
                v-if="movie.trailer"
                @click="showTrailerModal = true"
                class="movie-detail__btn movie-detail__btn--primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Assistir Trailer
              </button>

              <button
                @click="toggleFavorite(movie)"
                class="movie-detail__btn movie-detail__btn--secondary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  :fill="isFavorite(movie.id) ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                  />
                </svg>
                {{ isFavorite(movie.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
              </button>

              <button @click="shareMovie" class="movie-detail__btn movie-detail__btn--secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Compartilhar
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="movie-detail__info">
            <button @click="goBack" class="movie-detail__back">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar
            </button>

            <h1 class="movie-detail__title">{{ movie.title }}</h1>
            <p v-if="movie.tagline" class="movie-detail__tagline">"{{ movie.tagline }}"</p>

            <!-- Meta Info -->
            <div class="movie-detail__meta">
              <div class="movie-detail__meta-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
                <span class="movie-detail__rating">{{ movie.vote_average.toFixed(1) }}</span>
                <span class="movie-detail__votes">({{ formatVotes(movie.vote_count) }} votos)</span>
              </div>

              <div v-if="movie.release_date" class="movie-detail__meta-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{{ formatDate(movie.release_date) }}</span>
              </div>

              <div v-if="movie.runtime" class="movie-detail__meta-item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
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

            <!-- Additional Info -->
            <div class="movie-detail__additional">
              <div v-if="movie.budget" class="movie-detail__info-item">
                <strong>Orçamento:</strong>
                <span>{{ formatCurrency(movie.budget) }}</span>
              </div>
              <div v-if="movie.revenue" class="movie-detail__info-item">
                <strong>Bilheteria:</strong>
                <span>{{ formatCurrency(movie.revenue) }}</span>
              </div>
              <div v-if="movie.status" class="movie-detail__info-item">
                <strong>Status:</strong>
                <span>{{ translateStatus(movie.status) }}</span>
              </div>
              <div v-if="movie.original_language" class="movie-detail__info-item">
                <strong>Idioma Original:</strong>
                <span>{{ movie.original_language.toUpperCase() }}</span>
              </div>
            </div>
          </div>
          <div class="movie-detail__rating-box">
            <h2 class="movie-detail__section-title">Avaliar Filme</h2>
            <MovieRating :movie-id="movie.id" />
          </div>
        </div>

        <!-- Cast -->
        <section v-if="movie.cast && movie.cast.length > 0" class="movie-detail__cast-section">
          <h2 class="movie-detail__section-title">Elenco Principal</h2>
          <div class="movie-detail__cast">
            <div v-for="person in movie.cast" :key="person.id" class="movie-detail__cast-item">
              <img
                v-if="person.profile_path"
                :src="getPosterUrl(person.profile_path, 'w185')"
                :alt="person.name"
                class="movie-detail__cast-photo"
              />
              <div v-else class="movie-detail__cast-photo-placeholder">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
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
          <h2 class="movie-detail__section-title">Filmes Similares</h2>
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
import { getImageUrl, getBackdropUrl } from '@/plugins/axios'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'
import MovieCard from '@/components/movie/MovieCard.vue'
import TrailerModal from '@/components/modal/TrailerModal.vue'
import MovieRating from '@/components/movie/MovieRating.vue'

const route = useRoute()
const router = useRouter()
const movieStore = useMovieStore()
const { isFavorite, toggleFavorite: toggleFav, addToHistory } = useFavorites()

const showTrailerModal = ref(false)
const similarMovies = ref([])

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
    // Fallback: copiar URL
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
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.movie-detail__hero {
  position: relative;
  height: 60vh;
  min-height: 400px;
  overflow: hidden;
  margin-bottom: -200px;
}

.movie-detail__backdrop {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-detail__backdrop-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 50%, #000000 100%);
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

.movie-detail__poster {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(220, 38, 38, 0.3);
  margin-bottom: 1.5rem;
}

.movie-detail__poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: #1f2937;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.movie-detail__poster-placeholder svg {
  width: 80px;
  height: 80px;
}

.movie-detail__actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movie-detail__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.movie-detail__btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.movie-detail__btn--primary {
  background: #dc2626;
  color: white;
}

.movie-detail__btn--primary:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.movie-detail__btn--secondary {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.movie-detail__btn--secondary:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
}

.movie-detail__info {
  min-width: 0;
}

.movie-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.movie-detail__back:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
}

.movie-detail__back svg {
  width: 18px;
  height: 18px;
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
  width: 20px;
  height: 20px;
  color: #dc2626;
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

.movie-detail__rating-box {
  margin-bottom: 2rem;
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

.movie-detail__section-title svg {
  width: 28px;
  height: 28px;
}

.movie-detail__overview {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #d1d5db;
}

.movie-detail__additional {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(220, 38, 38, 0.05);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 0.75rem;
}

.movie-detail__info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;

}

.movie-detail__info-item strong {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 600;
}

.movie-detail__info-item span {
  color: #d1d5db;
  font-size: 1rem;
  font-weight: 600;
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
}

.movie-detail__cast-photo-placeholder svg {
  width: 40px;
  height: 40px;
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

  .movie-detail__actions {
    grid-column: 2;
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

  .movie-detail__cast {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .movie-detail__similar {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
