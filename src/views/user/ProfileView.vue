<template>
  <div class="profile-view">
    <div class="container">
      <div class="profile-view__header">
        <div class="profile-view__avatar-section">
          <img
            v-if="user.avatar"
            :src="user.avatar"
            :alt="user.name"
            class="profile-view__avatar"
          />
          <div v-else class="profile-view__avatar-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="profile-view__info">
            <h1 class="profile-view__name">{{ user.name }}</h1>
            <p class="profile-view__username">@{{ user.username }}</p>
          </div>
        </div>

        <button @click="logout" class="profile-view__logout-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sair
        </button>
      </div>

      <div class="profile-view__stats">
        <div class="profile-view__stat">
          <div class="profile-view__stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div class="profile-view__stat-info">
            <span class="profile-view__stat-value">{{ favoriteMovies.length }}</span>
            <span class="profile-view__stat-label">Favoritos</span>
          </div>
        </div>

        <div class="profile-view__stat">
          <div class="profile-view__stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="profile-view__stat-info">
            <span class="profile-view__stat-value">{{ ratedMovies.length }}</span>
            <span class="profile-view__stat-label">Avaliações</span>
          </div>
        </div>

        <div class="profile-view__stat">
          <div class="profile-view__stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="profile-view__stat-info">
            <span class="profile-view__stat-value">{{ watchlistMovies.length }}</span>
            <span class="profile-view__stat-label">Watchlist</span>
          </div>
        </div>
      </div>

      <div class="profile-view__sections">
        <section class="profile-view__section">
          <div class="profile-view__section-header">
            <h2 class="profile-view__section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              Filmes Favoritos
            </h2>
            <router-link to="/favorites" class="profile-view__section-link">
              Ver todos
            </router-link>
          </div>

          <div v-if="loading" class="profile-view__loading">
            <LoadingScreen :loading="true" text="Carregando..." />
          </div>

          <div v-else-if="favoriteMovies.length > 0" class="profile-view__movies">
            <MovieCard
              v-for="movie in favoriteMovies.slice(0, 6)"
              :key="movie.id"
              :movie="movie"
              view-mode="grid"
            />
          </div>

          <div v-else class="profile-view__empty">
            <p>Você ainda não tem filmes favoritos</p>
          </div>
        </section>

        <section class="profile-view__section">
          <div class="profile-view__section-header">
            <h2 class="profile-view__section-title">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              Lista de Desejos
            </h2>
            <router-link to="/watchlist" class="profile-view__section-link">
              Ver todos
            </router-link>
          </div>

          <div v-if="watchlistMovies.length > 0" class="profile-view__movies">
            <MovieCard
              v-for="movie in watchlistMovies.slice(0, 6)"
              :key="movie.id"
              :movie="movie"
              view-mode="grid"
            />
          </div>

          <div v-else class="profile-view__empty">
            <p>Sua lista de desejos está vazia</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/auth';
import MovieCard from '@/components/movie/MovieCard.vue';
import LoadingScreen from '@/components/layout/LoadingScreen.vue';

const { user, logout } = useAuth();
const authStore = useAuthStore();

const favoriteMovies = ref([]);
const watchlistMovies = ref([]);
const ratedMovies = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const [favorites, watchlist, rated] = await Promise.all([
      authStore.getFavoriteMovies(),
      authStore.getWatchlist(),
      authStore.getRatedMovies(),
    ]);

    favoriteMovies.value = favorites;
    watchlistMovies.value = watchlist;
    ratedMovies.value = rated;
  } catch (error) {
    console.error('Erro ao carregar dados do perfil:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

.profile-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(0, 0, 0, 0.5) 100%);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 1rem;
}

.profile-view__avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-view__avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #dc2626;
  box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
}

.profile-view__avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  border: 3px solid rgba(220, 38, 38, 0.3);
}

.profile-view__avatar-placeholder svg {
  width: 50px;
  height: 50px;
}

.profile-view__info {
  flex: 1;
}

.profile-view__name {
  font-size: 2rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}

.profile-view__username {
  font-size: 1.125rem;
  color: #9ca3af;
}

.profile-view__logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-view__logout-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
}

.profile-view__logout-btn svg {
  width: 18px;
  height: 18px;
}

.profile-view__stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.profile-view__stat {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.profile-view__stat:hover {
  border-color: #dc2626;
  transform: translateY(-2px);
}

.profile-view__stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(220, 38, 38, 0.2);
  border-radius: 0.5rem;
  color: #dc2626;
}

.profile-view__stat-icon svg {
  width: 28px;
  height: 28px;
}

.profile-view__stat-info {
  display: flex;
  flex-direction: column;
}

.profile-view__stat-value {
  font-size: 2rem;
  font-weight: 900;
  color: white;
}

.profile-view__stat-label {
  font-size: 0.875rem;
  color: #9ca3af;
}

.profile-view__sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.profile-view__section {
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(220, 38, 38, 0.2);
}

.profile-view__section:last-child {
  border-bottom: none;
}

.profile-view__section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-view__section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #dc2626;
}

.profile-view__section-title svg {
  width: 28px;
  height: 28px;
}

.profile-view__section-link {
  color: #9ca3af;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.profile-view__section-link:hover {
  color: #dc2626;
}

.profile-view__loading {
  padding: 4rem 0;
}

.profile-view__movies {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.profile-view__empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
  font-size: 1.125rem;
}

@media (max-width: 768px) {
  .profile-view__header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .profile-view__avatar-section {
    flex-direction: column;
  }

  .profile-view__name {
    font-size: 1.5rem;
  }

  .profile-view__stats {
    grid-template-columns: 1fr;
  }

  .profile-view__movies {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
