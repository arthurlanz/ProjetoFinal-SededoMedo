<template>
  <div class="ratings-view">
    <div class="container">
      <header class="ratings-view__header">
        <h1 class="ratings-view__title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
          Minhas Avaliações
        </h1>
        <p class="ratings-view__subtitle">
          {{ movies.length }} {{ movies.length === 1 ? 'filme avaliado' : 'filmes avaliados' }}
        </p>
      </header>
      <LoadingScreen :loading="loading" text="Carregando avaliações..." />

      <div v-if="!loading && movies.length > 0">
        <div class="ratings-view__grid">
          <div
            v-for="movie in movies"
            :key="movie.id"
            class="ratings-view__card"
            @click="goToMovie(movie.id)"
          >
            <img
              v-if="movie.poster_path"
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title"
              class="ratings-view__poster"
            />
            <div v-else class="ratings-view__poster-placeholder">
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

            <div class="ratings-view__info">
              <h3 class="ratings-view__movie-title">{{ movie.title }}</h3>
              <div class="ratings-view__rating">
                <div class="ratings-view__stars">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    :fill="star <= movie.rating / 2 ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polygon
                      points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                    />
                  </svg>
                </div>
                <span class="ratings-view__rating-value">{{ movie.rating }}/10</span>
              </div>
              <p v-if="movie.release_date" class="ratings-view__year">
                {{ new Date(movie.release_date).getFullYear() }}
              </p>
            </div>

            <button
              @click.stop="handleDeleteRating(movie.id)"
              class="ratings-view__delete"
              title="Remover avaliação"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path
                  d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div v-if="!loading && movies.length === 0" class="ratings-view__empty">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
        <h2>Você ainda não avaliou nenhum filme</h2>
        <p>Comece a avaliar seus filmes favoritos!</p>
        <button @click="goHome" class="ratings-view__cta">Explorar Filmes</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getImageUrl } from '@/plugins/axios'
import LoadingScreen from '@/components/layout/LoadingScreen.vue'

const router = useRouter()
const authStore = useAuthStore()

const movies = ref([])
const loading = ref(true)

const getPosterUrl = (path) => {
  return getImageUrl(path, 'w500')
}

const goToMovie = (id) => {
  router.push({ name: 'movie-detail', params: { id } })
}

const goHome = () => {
  router.push({ name: 'home' })
}

const handleDeleteRating = async (movieId) => {
  if (confirm('Deseja remover sua avaliação deste filme?')) {
    const success = await authStore.deleteRating(movieId)
    if (success) {
      movies.value = movies.value.filter((m) => m.id !== movieId)
    }
  }
}

onMounted(async () => {
  try {
    movies.value = await authStore.getRatedMovies()
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error)
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.ratings-view__header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.ratings-view__title {
  display: inline-flex;
  align-items: center;
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

@media (max-width: 768px) {
  .ratings-view__title {
    font-size: 2rem;
  }

  .ratings-view__title svg {
    width: 36px;
    height: 36px;
  }

  .ratings-view__grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
}
</style>
