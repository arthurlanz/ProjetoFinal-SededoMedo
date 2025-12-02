<template>
  <div class="ratings-view">
    <div class="container">
      <header class="ratings-view__header">
        <h1 class="ratings-view__title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          Minhas Avaliações
        </h1>
        <p class="ratings-view__subtitle">
          {{ totalCount }} {{ totalCount === 1 ? 'avaliação' : 'avaliações' }} total
        </p>
      </header>

      <LoadingScreen :loading="loading" text="Carregando avaliações..." />

      <!-- Tabs -->
      <div v-if="!loading && totalCount > 0" class="ratings-view__tabs">
        <button
          @click="activeTab = 'all'"
          class="ratings-view__tab"
          :class="{ 'ratings-view__tab--active': activeTab === 'all' }"
        >
          Todos
          <span class="ratings-view__tab-count">{{ totalCount }}</span>
        </button>
        <button
          @click="activeTab = 'movies'"
          class="ratings-view__tab"
          :class="{ 'ratings-view__tab--active': activeTab === 'movies' }"
        >
          Filmes
          <span class="ratings-view__tab-count">{{ movies.length }}</span>
        </button>
        <button
          @click="activeTab = 'series'"
          class="ratings-view__tab"
          :class="{ 'ratings-view__tab--active': activeTab === 'series' }"
        >
          Séries
          <span class="ratings-view__tab-count">{{ series.length }}</span>
        </button>
      </div>

      <!-- Grid -->
      <div v-if="!loading && filteredItems.length > 0">
        <div class="ratings-view__grid">
          <div
            v-for="item in filteredItems"
            :key="`${item.media_type}-${item.id}`"
            class="ratings-view__card"
            @click="goToDetail(item)"
          >
            <!-- Media Type Badge -->
            <div class="ratings-view__badge">
              <svg v-if="item.media_type === 'movie'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM8 15c0-1.66 1.34-3 3-3 .35 0 .69.07 1 .18V6h5v2h-3v7.03c-.02 1.64-1.35 2.97-3 2.97-1.66 0-3-1.34-3-3z"/>
              </svg>
            </div>

            <img
              v-if="item.poster_path"
              :src="getPosterUrl(item.poster_path)"
              :alt="item.title"
              class="ratings-view__poster"
            />
            <div v-else class="ratings-view__poster-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
              </svg>
            </div>

            <div class="ratings-view__info">
              <h3 class="ratings-view__movie-title">{{ item.title }}</h3>

              <div class="ratings-view__rating">
                <div class="ratings-view__stars">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    :fill="star <= item.rating / 2 ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <span class="ratings-view__rating-value">{{ item.rating }}/10</span>
              </div>

              <p v-if="item.release_date" class="ratings-view__year">
                {{ new Date(item.release_date).getFullYear() }}
              </p>
            </div>

            <button
              @click.stop="handleDeleteRating(item)"
              class="ratings-view__delete"
              title="Remover avaliação"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && totalCount === 0" class="ratings-view__empty">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h2>Você ainda não avaliou nenhum conteúdo</h2>
        <p>Comece a avaliar seus filmes e séries favoritos!</p>
        <button @click="goHome" class="ratings-view__cta">Explorar Conteúdo</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getImageUrl } from '@/plugins/axios'
import api from '@/plugins/axios'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'

const router = useRouter()
const authStore = useAuthStore()

const movies = ref([])
const series = ref([])
const loading = ref(true)
const activeTab = ref('all')

const getPosterUrl = (path) => {
  return getImageUrl(path, 'w500')
}

const totalCount = computed(() => movies.value.length + series.value.length)

const filteredItems = computed(() => {
  if (activeTab.value === 'movies') return movies.value
  if (activeTab.value === 'series') return series.value

  // Combinar e ordenar por rating (maior primeiro)
  return [...movies.value, ...series.value].sort((a, b) => b.rating - a.rating)
})

const goToDetail = (item) => {
  if (item.media_type === 'movie') {
    router.push({ name: 'movie-detail', params: { id: item.id } })
  } else {
    router.push({ name: 'series-detail', params: { id: item.id } })
  }
}

const goHome = () => {
  router.push({ name: 'home' })
}

const handleDeleteRating = async (item) => {
  const type = item.media_type === 'movie' ? 'filme' : 'série'

  if (confirm(`Deseja remover sua avaliação desta ${type}?`)) {
    try {
      const sessionId = authStore.sessionId || localStorage.getItem('tmdb_session_id')

      if (!sessionId) {
        alert('Sessão inválida. Faça login novamente.')
        return
      }

      const endpoint = item.media_type === 'movie' ? 'movie' : 'tv'

      const response = await api.delete(
        `${endpoint}/${item.id}/rating`,
        {
          params: {
            session_id: sessionId,
          },
        }
      )

      if (response.data.success) {
        // Remover da lista local
        if (item.media_type === 'movie') {
          movies.value = movies.value.filter((m) => m.id !== item.id)
        } else {
          series.value = series.value.filter((s) => s.id !== item.id)
        }

        // Remover do localStorage também
        const storageKey = `rating_${item.media_type}_${item.id}`
        localStorage.removeItem(storageKey)

        console.log('✅ Avaliação removida com sucesso')
      } else {
        throw new Error('Falha ao remover avaliação')
      }
    } catch (error) {
      console.error('❌ Erro ao remover avaliação:', error)
      alert('Erro ao remover avaliação. Tente novamente.')
    }
  }
}

const fetchRatedMovies = async () => {
  try {
    const sessionId = authStore.sessionId || localStorage.getItem('tmdb_session_id')

    if (!sessionId) {
      console.warn('Sem sessão para carregar avaliações')
      return []
    }

    const response = await api.get(`account/${authStore.accountId}/rated/movies`, {
      params: {
        session_id: sessionId,
        language: 'pt-BR',
        sort_by: 'created_at.desc',
      },
    })

    return (response.data.results || []).map(movie => ({
      ...movie,
      media_type: 'movie',
      title: movie.title,
      release_date: movie.release_date,
    }))
  } catch (error) {
    console.error('❌ Erro ao carregar filmes avaliados:', error)
    return []
  }
}

const fetchRatedSeries = async () => {
  try {
    const sessionId = authStore.sessionId || localStorage.getItem('tmdb_session_id')

    if (!sessionId) {
      console.warn('Sem sessão para carregar avaliações')
      return []
    }

    const response = await api.get(`account/${authStore.accountId}/rated/tv`, {
      params: {
        session_id: sessionId,
        language: 'pt-BR',
        sort_by: 'created_at.desc',
      },
    })

    return (response.data.results || []).map(show => ({
      ...show,
      media_type: 'tv',
      title: show.name,
      release_date: show.first_air_date,
    }))
  } catch (error) {
    console.error('❌ Erro ao carregar séries avaliadas:', error)
    return []
  }
}

onMounted(async () => {
  try {
    loading.value = true

    // Buscar filmes e séries em paralelo
    const [ratedMovies, ratedSeries] = await Promise.all([
      fetchRatedMovies(),
      fetchRatedSeries(),
    ])

    movies.value = ratedMovies
    series.value = ratedSeries

    console.log('✅ Avaliações carregadas:', {
      filmes: movies.value.length,
      séries: series.value.length,
      total: totalCount.value,
    })
  } catch (error) {
    console.error('❌ Erro ao carregar avaliações:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.ratings-view {
  min-height: 100vh;
  background: rgb(20, 20, 20);
  padding: 4rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.ratings-view__header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.ratings-view__title {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

.ratings-view__title svg {
  width: 48px;
  height: 48px;
}

.ratings-view__subtitle {
  color: #9ca3af;
  font-size: 1.125rem;
}

/* Tabs */
.ratings-view__tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.ratings-view__tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #9ca3af;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ratings-view__tab:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(220, 38, 38, 0.3);
  color: #dc2626;
}

.ratings-view__tab--active {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  color: #dc2626;
}

.ratings-view__tab-count {
  padding: 0.25rem 0.625rem;
  background: rgba(220, 38, 38, 0.3);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
}

.ratings-view__tab--active .ratings-view__tab-count {
  background: #dc2626;
  color: white;
}

/* Grid */
.ratings-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.ratings-view__card {
  position: relative;
  background: linear-gradient(to bottom, #1f2937, #000000);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ratings-view__card:hover {
  border-color: #dc2626;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
  transform: translateY(-5px);
}

/* Media Type Badge */
.ratings-view__badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  border: 2px solid rgba(220, 38, 38, 0.5);
}

.ratings-view__badge svg {
  width: 18px;
  height: 18px;
  color: #dc2626;
}

.ratings-view__poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.ratings-view__poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.ratings-view__poster-placeholder svg {
  width: 60px;
  height: 60px;
}

.ratings-view__info {
  padding: 1rem;
}

.ratings-view__movie-title {
  color: #dc2626;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: 2.5rem;
}

.ratings-view__rating {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.ratings-view__stars {
  display: flex;
  gap: 0.25rem;
  color: #fbbf24;
}

.ratings-view__stars svg {
  width: 16px;
  height: 16px;
}

.ratings-view__rating-value {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
}

.ratings-view__year {
  color: #9ca3af;
  font-size: 0.875rem;
}

.ratings-view__delete {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  background: rgba(220, 38, 38, 0.9);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  z-index: 10;
}

.ratings-view__card:hover .ratings-view__delete {
  opacity: 1;
}

.ratings-view__delete:hover {
  background: #b91c1c;
  transform: scale(1.1);
}

.ratings-view__delete svg {
  width: 18px;
  height: 18px;
}

/* Empty State */
.ratings-view__empty {
  text-align: center;
  padding: 6rem 2rem;
  color: #6b7280;
}

.ratings-view__empty svg {
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  color: #374151;
}

.ratings-view__empty h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.ratings-view__empty p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.ratings-view__cta {
  padding: 1rem 2rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ratings-view__cta:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .ratings-view__grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .ratings-view {
    padding: 2rem 0;
  }

  .ratings-view__header {
    padding-top: 1rem;
  }

  .ratings-view__title {
    font-size: 2rem;
    gap: 0.75rem;
  }

  .ratings-view__title svg {
    width: 36px;
    height: 36px;
  }

  .ratings-view__subtitle {
    font-size: 1rem;
  }

  .ratings-view__tabs {
    gap: 0.5rem;
  }

  .ratings-view__tab {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .ratings-view__grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .ratings-view__badge {
    width: 28px;
    height: 28px;
  }

  .ratings-view__badge svg {
    width: 16px;
    height: 16px;
  }

  .ratings-view__delete {
    width: 32px;
    height: 32px;
    opacity: 1;
  }

  .ratings-view__movie-title {
    font-size: 0.875rem;
  }

  .ratings-view__empty h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .ratings-view__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .ratings-view__info {
    padding: 0.75rem;
  }
}
</style>
