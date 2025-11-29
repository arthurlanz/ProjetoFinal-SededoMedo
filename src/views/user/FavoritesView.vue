
<template>
  <div class="favorites">
    <div class="container">
      <header class="favorites__header">
        <h1 class="favorites__title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
          Meus Favoritos
        </h1>
        <p class="favorites__subtitle">
          {{ favorites.length }} {{ favorites.length === 1 ? 'filme' : 'filmes' }} salvos
        </p>
      </header>

      <!-- Favorites Grid -->
      <div v-if="favorites.length > 0" class="favorites__grid">
        <div
          v-for="movie in favorites"
          :key="movie.id"
          @click="goToMovie(movie.id)"
          class="favorites__card"
        >
          <img
            v-if="movie.poster_path"
            :src="getPosterUrl(movie.poster_path)"
            :alt="movie.title"
            class="favorites__poster"
          />
          <div v-else class="favorites__poster-placeholder">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            </svg>
          </div>

          <button
            @click.stop="removeFromFavorites(movie.id)"
            class="favorites__remove"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div class="favorites__info">
            <h3 class="favorites__movie-title">{{ movie.title }}</h3>
            <div class="favorites__meta">
              <span v-if="movie.vote_average" class="favorites__rating">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
                {{ movie.vote_average.toFixed(1) }}
              </span>
              <span v-if="movie.release_date" class="favorites__year">
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
            </div>
            <p v-if="movie.addedAt" class="favorites__added">
              Adicionado em {{ formatDate(movie.addedAt) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="favorites__empty">
        <svg
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
        <h2>Nenhum favorito ainda</h2>
        <p>Comece a adicionar seus filmes de terror favoritos!</p>
        <button @click="goHome" class="favorites__cta">Explorar Filmes</button>
      </div>

      <!-- History Section -->
      <section v-if="history.length > 0" class="favorites__history-section">
        <div class="favorites__history-header">
          <h2 class="favorites__section-title">
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
            Histórico Recente
          </h2>
          <button @click="clearHistory" class="favorites__clear-btn">Limpar Histórico</button>
        </div>

        <div class="favorites__history">
          <div
            v-for="item in history"
            :key="item.id"
            @click="goToMovie(item.id)"
            class="favorites__history-item"
          >
            <img
              v-if="item.poster_path"
              :src="getPosterUrl(item.poster_path, 'w92')"
              :alt="item.title"
              class="favorites__history-poster"
            />
            <div class="favorites__history-info">
              <p class="favorites__history-title">{{ item.title }}</p>
              <p class="favorites__history-time">{{ formatTimeAgo(item.viewedAt) }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import { getImageUrl } from '@/plugins/axios'

const router = useRouter()
const { favorites, history, removeFromFavorites, clearHistory: clearHistoryAction } = useFavorites()

const getPosterUrl = (path, size = 'w500') => {
  return getImageUrl(path, size)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { day: 'numeric', month: 'short', year: 'numeric' }
  return date.toLocaleDateString('pt-BR', options)
}

const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Agora mesmo'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`

  return formatDate(dateString)
}

const goToMovie = (id) => {
  router.push({ name: 'movie-detail', params: { id } })
}

const goHome = () => {
  router.push({ name: 'home' })
}

const clearHistory = () => {
  if (confirm('Deseja realmente limpar todo o histórico?')) {
    clearHistoryAction()
  }
}
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.favorites__header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.favorites__title {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
}

.favorites__title svg {
  width: 48px;
  height: 48px;
}

.favorites__subtitle {
  color: #9ca3af;
  font-size: 1.125rem;
}

.favorites__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.favorites__card {
  position: relative;
  background: linear-gradient(to bottom, #1f2937, #000000);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorites__card:hover {
  border-color: #dc2626;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
  transform: translateY(-5px);
}

.favorites__poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
}

.favorites__poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  background: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.favorites__poster-placeholder svg {
  width: 60px;
  height: 60px;
}

.favorites__remove {
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

.favorites__card:hover .favorites__remove {
  opacity: 1;
}

.favorites__remove:hover {
  background: #b91c1c;
  transform: scale(1.1) rotate(90deg);
}

.favorites__remove svg {
  width: 18px;
  height: 18px;
}

.favorites__info {
  padding: 1rem;
}

.favorites__movie-title {
  color: #dc2626;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.favorites__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.favorites__rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
  font-weight: 700;
}

.favorites__rating svg {
  width: 14px;
  height: 14px;
}

.favorites__added {
  color: #6b7280;
  font-size: 0.75rem;
}

.favorites__empty {
  text-align: center;
  padding: 6rem 2rem;
  color: #6b7280;
}

.favorites__empty svg {
  width: 100px;
  height: 100px;
  margin: 0 auto 2rem;
  color: #374151;
}

.favorites__empty h2 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.favorites__empty p {
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.favorites__cta {
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

.favorites__cta:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.favorites__history-section {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid rgba(220, 38, 38, 0.2);
}

.favorites__history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.favorites__section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #dc2626;
}

.favorites__section-title svg {
  width: 28px;
  height: 28px;
}

.favorites__clear-btn {
  padding: 0.5rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorites__clear-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
}

.favorites__history {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.favorites__history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorites__history-item:hover {
  background: rgba(31, 41, 55, 0.8);
  border-color: #dc2626;
  transform: translateX(5px);
}

.favorites__history-poster {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}
.favorites__history-info {
  flex: 1;
  min-width: 0;
}
.favorites__history-title {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.favorites__history-time {
  color: #6b7280;
  font-size: 0.75rem;
}
@media (max-width: 768px) {
  .favorites__title {
    font-size: 2rem;
  }
  .favorites__title svg {
    width: 36px;
    height: 36px;
  }
  .favorites__grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  .favorites__history {
    grid-template-columns: 1fr;
  }
}
</style>
