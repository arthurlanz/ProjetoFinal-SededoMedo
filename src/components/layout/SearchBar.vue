<template>
    <div class="search-bar">
      <div class="search-bar__input-wrapper">
        <svg class="search-bar__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar filmes de terror..."
          class="search-bar__input"
          @input="handleInput"
          @keyup.enter="handleSearch"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="search-bar__clear"
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
  
      <!-- Suggestions -->
      <Transition name="slide">
        <div v-if="showSuggestions && suggestions.length > 0" class="search-bar__suggestions">
          <div
            v-for="movie in suggestions"
            :key="movie.id"
            @click="selectMovie(movie)"
            class="search-bar__suggestion"
          >
            <img
              v-if="movie.poster_path"
              :src="getPosterUrl(movie.poster_path, 'w92')"
              :alt="movie.title"
              class="search-bar__suggestion-poster"
            />
            <div class="search-bar__suggestion-poster-placeholder" v-else>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/>
                <line x1="7" y1="2" x2="7" y2="22"/>
                <line x1="17" y1="2" x2="17" y2="22"/>
              </svg>
            </div>
            <div class="search-bar__suggestion-info">
              <p class="search-bar__suggestion-title">{{ movie.title }}</p>
              <p class="search-bar__suggestion-year">
                {{ movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { getImageUrl } from '@/plugins/axios';
  import api from '@/plugins/axios';
  
  const router = useRouter();
  const searchQuery = ref('');
  const suggestions = ref([]);
  const showSuggestions = ref(false);
  let debounceTimer = null;
  
  const emit = defineEmits(['search', 'clear']);
  
  const getPosterUrl = (path, size = 'w92') => {
    return getImageUrl(path, size);
  };
  
  const handleInput = () => {
    clearTimeout(debounceTimer);
  
    if (searchQuery.value.trim().length < 2) {
      suggestions.value = [];
      showSuggestions.value = false;
      return;
    }
  
    debounceTimer = setTimeout(async () => {
      try {
        const response = await api.get('search/movie', {
          params: {
            language: 'pt-BR',
            query: searchQuery.value,
            with_genres: 27,
          },
        });
  
        suggestions.value = response.data.results
          .filter(movie => movie.genre_ids.includes(27))
          .slice(0, 5);
        showSuggestions.value = true;
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
      }
    }, 300);
  };
  
  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      showSuggestions.value = false;
      emit('search', searchQuery.value);
      router.push({ name: 'search', query: { q: searchQuery.value } });
    }
  };
  
  const clearSearch = () => {
    searchQuery.value = '';
    suggestions.value = [];
    showSuggestions.value = false;
    emit('clear');
  };
  
  const selectMovie = (movie) => {
    showSuggestions.value = false;
    router.push({ name: 'movie-detail', params: { id: movie.id } });
  };
  
  // Fechar sugestões ao clicar fora
  const handleClickOutside = (event) => {
    if (!event.target.closest('.search-bar')) {
      showSuggestions.value = false;
    }
  };
  
  watch(showSuggestions, (newVal) => {
    if (newVal) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  });
  </script>
  
  <style scoped>
  .search-bar {
    position: relative;
    width: 100%;
  }
  
  .search-bar__input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-bar__icon {
    position: absolute;
    left: 1rem;
    width: 20px;
    height: 20px;
    color: #6b7280;
    pointer-events: none;
  }
  
  .search-bar__input {
    width: 100%;
    padding: 0.75rem 3rem 0.75rem 3rem;
    background: #131313fd;
    border: 1px solid rgba(139, 0, 0, 0.3);
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .search-bar__input:focus {
    outline: none;
    border-color: #dc2626;
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  .search-bar__input::placeholder {
    color: #6b7280;
  }
  
  .search-bar__clear {
    position: absolute;
    right: 1rem;
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.2s ease;
    padding: 0;
  }
  
  .search-bar__clear:hover {
    color: #dc2626;
  }
  
  .search-bar__clear svg {
    width: 100%;
    height: 100%;
  }
  
  .search-bar__suggestions {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: #1f2937;
    border: 1px solid rgba(139, 0, 0, 0.3);
    border-radius: 0.5rem;
    overflow: hidden;
    z-index: 50;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  }
  
  .search-bar__suggestion {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  
  .search-bar__suggestion:hover {
    background: rgba(139, 0, 0, 0.2);
  }
  
  .search-bar__suggestion:not(:last-child) {
    border-bottom: 1px solid rgba(139, 0, 0, 0.2);
  }
  
  .search-bar__suggestion-poster {
    width: 40px;
    height: 60px;
    object-fit: cover;
    border-radius: 0.25rem;
    flex-shrink: 0;
  }
  
  .search-bar__suggestion-poster-placeholder {
    width: 40px;
    height: 60px;
    background: #374151;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    flex-shrink: 0;
  }
  
  .search-bar__suggestion-poster-placeholder svg {
    width: 20px;
    height: 20px;
  }
  
  .search-bar__suggestion-info {
    flex: 1;
    min-width: 0;
  }
  
  .search-bar__suggestion-title {
    color: white;
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0.25rem;
  }
  
  .search-bar__suggestion-year {
    color: #9ca3af;
    font-size: 0.8rem;
  }
  
  .slide-enter-active, .slide-leave-active {
    transition: all 0.2s ease;
  }
  
  .slide-enter-from {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  .slide-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
  </style>
  