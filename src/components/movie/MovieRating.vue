<template>
  <div class="movie-rating">
    <!-- Login Button -->
    <button
      v-if="!isAuthenticated"
      @click="$router.push('/login')"
      class="movie-rating__login-btn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Faça login para avaliar
    </button>

    <!-- Rating Button -->
    <button
      v-else
      @click="openModal"
      class="movie-rating__rate-btn"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      {{ userRating ? `Sua avaliação: ${userRating}/10` : 'Avaliar este filme' }}
    </button>

    <!-- Stats Display -->
    <div v-if="voteAverage && voteCount" class="movie-rating__stats">
      <div class="movie-rating__stat">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span class="movie-rating__stat-value">{{ voteAverage.toFixed(1) }}</span>
        <span class="movie-rating__stat-label">/10</span>
      </div>
      <div class="movie-rating__stat-votes">
        {{ formatVotes(voteCount) }} avaliações
      </div>
    </div>

    <!-- Modal -->
    <MovieRatingModal
      :visible="showModal"
      :movie-id="movieId"
      :media-type="mediaType"
      :initial-rating="userRating"
      @close="showModal = false"
      @rated="handleRated"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/auth';
import api from '@/plugins/axios';
import MovieRatingModal from '@/components/modal/MovieRatingModal.vue';

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
  mediaType: {
    type: String,
    default: 'movie',
  },
  voteAverage: {
    type: Number,
    default: 0,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
});

const { isAuthenticated } = useAuth();
const authStore = useAuthStore();

const showModal = ref(false);
const userRating = ref(0);

const formatVotes = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count;
};

const openModal = () => {
  showModal.value = true;
};

const handleRated = (rating) => {
  userRating.value = rating;
};

const fetchUserRating = async () => {
  if (!isAuthenticated.value || !authStore.accountId) return;

  try {
    const sessionId = authStore.sessionId;
    const endpoint = props.mediaType === 'movie' ? 'movies' : 'tv';

    const response = await api.get(`account/${authStore.accountId}/rated/${endpoint}`, {
      params: {
        session_id: sessionId,
        language: 'pt-BR',
      },
    });

    const rated = response.data.results.find((item) => item.id === props.movieId);
    if (rated && rated.rating) {
      userRating.value = rated.rating;
    }
  } catch (error) {
    console.error('Erro ao carregar avaliação do usuário:', error);
  }
};

onMounted(() => {
  if (isAuthenticated.value) {
    fetchUserRating();
  }
});
</script>

<style scoped>
.movie-rating {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movie-rating__login-btn,
.movie-rating__rate-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(220, 38, 38, 0.1);
  border: 2px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.movie-rating__login-btn:hover,
.movie-rating__rate-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  transform: translateY(-2px);
}

.movie-rating__login-btn svg,
.movie-rating__rate-btn svg {
  width: 20px;
  height: 20px;
}

.movie-rating__stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(39, 39, 39, 0.5);
  border: 1px solid rgba(53, 53, 53, 0.719);
  border-radius: 0.5rem;
}

.movie-rating__stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.movie-rating__stat svg {
  width: 20px;
  height: 20px;
  color: #fbbf24;
}

.movie-rating__stat-value {
  color: #fff;
  font-size: 1.25rem;
  font-weight: 700;
}

.movie-rating__stat-label {
  color: #9ca3af;
  font-size: 0.875rem;
}

.movie-rating__stat-votes {
  color: #9ca3af;
  font-size: 0.875rem;
}
</style>
