<template>
  <div class="movie-detail">
    <LoadingScreen :loading="loading" text="Carregando detalhes..." />

    <div v-if="series && !loading" class="movie-detail__content">
      <!-- Backdrop Hero -->
      <div class="movie-detail__hero">
        <img
          v-if="series.backdrop_path"
          :src="getBackdrop(series.backdrop_path)"
          :alt="series.name"
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
                v-if="series.poster_path"
                :src="getPosterUrl(series.poster_path)"
                :alt="series.name"
                class="movie-detail__poster"
              />
              <div v-else class="movie-detail__poster-placeholder">
                <font-awesome-icon :icon="['fas', 'film']" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="movie-detail__actions">
              <button
                v-if="series.trailer"
                @click="showTrailerModal = true"
                class="movie-detail__btn-play"
              >
                <font-awesome-icon :icon="['fas', 'play']" />
                <span>Assistir Trailer</span>
              </button>

              <div class="movie-detail__actions-secondary">
                <button
                  @click="toggleFavorite(adaptedSeries)"
                  class="movie-detail__btn-icon"
                  :class="{ 'movie-detail__btn-icon--active': isFavorite(series.id) }"
                  :title="
                    isFavorite(series.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'
                  "
                >
                  <font-awesome-icon
                    :icon="isFavorite(series.id) ? ['fas', 'heart'] : ['far', 'heart']"
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

                <button @click="shareSeries" class="movie-detail__btn-icon" title="Compartilhar">
                  <font-awesome-icon :icon="['fas', 'share-nodes']" />
                </button>
              </div>
            </div>

            <div class="movie-detail__rating-box">
              <h2 class="movie-detail__section-title">Avaliar Série</h2>
              <MovieRating
                :movie-id="series.id"
                media-type="tv"
                :vote-average="series.vote_average || 0"
                :vote-count="series.vote_count || 0"
              />
            </div>
          </div>

          <!-- Info -->
          <div class="movie-detail__info">
            <button @click="goBack" class="movie-detail__back">
              <font-awesome-icon :icon="['fas', 'arrow-left']" />
              Voltar
            </button>

            <h1 class="movie-detail__title">{{ series.name }}</h1>
            <p v-if="series.tagline" class="movie-detail__tagline">"{{ series.tagline }}"</p>

            <!-- Meta Info -->
            <div class="movie-detail__meta">
              <div class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'star']" />
                <span class="movie-detail__rating">{{
                  series.vote_average?.toFixed(1) || 'N/A'
                }}</span>
                <span class="movie-detail__votes"
                  >({{ formatVotes(series.vote_count) }} votos)</span
                >
              </div>

              <div v-if="series.first_air_date" class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'calendar']" />
                <span>{{ formatDate(series.first_air_date) }}</span>
              </div>

              <div v-if="series.number_of_seasons" class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'film']" />
                <span
                  >{{ series.number_of_seasons }} temporada{{
                    series.number_of_seasons > 1 ? 's' : ''
                  }}</span
                >
              </div>

              <div v-if="series.number_of_episodes" class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'tv']" />
                <span
                  >{{ series.number_of_episodes }} episódio{{
                    series.number_of_episodes > 1 ? 's' : ''
                  }}</span
                >
              </div>

              <div
                v-if="series.episode_run_time && series.episode_run_time.length"
                class="movie-detail__meta-item"
              >
                <font-awesome-icon :icon="['fas', 'clock']" />
                <span>~{{ series.episode_run_time[0] }} min/ep</span>
              </div>

              <div v-if="series.status" class="movie-detail__meta-item">
                <font-awesome-icon :icon="['fas', 'info-circle']" />
                <span>{{ translateStatus(series.status) }}</span>
              </div>
            </div>

            <!-- Genres -->
            <div class="movie-detail__genres">
              <span v-for="genre in series.genres" :key="genre.id" class="movie-detail__genre">
                {{ genre.name }}
              </span>
            </div>

            <!-- Overview -->
            <div class="movie-detail__section">
              <h2 class="movie-detail__section-title">Sinopse</h2>
              <p class="movie-detail__overview">
                {{ series.overview || 'Sinopse não disponível.' }}
              </p>
            </div>

            <!-- Criadores -->
            <div v-if="series.created_by && series.created_by.length" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Criadores</h2>
              <p class="movie-detail__text">
                {{ series.created_by.map((c) => c.name).join(', ') }}
              </p>
            </div>

            <!-- Networks -->
            <div v-if="series.networks && series.networks.length" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Rede/Streaming</h2>
              <div class="movie-detail__networks">
                <div
                  v-for="network in series.networks"
                  :key="network.id"
                  class="movie-detail__network"
                >
                  <img
                    v-if="network.logo_path"
                    :src="getLogoUrl(network.logo_path)"
                    :alt="network.name"
                  />
                  <span v-else>{{ network.name }}</span>
                </div>
              </div>
            </div>

            <!-- Cast -->
            <div v-if="cast.length" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Elenco Principal</h2>
              <div class="movie-detail__cast">
                <div
                  v-for="person in cast.slice(0, 12)"
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

            <!-- Seasons -->
            <div v-if="series.seasons && series.seasons.length" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Temporadas</h2>
              <div class="movie-detail__seasons">
                <div
                  v-for="season in series.seasons.filter((s) => s.season_number > 0)"
                  :key="season.id"
                  class="movie-detail__season"
                >
                  <img
                    v-if="season.poster_path"
                    :src="getPosterUrl(season.poster_path)"
                    :alt="season.name"
                    class="movie-detail__season-poster"
                  />
                  <div v-else class="movie-detail__season-placeholder">
                    <font-awesome-icon :icon="['fas', 'film']" />
                  </div>
                  <div class="movie-detail__season-info">
                    <h3>{{ season.name }}</h3>
                    <p v-if="season.episode_count">{{ season.episode_count }} episódios</p>
                    <p v-if="season.air_date">{{ formatYear(season.air_date) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Similar Series -->
            <div v-if="similarSeries.length" class="movie-detail__section">
              <h2 class="movie-detail__section-title">Séries Similares</h2>
              <div class="movie-detail__similar">
                <div
                  v-for="similar in similarSeries.slice(0, 6)"
                  :key="similar.id"
                  @click="goToSeries(similar.id)"
                  class="movie-detail__similar-item"
                >
                  <img
                    v-if="similar.poster_path"
                    :src="getPosterUrl(similar.poster_path)"
                    :alt="similar.name"
                  />
                  <div v-else class="movie-detail__similar-placeholder">
                    <font-awesome-icon :icon="['fas', 'film']" />
                  </div>
                  <p class="movie-detail__similar-title">{{ similar.name }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trailer Modal -->
      <TrailerModal
        v-if="series.trailer"
        :visible="showTrailerModal"
        :trailer-key="series.trailer"
        :title="series.name"
        @close="showTrailerModal = false"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api, { getImageUrl } from '@/plugins/axios'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'
import TrailerModal from '@/components/modal/TrailerModal.vue'
import MovieRating from '@/components/movie/MovieRating.vue'
import { useFavorites } from '@/composables/useFavorites'
import { useWatchlist } from '@/composables/useWatchlist'

const route = useRoute()
const router = useRouter()
const { isFavorite, toggleFavorite } = useFavorites()
const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist()

const series = ref(null)
const cast = ref([])
const similarSeries = ref([])
const loading = ref(true)
const showTrailerModal = ref(false)

// Computed para adaptar dados de série para favoritos (compatibilidade com movie)
const adaptedSeries = computed(() => {
  if (!series.value) return null
  return {
    ...series.value,
    title: series.value.name,
    release_date: series.value.first_air_date,
  }
})

const getPosterUrl = (path) => getImageUrl(path, 'w500')
const getBackdrop = (path) => getImageUrl(path, 'original')
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

const formatYear = (date) => {
  if (!date) return ''
  return new Date(date).getFullYear()
}

const translateStatus = (status) => {
  const statusMap = {
    'Returning Series': 'Em exibição',
    Ended: 'Finalizada',
    Canceled: 'Cancelada',
    'In Production': 'Em produção',
    Planned: 'Planejada',
  }
  return statusMap[status] || status
}

const fetchSeriesDetails = async () => {
  try {
    loading.value = true
    const id = route.params.id

    // Buscar detalhes da série
    const [detailsRes, creditsRes, similarRes, videosRes] = await Promise.all([
      api.get(`tv/${id}`, { params: { language: 'pt-BR' } }),
      api.get(`tv/${id}/credits`, { params: { language: 'pt-BR' } }),
      api.get(`tv/${id}/similar`, { params: { language: 'pt-BR' } }),
      api.get(`tv/${id}/videos`, { params: { language: 'pt-BR' } }),
    ])

    series.value = detailsRes.data
    cast.value = creditsRes.data.cast || []
    similarSeries.value = similarRes.data.results || []

    // Buscar trailer
    const videos = videosRes.data.results || []
    const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube')
    if (trailer) {
      series.value.trailer = trailer.key
    }

    console.log('✅ Detalhes da série carregados:', series.value.name)
  } catch (error) {
    console.error('❌ Erro ao carregar detalhes da série:', error)
  } finally {
    loading.value = false
  }
}

const handleWatchlistToggle = () => {
  if (isInWatchlist(series.value.id)) {
    removeFromWatchlist(series.value.id)
  } else {
    addToWatchlist(adaptedSeries.value)
  }
}

const shareSeries = async () => {
  const shareData = {
    title: series.value.name,
    text: `Confira "${series.value.name}" no Sede do Medo!`,
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

const goToSeries = (id) => {
  router.push({ name: 'series-detail', params: { id } })
  window.scrollTo(0, 0)
  fetchSeriesDetails()
}

onMounted(() => {
  fetchSeriesDetails()
})
</script>

<style scoped>
.movie-detail__content {
  background: rgb(20, 20, 20);
}

.movie-detail__hero {
  position: relative;
  height: 70vh;
  overflow: hidden;
}

.movie-detail__backdrop {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
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

/* Rating Box */
.movie-detail__rating-box {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
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
}

/* Networks */
.movie-detail__networks {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.movie-detail__network {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
}

.movie-detail__network img {
  max-height: 40px;
  max-width: 120px;
  object-fit: contain;
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

/* Seasons */
.movie-detail__seasons {
  display: grid;
  gap: 1.5rem;
}

.movie-detail__season {
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.movie-detail__season:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(220, 38, 38, 0.5);
}

.movie-detail__season-poster {
  width: 100px;
  height: 150px;
  object-fit: cover;
  border-radius: 0.5rem;
}

.movie-detail__season-placeholder {
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f2937;
  color: #6b7280;
  border-radius: 0.5rem;
}

.movie-detail__season-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.movie-detail__season-info p {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.25rem;
}

/* Similar Series */
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
}
</style>
