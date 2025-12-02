<template>
  <div class="watchlist-view">
    <div class="container">
      <header class="watchlist-view__header">
        <h1 class="watchlist-view__title">
          <font-awesome-icon :icon="['fas', 'bookmark']" />
          Minha Lista de Interesses
        </h1>
        <p class="watchlist-view__subtitle">
          {{ totalCount }} {{ totalCount === 1 ? 'item' : 'itens' }} para assistir
        </p>
      </header>

      <LoadingScreen :loading="loading" text="Carregando lista..." />

      <!-- Tabs -->
      <div v-if="!loading && totalCount > 0" class="watchlist-view__tabs">
        <button
          @click="activeTab = 'all'"
          class="watchlist-view__tab"
          :class="{ 'watchlist-view__tab--active': activeTab === 'all' }"
        >
          Todos
          <span class="watchlist-view__tab-count">{{ totalCount }}</span>
        </button>
        <button
          @click="activeTab = 'movies'"
          class="watchlist-view__tab"
          :class="{ 'watchlist-view__tab--active': activeTab === 'movies' }"
        >
          Filmes
          <span class="watchlist-view__tab-count">{{ movies.length }}</span>
        </button>
        <button
          @click="activeTab = 'series'"
          class="watchlist-view__tab"
          :class="{ 'watchlist-view__tab--active': activeTab === 'series' }"
        >
          Séries
          <span class="watchlist-view__tab-count">{{ series.length }}</span>
        </button>
      </div>

      <!-- Grid -->
      <div v-if="!loading && filteredItems.length > 0">
        <div class="watchlist-view__grid">
          <div
            v-for="item in filteredItems"
            :key="`${item.media_type}-${item.id}`"
            class="watchlist-view__card"
            @click="goToDetail(item)"
          >
            <!-- Media Type Badge -->
            <div class="watchlist-view__badge">
              <font-awesome-icon
                v-if="item.media_type === 'movie'"
                :icon="['fas', 'film']"
              />
              <font-awesome-icon
                v-else
                :icon="['fas', 'tv']"
              />
            </div>

            <img
              v-if="item.poster_path"
              :src="getPosterUrl(item.poster_path)"
              :alt="item.title"
              class="watchlist-view__poster"
            />
            <div v-else class="watchlist-view__poster-placeholder">
              <font-awesome-icon :icon="['fas', 'film']" />
            </div>

            <div class="watchlist-view__overlay">
              <div class="watchlist-view__info">
                <h3 class="watchlist-view__movie-title">{{ item.title }}</h3>

                <div class="watchlist-view__meta">
                  <div class="watchlist-view__rating">
                    <font-awesome-icon :icon="['fas', 'star']" />
                    <span>{{ item.vote_average?.toFixed(1) || 'N/A' }}</span>
                  </div>
                  <span v-if="item.release_date" class="watchlist-view__year">
                    {{ new Date(item.release_date).getFullYear() }}
                  </span>
                </div>
              </div>

              <button
                @click.stop="handleRemove(item)"
                class="watchlist-view__remove"
                title="Remover da lista"
              >
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && totalCount === 0" class="watchlist-view__empty">
        <font-awesome-icon :icon="['fas', 'bookmark']" />
        <h2>Sua lista está vazia</h2>
        <p>Adicione filmes e séries que você deseja assistir!</p>
        <button @click="goHome" class="watchlist-view__cta">
          Explorar Catálogo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getImageUrl } from '@/plugins/axios'
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

  // Combinar e ordenar por data de adição (mais recentes primeiro)
  return [...movies.value, ...series.value].sort((a, b) => {
    const dateA = new Date(a.added_at || 0)
    const dateB = new Date(b.added_at || 0)
    return dateB - dateA
  })
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

const handleRemove = async (item) => {
  const type = item.media_type === 'movie' ? 'filme' : 'série'

  if (confirm(`Deseja remover "${item.title}" da sua lista de interesses?`)) {
    try {
      const success = await authStore.removeFromWatchlist(item.id, item.media_type)

      if (success) {
        // Remover da lista local
        if (item.media_type === 'movie') {
          movies.value = movies.value.filter((m) => m.id !== item.id)
        } else {
          series.value = series.value.filter((s) => s.id !== item.id)
        }

        console.log(`✅ ${type} removido da watchlist`)
      }
    } catch (error) {
      console.error('❌ Erro ao remover da watchlist:', error)
      alert('Erro ao remover da lista. Tente novamente.')
    }
  }
}

onMounted(async () => {
  try {
    loading.value = true

    // Buscar watchlist do authStore
    const watchlistItems = await authStore.getWatchlist()

    // Separar filmes e séries
    movies.value = watchlistItems.filter(item => item.media_type === 'movie')
    series.value = watchlistItems.filter(item => item.media_type === 'tv')

    console.log('✅ Watchlist carregada:', {
      filmes: movies.value.length,
      séries: series.value.length,
      total: totalCount.value,
    })
  } catch (error) {
    console.error('❌ Erro ao carregar watchlist:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.watchlist-view {
  min-height: 100vh;
  background: rgb(20, 20, 20);
  padding: 4rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.watchlist-view__header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.watchlist-view__title {
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

.watchlist-view__title svg {
  font-size: 48px;
}

.watchlist-view__subtitle {
  color: #9ca3af;
  font-size: 1.125rem;
}

/* Tabs */
.watchlist-view__tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.watchlist-view__tab {
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

.watchlist-view__tab:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(220, 38, 38, 0.3);
  color: #dc2626;
}

.watchlist-view__tab--active {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  color: #dc2626;
}

.watchlist-view__tab-count {
  padding: 0.25rem 0.625rem;
  background: rgba(220, 38, 38, 0.3);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
}

.watchlist-view__tab--active .watchlist-view__tab-count {
  background: #dc2626;
  color: white;
}

/* Grid */
.watchlist-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

.watchlist-view__card {
  position: relative;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(220, 38, 38, 0.3);
}

.watchlist-view__card:hover {
  border-color: #dc2626;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
  transform: translateY(-5px);
}

/* Media Type Badge */
.watchlist-view__badge {
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

.watchlist-view__badge svg {
  font-size: 16px;
  color: #dc2626;
}

.watchlist-view__poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  display: block;
}

.watchlist-view__poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.watchlist-view__poster-placeholder svg {
  font-size: 60px;
}

.watchlist-view__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.7) 40%,
    transparent 70%
  );
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.watchlist-view__card:hover .watchlist-view__overlay {
  opacity: 1;
}

.watchlist-view__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.watchlist-view__movie-title {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.watchlist-view__meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
}

.watchlist-view__rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
  font-weight: 700;
}

.watchlist-view__year {
  color: #9ca3af;
}

.watchlist-view__remove {
  width: 40px;
  height: 40px;
  background: #dc2626;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.75rem;
  transition: all 0.3s ease;
  align-self: center;
}

.watchlist-view__remove:hover {
  background: #b91c1c;
  transform: scale(1.1);
}

.watchlist-view__remove svg {
  font-size: 16px;
}

/* Empty State */
.watchlist-view__empty {
  text-align: center;
  padding: 6rem 2rem;
  color: #6b7280;
}

.watchlist-view__empty svg {
  font-size: 100px;
  margin: 0 auto 2rem;
  color: #374151;
  display: block;
}

.watchlist-view__empty h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #9ca3af;
}

.watchlist-view__empty p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.watchlist-view__cta {
  padding: 1rem 2rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.watchlist-view__cta:hover {
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 1024px) {
  .watchlist-view__grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .watchlist-view {
    padding: 2rem 0;
  }

  .watchlist-view__header {
    padding-top: 1rem;
  }

  .watchlist-view__title {
    font-size: 2rem;
    gap: 0.75rem;
  }

  .watchlist-view__title svg {
    font-size: 36px;
  }

  .watchlist-view__subtitle {
    font-size: 1rem;
  }

  .watchlist-view__tabs {
    gap: 0.5rem;
  }

  .watchlist-view__tab {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .watchlist-view__grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .watchlist-view__badge {
    width: 28px;
    height: 28px;
  }

  .watchlist-view__badge svg {
    font-size: 14px;
  }

  /* Sempre mostrar overlay em mobile */
  .watchlist-view__overlay {
    opacity: 1;
  }

  .watchlist-view__movie-title {
    font-size: 0.875rem;
  }

  .watchlist-view__remove {
    width: 36px;
    height: 36px;
  }

  .watchlist-view__empty h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .watchlist-view__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .watchlist-view__badge {
    width: 24px;
    height: 24px;
    top: 0.5rem;
    left: 0.5rem;
  }

  .watchlist-view__badge svg {
    font-size: 12px;
  }

  .watchlist-view__overlay {
    padding: 0.75rem;
  }
}
</style>
