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
        <span class="movie-card__placeholder-icon">🎬</span>
      </div>

      <div v-if="!imageLoaded && movie.poster_path" class="movie-card__skeleton"></div>

      <!-- Overlay com gradiente -->
      <div class="movie-card__overlay">
        <div class="movie-card__overlay-content">
          <div class="movie-card__play-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
          </div>
          <span class="movie-card__play-text">Ver Detalhes</span>
        </div>
      </div>

      <!-- Botão de favorito -->
      <button
        @click.stop="toggleFavorite"
        class="movie-card__favorite"
        :class="{ 'movie-card__favorite--active': isFavorite(movie.id) }"
        type="button"
        :aria-label="isFavorite(movie.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :fill="isFavorite(movie.id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      <!-- Rating badge -->
      <div v-if="movie.vote_average" class="movie-card__rating">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span>{{ formatRating(movie.vote_average) }}</span>
      </div>
    </div>

    <!-- Content info -->
    <div class="movie-card__content">
      <h3 class="movie-card__title">{{ movie.title }}</h3>

      <div class="movie-card__meta">
        <span v-if="movie.release_date" class="movie-card__year">
          {{ getYear(movie.release_date) }}
        </span>
        <span v-if="movie.vote_count" class="movie-card__votes">
          {{ formatVotes(movie.vote_count) }}
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
    return `${(votes / 1000).toFixed(1)}k avaliações`;
  }
  return `${votes} avaliações`;
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
/* ==================== CARD BASE ==================== */
.movie-card {
  position: relative;
  background: rgb(20, 20, 20);
  border-radius: 8px;
  overflow: visible; /* ✅ Permite hover expandir */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.movie-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: border-color 0.3s ease;
  pointer-events: none;
  z-index: 1;
}

/* ==================== HOVER ESTILO NETFLIX ==================== */
.movie-card:hover {
  transform: scale(1.05) translateY(-6px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8),
              0 0 0 2px rgba(229, 9, 20, 0.6);
  z-index: 50; /* ✅ Z-index maior */
}

.movie-card:hover::before {
  border-color: rgba(229, 9, 20, 0.6);
}

.movie-card--list {
  display: flex;
  flex-direction: row;
  transform: none;
}

.movie-card--list:hover {
  transform: translateX(8px);
}

/* ==================== POSTER ==================== */
.movie-card__poster-wrapper {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border-radius: 8px 8px 0 0;
}

.movie-card--list .movie-card__poster-wrapper {
  width: 200px;
  flex-shrink: 0;
  border-radius: 8px 0 0 8px;
}

.movie-card__poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.movie-card:hover .movie-card__poster {
  transform: scale(1.08);
}

.movie-card__poster-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.movie-card__placeholder-icon {
  font-size: 4rem;
  opacity: 0.3;
}

/* ==================== SKELETON LOADING ==================== */
.movie-card__skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(20, 20, 20, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(20, 20, 20, 0) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ==================== OVERLAY PLAY ==================== */
.movie-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    transparent 100%
  );
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
  z-index: 2;
  pointer-events: none;
  border-radius: 8px 8px 0 0; /* ✅ Mesmo border-radius */
  overflow: hidden; /* ✅ IMPORTANTE: Corta qualquer vazamento */
}

.movie-card--list .movie-card__overlay {
  border-radius: 8px 0 0 8px;
}

.movie-card:hover .movie-card__overlay {
  opacity: 1;
}

.movie-card__overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transform: translateY(10px);
  transition: transform 0.3s ease;
  pointer-events: auto; /* ✅ Permite clique no conteúdo */
}

.movie-card:hover .movie-card__overlay-content {
  transform: translateY(0);
}

.movie-card__play-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(229, 9, 20, 0.9);
  border-radius: 50%;
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(229, 9, 20, 0.5);
}

.movie-card:hover .movie-card__play-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(229, 9, 20, 0.7);
}

.movie-card__play-icon svg {
  width: 28px;
  height: 28px;
  margin-left: 4px;
}

.movie-card__play-text {
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ==================== BOTÃO FAVORITO ==================== */
.movie-card__favorite {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.movie-card:hover .movie-card__favorite {
  opacity: 1;
}

.movie-card__favorite:hover {
  background: rgba(229, 9, 20, 0.95);
  border-color: rgba(229, 9, 20, 0.8);
  transform: scale(1.15) rotate(10deg);
}

.movie-card__favorite--active {
  background: rgba(229, 9, 20, 0.9);
  border-color: rgba(229, 9, 20, 0.6);
  color: #fff;
}

.movie-card__favorite--active:hover {
  transform: scale(1.15) rotate(-10deg);
}

.movie-card__favorite svg {
  width: 22px;
  height: 22px;
}

/* ==================== RATING BADGE ==================== */
.movie-card__rating {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 6px;
  color: #fbbf24;
  font-weight: 700;
  font-size: 0.875rem;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.movie-card__rating svg {
  width: 16px;
  height: 16px;
}

/* ==================== CONTENT ==================== */
.movie-card__content {
  padding: 1.25rem;
}

.movie-card--list .movie-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.movie-card__title {
  color: #fff;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.movie-card:hover .movie-card__title {
  color: #e50914;
}

.movie-card__meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 500;
}

.movie-card__year {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.movie-card__overview {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* ==================== GENRES ==================== */
.movie-card__genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.movie-card__genre {
  padding: 0.375rem 0.75rem;
  background: rgba(229, 9, 20, 0.15);
  border: 1px solid rgba(229, 9, 20, 0.3);
  border-radius: 4px;
  color: #ff6b6b;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.movie-card:hover .movie-card__genre {
  background: rgba(229, 9, 20, 0.25);
  border-color: rgba(229, 9, 20, 0.5);
  color: #ff4444;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 768px) {
  .movie-card:hover {
    transform: scale(1.02) translateY(-4px);
  }

  .movie-card--list {
    flex-direction: column;
  }

  .movie-card--list .movie-card__poster-wrapper {
    width: 100%;
    border-radius: 8px 8px 0 0;
  }

  .movie-card--list .movie-card__overlay {
    border-radius: 8px 8px 0 0;
  }

  .movie-card__play-icon {
    width: 56px;
    height: 56px;
  }

  .movie-card__play-icon svg {
    width: 24px;
    height: 24px;
  }
}

/* ==================== ANIMAÇÃO DE ENTRADA ==================== */
@media (prefers-reduced-motion: no-preference) {
  .movie-card {
    animation: fadeInUp 0.4s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
