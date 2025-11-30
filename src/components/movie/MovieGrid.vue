<template>
  <div class="movie-grid">
    <div
      class="movie-grid__container"
      :class="{
        'movie-grid__container--grid': viewMode === 'grid',
        'movie-grid__container--list': viewMode === 'list'
      }"
    >
      <MovieCard
        v-for="movie in movies"
        :key="movie.id"
        :movie="movie"
        :view-mode="viewMode"
      />
    </div>

    <div v-if="movies.length === 0 && !loading" class="movie-grid__empty">
      <span class="movie-grid__empty-icon">🎬</span>
      <h3>Nenhum filme encontrado</h3>
      <p>Tente ajustar seus filtros ou buscar por outro termo</p>
    </div>

    <div v-if="hasMore && !loading" class="movie-grid__load-more">
      <button @click="$emit('load-more')" class="movie-grid__load-more-btn">
        Carregar Mais Filmes
      </button>
    </div>
  </div>
</template>

<script setup>
import MovieCard from './MovieCard.vue';

defineProps({
  movies: {
    type: Array,
    required: true,
  },
  viewMode: {
    type: String,
    default: 'grid',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['load-more']);
</script>

<style scoped>
/* ==================== CONTAINER PRINCIPAL ==================== */
.movie-grid {
  width: 100%;
  overflow: visible; /* ✅ Permite hover expandir */
  padding: 4rem 0; /* ✅ Padding generoso */
}

/* ==================== GRID E LIST ==================== */
.movie-grid__container--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 3rem 2rem; /* ✅ Gap vertical grande */
  overflow: visible;
  padding: 1rem 0;
}

.movie-grid__container--list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: visible;
  padding: 1rem 0;
}

/* ==================== EMPTY STATE ==================== */
.movie-grid__empty {
  text-align: center;
  padding: 6rem 2rem;
  color: #6b7280;
}

.movie-grid__empty-icon {
  font-size: 5rem;
  display: block;
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.movie-grid__empty h3 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #fff;
}

.movie-grid__empty p {
  font-size: 1.125rem;
  color: #9ca3af;
}

/* ==================== LOAD MORE ==================== */
.movie-grid__load-more {
  text-align: center;
  margin-top: 4rem;
  padding: 2rem 0;
}

.movie-grid__load-more-btn {
  padding: 1.25rem 3rem;
  background: rgba(229, 9, 20, 0.1);
  border: 2px solid rgba(229, 9, 20, 0.5);
  border-radius: 8px;
  color: #e50914;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.movie-grid__load-more-btn:hover {
  background: rgba(229, 9, 20, 0.2);
  border-color: #e50914;
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(229, 9, 20, 0.3);
}

.movie-grid__load-more-btn:active {
  transform: translateY(-1px);
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 1200px) {
  .movie-grid__container--grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 2rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .movie-grid {
    padding: 2rem 0;
  }

  .movie-grid__container--grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem 1rem;
  }

  .movie-grid__container--list {
    gap: 1.5rem;
  }

  .movie-grid__empty {
    padding: 4rem 1rem;
  }

  .movie-grid__empty-icon {
    font-size: 4rem;
  }

  .movie-grid__empty h3 {
    font-size: 1.5rem;
  }

  .movie-grid__load-more-btn {
    padding: 1rem 2rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .movie-grid__container--grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
}
</style>
