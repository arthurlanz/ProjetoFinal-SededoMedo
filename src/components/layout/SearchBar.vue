<template>
  <div class="search-bar" :class="{ 'search-bar--expanded': isExpanded }">
    <div class="search-bar__container">
      <button
        v-if="!isExpanded"
        @click="expand"
        class="search-bar__icon-btn"
        type="button"
        aria-label="Buscar"
      >
        <font-awesome-icon :icon="['fas', 'search']" />
      </button>

      <Transition name="expand">
        <div v-if="isExpanded" class="search-bar__input-wrapper">
          <font-awesome-icon :icon="['fas', 'search']" class="search-bar__icon" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Títulos, gêneros..."
            class="search-bar__input"
            @input="handleInput"
            @keyup.enter="handleSearch"
            @blur="handleBlur"
          />
          <button
            v-if="searchQuery"
            @click="clearSearch"
            class="search-bar__clear"
            type="button"
          >
            <font-awesome-icon :icon="['fas', 'times']"/>
          </button>
        </div>
      </Transition>
    </div>

    <Transition name="slide">
      <div v-if="showSuggestions && suggestions.length > 0" class="search-bar__suggestions">
        <div
          v-for="item in suggestions"
          :key="`${item.media_type}-${item.id}`"
          @mousedown.prevent="selectItem(item)"
          class="search-bar__suggestion"
        >
          <img
            v-if="item.poster_path"
            :src="getPosterUrl(item.poster_path, 'w92')"
            :alt="item.title || item.name"
            class="search-bar__suggestion-poster"
          />
          <div class="search-bar__suggestion-poster-placeholder" v-else>
            <font-awesome-icon :icon="['fas', 'film']" />
          </div>
          <div class="search-bar__suggestion-info">
            <p class="search-bar__suggestion-title">
              {{ item.title || item.name }}
              <span v-if="item.media_type === 'tv'" class="search-bar__badge">Série</span>
            </p>
            <p class="search-bar__suggestion-year">
              {{ item.release_date ? new Date(item.release_date).getFullYear() :
                 item.first_air_date ? new Date(item.first_air_date).getFullYear() : 'N/A' }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// Script permanece IGUAL
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { getImageUrl } from '@/plugins/axios';
import api from '@/plugins/axios';

const router = useRouter();
const searchInput = ref(null);
const searchQuery = ref('');
const suggestions = ref([]);
const showSuggestions = ref(false);
const isExpanded = ref(false);
let debounceTimer = null;

const emit = defineEmits(['search', 'clear']);

const getPosterUrl = (path, size = 'w92') => {
  return getImageUrl(path, size);
};

const expand = async () => {
  isExpanded.value = true;
  await nextTick();
  searchInput.value?.focus();
};

const collapse = () => {
  if (!searchQuery.value) {
    isExpanded.value = false;
    showSuggestions.value = false;
  }
};

const handleBlur = () => {
  setTimeout(() => {
    if (!searchQuery.value) {
      collapse();
    }
    showSuggestions.value = false;
  }, 200);
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
      const [moviesResponse, seriesResponse] = await Promise.all([
        api.get('search/movie', {
          params: {
            language: 'pt-BR',
            query: searchQuery.value,
          },
        }),
        api.get('search/tv', {
          params: {
            language: 'pt-BR',
            query: searchQuery.value,
          },
        }),
      ]);

      const horrorMovies = moviesResponse.data.results
        .filter(movie => movie.genre_ids.includes(27))
        .slice(0, 3)
        .map(movie => ({ ...movie, media_type: 'movie' }));

      const relevantSeries = seriesResponse.data.results
        .filter(show =>
          show.genre_ids.some(id => [9648, 80, 18, 10765].includes(id))
        )
        .slice(0, 3)
        .map(show => ({ ...show, media_type: 'tv' }));

      suggestions.value = [...horrorMovies, ...relevantSeries].slice(0, 5);
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
    searchInput.value?.blur();
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  suggestions.value = [];
  showSuggestions.value = false;
  emit('clear');
  searchInput.value?.focus();
};

const selectItem = (item) => {
  showSuggestions.value = false;
  searchQuery.value = '';
  isExpanded.value = false;

  router.push({ name: 'movie-detail', params: { id: item.id } });
};
</script>

<style scoped>
.search-bar {
  position: relative;
}

.search-bar__icon-btn {
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
  font-size: 18px;
}

.search-bar__icon-btn:hover {
  color: #b3b3b3;
}

.search-bar__container {
  position: relative;
}

.search-bar__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 2px;
  backdrop-filter: blur(10px);
}

.search-bar__icon {
  position: absolute;
  left: 0.75rem;
  color: #fff;
  pointer-events: none;
  z-index: 1;
  font-size: 14px;
}

.search-bar__input {
  width: 260px;
  padding: 0.5rem 2.5rem 0.5rem 2.75rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.search-bar__input:focus {
  outline: none;
}

.search-bar__input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.search-bar__clear {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
  z-index: 1;
  font-size: 14px;
}

.search-bar__clear:hover {
  color: #b3b3b3;
}

.search-bar__suggestions {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 300px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
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
  background: rgba(255, 255, 255, 0.1);
}

.search-bar__suggestion:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-bar__suggestion-poster {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
}

.search-bar__suggestion-poster-placeholder {
  width: 40px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  font-size: 18px;
}

.search-bar__suggestion-info {
  flex: 1;
  min-width: 0;
}

.search-bar__suggestion-title {
  color: #fff;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-bar__badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: rgba(147, 51, 234, 0.3);
  border: 1px solid rgba(147, 51, 234, 0.5);
  border-radius: 3px;
  font-size: 0.625rem;
  font-weight: 700;
  color: #9333ea;
  flex-shrink: 0;
}

.search-bar__suggestion-year {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.expand-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.slide-enter-active,
.slide-leave-active {
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

@media (max-width: 768px) {
  .search-bar__input {
    width: 200px;
  }

  .search-bar__suggestions {
    width: 260px;
  }
}
</style>
