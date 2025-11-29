<template>
  <div class="movie-rating">
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

    <div v-else class="movie-rating__container">
      <p class="movie-rating__label">{{ userRating ? 'Sua avaliação:' : 'Avaliar este filme:' }}</p>
      <div class="movie-rating__stars">
        <button
          v-for="star in 5"
          :key="star"
          @click="handleRate(star)"
          @mouseenter="hoverRating = star"
          @mouseleave="hoverRating = 0"
          class="movie-rating__star"
          :class="{ 'movie-rating__star--active': star <= (hoverRating || userRating) }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="star <= (hoverRating || userRating) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
      </div>
      <p v-if="userRating" class="movie-rating__value">{{ userRating }}/5</p>

      <button
        v-if="userRating"
        @click="handleDeleteRating"
        class="movie-rating__delete-btn"
      >
        Remover avaliação
      </button>
    </div>

    <Transition name="fade">
      <div v-if="message" class="movie-rating__message" :class="{ 'movie-rating__message--error': isError }">
        {{ message }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  movieId: {
    type: Number,
    required: true,
  },
});

const { isAuthenticated } = useAuth();
const authStore = useAuthStore();

const userRating = ref(0);
const hoverRating = ref(0);
const message = ref('');
const isError = ref(false);

const handleRate = async (rating) => {
  const success = await authStore.rateMovie(props.movieId, rating);

  if (success) {
    userRating.value = rating;
    message.value = 'Avaliação salva com sucesso!';
    isError.value = false;
  } else {
    message.value = 'Erro ao salvar avaliação';
    isError.value = true;
  }

  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const handleDeleteRating = async () => {
  if (confirm('Deseja remover sua avaliação?')) {
    const success = await authStore.deleteRating(props.movieId);

    if (success) {
      userRating.value = 0;
      message.value = 'Avaliação removida';
      isError.value = false;
    } else {
      message.value = 'Erro ao remover avaliação';
      isError.value = true;
    }

    setTimeout(() => {
      message.value = '';
    }, 3000);
  }
};

onMounted(async () => {
  if (isAuthenticated.value) {
    try {
      const ratedMovies = await authStore.getRatedMovies();
      const ratedMovie = ratedMovies.find(m => m.id === props.movieId);
      if (ratedMovie) {
        userRating.value = ratedMovie.rating;
      }
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
    }
  }
});


</script>

<style scoped>
.movie-rating {
  margin: 2rem 0;
}

.movie-rating__login-btn {
  display: flex;
  align-items: center;
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

.movie-rating__login-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
}

.movie-rating__login-btn svg {
  width: 20px;
  height: 20px;
}

.movie-rating__container {
  padding: 1.7rem 1.5rem 1.5rem 2rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.75rem;
}

.movie-rating__label {
  color: #d1d5db;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.movie-rating__stars {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.movie-rating__star {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
}

.movie-rating__star:hover {
  transform: scale(1.2);
}

.movie-rating__star svg {
  width: 32px;
  height: 32px;
}

.movie-rating__star--active {
  color: #fbbf24;
}

.movie-rating__value {
  color: #fbbf24;
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.movie-rating__delete-btn {
  padding: 0.5rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.375rem;
  color: #fca5a5;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.movie-rating__delete-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  color: #dc2626;
}

.movie-rating__message {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 0.5rem;
  color: #86efac;
  font-size: 0.875rem;
}

.movie-rating__message--error {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
  color: #fca5a5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
