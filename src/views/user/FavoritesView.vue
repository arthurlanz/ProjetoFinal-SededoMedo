<template>
  <div class="favorites">
    <div class="container">
      <header class="favorites__header">
        <h1 class="favorites__title">
          <Heart :size="40" :fill="'currentColor'" />
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
          class="favorites__card"
        >
          <div @click="goToMovie(movie.id)" class="favorites__card-inner">
            <img
              v-if="movie.poster_path"
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title"
              class="favorites__poster"
            />
            <div v-else class="favorites__poster-placeholder">
              <Film :size="60" />
            </div>

            <div class="favorites__info">
              <h3 class="favorites__movie-title">{{ movie.title }}</h3>
              <div class="favorites__meta">
                <span v-if="movie.release_date" class="favorites__year">
                  {{ new Date(movie.release_date).getFullYear() }}
                </span>
                <span v-if="movie.vote_average" class="favorites__rating">
                  <Star :size="14" :fill="'currentColor'" />
                  {{ movie.vote_average.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>

          <button
            @click="removeFavorite(movie.id)"
            class="favorites__remove-btn"
            title="Remover dos favoritos"
          >
            <X :size="18" />
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="favorites__empty">
        <Heart :size="120" />
        <h2>Nenhum favorito ainda</h2>
        <p>Comece a adicionar seus filmes de terror favoritos!</p>
        <router-link to="/" class="favorites__cta-btn">
          Explorar Filmes
        </router-link>
      </div>

      <!-- History Section -->
      <section v-if="history.length > 0" class="favorites__history">
        <div class="favorites__history-header">
          <h2 class="favorites__history-title">
            <Clock :size="28" />
            Histórico Recente
          </h2>
          <button @click="showClearHistoryModal = true" class="favorites__clear-btn">
            <Trash2 :size="18" />
            Limpar Histórico
          </button>
        </div>

        <div class="favorites__history-grid">
          <div
            v-for="movie in history"
            :key="movie.id"
            @click="goToMovie(movie.id)"
            class="favorites__history-card"
          >
            <img
              v-if="movie.poster_path"
              :src="getPosterUrl(movie.poster_path)"
              :alt="movie.title"
              class="favorites__history-poster"
            />
            <div v-else class="favorites__poster-placeholder">
              <Film :size="40" />
            </div>
            <p class="favorites__history-name">{{ movie.title }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showClearHistoryModal" class="modal-overlay" @click="showClearHistoryModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <AlertCircle :size="48" />
            <h3>Limpar Histórico</h3>
          </div>
          <p class="modal-message">
            Deseja realmente limpar todo o histórico? Esta ação não pode ser desfeita.
          </p>
          <div class="modal-actions">
            <button @click="showClearHistoryModal = false" class="modal-btn modal-btn--cancel">
              Cancelar
            </button>
            <button @click="confirmClearHistory" class="modal-btn modal-btn--confirm">
              Limpar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Heart, Film, Star, Clock, Trash2, AlertCircle, X } from 'lucide-vue-next';
import { useFavorites } from '@/composables/useFavorites';
import { getImageUrl } from '@/plugins/axios';

const router = useRouter();
const { favorites, history, removeFromFavorites, clearHistory } = useFavorites();

const showClearHistoryModal = ref(false);

const getPosterUrl = (path) => {
  return getImageUrl(path, 'w500');
};

const goToMovie = (id) => {
  router.push({ name: 'movie-detail', params: { id } });
};

const removeFavorite = (id) => {
  removeFromFavorites(id);
};

const confirmClearHistory = () => {
  clearHistory();
  showClearHistoryModal.value = false;
};
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.favorites__header {
  text-align: center;
  margin-bottom: 3rem;
}

.favorites__title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 900;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.favorites__subtitle {
  color: #9ca3af;
  font-size: 1.125rem;
}

.favorites__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.favorites__card {
  position: relative;
  background: linear-gradient(to bottom, #1f2937, #000000);
  border: 1px solid rgba(139, 0, 0, 0.3);
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.favorites__card:hover {
  border-color: #dc2626;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
  transform: translateY(-5px);
}

.favorites__card-inner {
  cursor: pointer;
}

.favorites__poster,
.favorites__poster-placeholder {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  background: #111827;
}

.favorites__poster-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.favorites__remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 38, 38, 0.5);
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 10;
}

.favorites__card:hover .favorites__remove-btn {
  opacity: 1;
}

.favorites__remove-btn:hover {
  background: #dc2626;
  border-color: #dc2626;
  transform: scale(1.1);
}

.favorites__info {
  padding: 1rem;
}

.favorites__movie-title {
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

.favorites__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.favorites__rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
}

.favorites__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  color: #374151;
}

.favorites__empty h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #dc2626;
  margin: 2rem 0 1rem;
}

.favorites__empty p {
  color: #9ca3af;
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.favorites__cta-btn {
  padding: 1rem 2rem;
  background: #dc2626;
  border-radius: 0.5rem;
  color: white;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.favorites__cta-btn:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.favorites__history {
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 2px solid rgba(220, 38, 38, 0.3);
}

.favorites__history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.favorites__history-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 800;
  color: #dc2626;
}

.favorites__clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorites__clear-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
}

.favorites__history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.favorites__history-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.favorites__history-card:hover {
  transform: scale(1.05);
}

.favorites__history-poster {
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 2px solid rgba(220, 38, 38, 0.2);
  margin-bottom: 0.5rem;
}

.favorites__history-name {
  color: #d1d5db;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(to bottom, #1f2937, #111827);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #dc2626;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
}

.modal-message {
  color: #d1d5db;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-btn {
  flex: 1;
  padding: 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn--cancel {
  background: rgba(107, 114, 128, 0.2);
  color: #d1d5db;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.modal-btn--cancel:hover {
  background: rgba(107, 114, 128, 0.3);
  border-color: #6b7280;
}

.modal-btn--confirm {
  background: #dc2626;
  color: white;
}

.modal-btn--confirm:hover {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(220, 38, 38, 0.4);
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
  opacity: 0;
}

@media (max-width: 768px) {
  .favorites__title {
    font-size: 2rem;
  }

  .favorites__grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .favorites__history-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .favorites__clear-btn {
    width: 100%;
    justify-content: center;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
