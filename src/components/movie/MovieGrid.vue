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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 12a6 6 0 0 0-12 0v3c0 1.657 1.343 3 3 3h6c1.657 0 3-1.343 3-3v-3Z"/>
          <circle cx="9" cy="12" r="1"/>
          <circle cx="15" cy="12" r="1"/>
          <path d="M12 18v3"/>
        </svg>
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
  .movie-grid {
    width: 100%;
  }
  
  .movie-grid__container--grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .movie-grid__container--list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .movie-grid__empty {
    text-align: center;
    padding: 4rem 2rem;
    color: #6b7280;
  }
  
  .movie-grid__empty svg {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: #374151;
  }
  
  .movie-grid__empty h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .movie-grid__empty p {
    font-size: 1rem;
  }
  
  .movie-grid__load-more {
    text-align: center;
    margin-top: 3rem;
  }
  
  .movie-grid__load-more-btn {
    padding: 1rem 2rem;
    background: rgba(220, 38, 38, 0.2);
    border: 2px solid #dc2626;
    border-radius: 0.5rem;
    color: #dc2626;
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .movie-grid__load-more-btn:hover {
    background: #dc2626;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(220, 38, 38, 0.3);
  }
  
  @media (max-width: 768px) {
    .movie-grid__container--grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
    }
  }
  </style>
  