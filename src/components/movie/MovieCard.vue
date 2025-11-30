<template>
  <div
    class="movie-card"
    :class="{ 'movie-card--list': viewMode === 'list' }"
    @click="goToDetail"
  >
    <div class="movie-card__poster-wrapper">
      <img
        v-if="movie.poster_path"
        v-lazy="getPosterUrl(movie.poster_path)"
        :alt="movie.title"
        class="movie-card__poster"
        @load="onImageLoad"
        @error="onImageError"
      />
      <div v-else class="movie-card__poster-placeholder">
        <font-awesome-icon :icon="['fas', 'film']" />
      </div>

      <div v-if="!imageLoaded && movie.poster_path" class="movie-card__skeleton"></div>

      <div class="movie-card__overlay">
        <div class="movie-card__play-icon">
          <font-awesome-icon :icon="['fas', 'play']" />
        </div>
      </div>

      <button
        @click.stop="toggleFavorite"
        class="movie-card__favorite"
        :class="{ 'movie-card__favorite--active': isFavorite(movie.id) }"
        type="button"
      >
        <font-awesome-icon
          :icon="isFavorite(movie.id) ? ['fas', 'heart'] : ['far', 'heart']"
        />
      </button>

      <div v-if="movie.vote_average" class="movie-card__rating">
        <font-awesome-icon :icon="['fas', 'star']" />
        <span>{{ formatRating(movie.vote_average) }}</span>
      </div>
    </div>

    <div class="movie-card__content">
      <h3 class="movie-card__title">{{ movie.title }}</h3>

      <div class="movie-card__meta">
        <span v-if="movie.release_date" class="movie-card__year">
          <font-awesome-icon :icon="['fas', 'calendar']" />
          {{ getYear(movie.release_date) }}
        </span>

        <span v-if="movie.vote_count" class="movie-card__votes">
          {{ formatVotes(movie.vote_count) }} avaliações
        </span>
      </div>

      <p v-if="viewMode === 'list' && movie.overview" class="movie-card__overview">
        {{ truncateText(movie.overview, 150) }}
      </p>

      <div class="movie-card__genres">
        <span
          v-for="genreId in movie.genre_ids.slice(0, 3)"
          :key="genreId"
          class="movie-card__genre"
        >
          {{ getGenreName(genreId) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGenreStore } from '@/stores/genre';
import { useFavorites } from '@/composables/useFavorites';
import { getImageUrl } from '@/plugins/axios';

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  viewMode: {
    type: String,
    default: 'grid',
  },
});

const router = useRouter();
const genreStore = useGenreStore();
const { isFavorite, toggleFavorite: toggleFav } = useFavorites();

const imageLoaded = ref(false);
const imageError = ref(false);

const getPosterUrl = (path) => {
  return getImageUrl(path, 'w500');
};

const onImageLoad = () => {
  imageLoaded.value = true;
};

const onImageError = () => {
  imageError.value = true;
};

const getGenreName = (id) => {
  try {
    return genreStore.getGenreName(id);
  } catch {
    return '';
  }
};

const getYear = (date) => {
  return new Date(date).getFullYear();
};

const formatRating = (rating) => {
  return rating.toFixed(1);
};

const formatVotes = (votes) => {
  if (votes >= 1000) {
    return `${(votes / 1000).toFixed(1)}k`;
  }
  return votes;
};

const truncateText = (text, length) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const goToDetail = () => {
  router.push({ name: 'movie-detail', params: { id: props.movie.id } });
};

const toggleFavorite = () => {
  toggleFav(props.movie);
};
</script>

<style scoped>
.movie-card {
  position: relative;
  background: linear-gradient(to bottom, #1f2937, #000000);
  border: 1px solid rgba(139, 0, 0, 0.3);
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.movie-card:hover {
  border-color: #dc2626;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
  transform: translateY(-5px);
}

.movie-card--list {
  display: flex;
  flex-direction: row;
}

.movie-card__poster-wrapper {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: #111827;
}

.movie-card--list .movie-card__poster-wrapper {
  width: 200px;
  flex-shrink: 0;
}

.movie-card__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .movie-card__poster {
  transform: scale(1.1);
}

.movie-card__poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #374151;
  color: #6b7280;
}

.movie-card__poster-placeholder svg {
  width: 60px;
  height: 60px;
}

.movie-card__skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #1f2937 0%, #374151 50%, #1f2937 100%);
  background-size: 200% 100%;
  animation: skeleton 1.5s ease-in-out infinite;
}

@keyframes skeleton {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.movie-card__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.movie-card:hover .movie-card__overlay {
  opacity: 1;
}

.movie-card__play-icon {
  font-size: 3.75rem;
  color: #dc2626;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.8));
}

.movie-card__favorite {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie-card__favorite:hover {
  background: rgba(220, 38, 38, 0.9);
  transform: scale(1.1);
}

.movie-card__favorite--active {
  background: #dc2626;
  color: white;
}

.movie-card__favorite svg {
  width: 20px;
  height: 20px;
}

.movie-card__rating {
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.625rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 0.375rem;
  color: #fbbf24;
  font-weight: 700;
  font-size: 0.875rem;
}

.movie-card__rating svg {
  width: 14px;
  height: 14px;
}

.movie-card__content {
  padding: 1rem;
}

.movie-card--list .movie-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.movie-card__title {
  color: #dc2626;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.movie-card__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.movie-card__year {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.movie-card__year svg {
  width: 14px;
  height: 14px;
}

.movie-card__overview {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.movie-card__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.movie-card__genre {
  padding: 0.25rem 0.625rem;
  background: rgba(139, 0, 0, 0.3);
  border: 1px solid rgba(139, 0, 0, 0.5);
  border-radius: 0.25rem;
  color: #fca5a5;
  font-size: 0.75rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .movie-card--list {
    flex-direction: column;
  }

  .movie-card--list .movie-card__poster-wrapper {
    width: 100%;
  }
}
</style>
