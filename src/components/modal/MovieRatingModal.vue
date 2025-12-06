<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="rating-modal" @click.self="closeModal">
        <div class="rating-modal__content">
          <!-- Header -->
          <div class="rating-modal__header">
            <h2 class="rating-modal__title">Avaliação</h2>
            <button @click="closeModal" class="rating-modal__close">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Rating Slider -->
          <div class="rating-modal__section">
            <div class="rating-modal__label-row">
              <p class="rating-modal__label">O que você achou de ?</p>
              <p class="rating-modal__percentage">{{ ratingPercentage }}% avaliação dos usuários</p>
            </div>

            <div class="rating-modal__slider-wrapper">
              <input
                type="range"
                v-model="sliderValue"
                min="0"
                max="100"
                step="5"
                class="rating-modal__slider"
                :style="{ background: sliderGradient }"
              />
              <div class="rating-modal__slider-labels">
                <span>0</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
                <span>60</span>
                <span>70</span>
                <span>80</span>
                <span>90</span>
                <span>100</span>
              </div>
            </div>

            <button
              v-if="sliderValue > 0"
              @click="clearRating"
              class="rating-modal__clear-btn"
            >
              Limpar minha avaliação
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                ircle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
                <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>

          <!-- Mood/Humor -->
          <div class="rating-modal__section">
            <p class="rating-modal__label">Humor</p>
            <p class="rating-modal__sublabel">Como fez você se sentir?</p>

            <div class="rating-modal__mood-grid">
              <div
                v-for="category in moodCategories"
                :key="category.name"
                class="rating-modal__mood-row"
              >
                <span class="rating-modal__mood-label">{{ category.name }}</span>
                <div class="rating-modal__mood-emojis">
                  <button
                    v-for="emoji in category.emojis"
                    :key="emoji"
                    @click="selectMood(category.name, emoji)"
                    class="rating-modal__mood-btn"
                    :class="{ 'rating-modal__mood-btn--active': selectedMood.category === category.name && selectedMood.emoji === emoji }"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tone -->
          <div class="rating-modal__section">
            <p class="rating-modal__label">Tom</p>
            <p class="rating-modal__sublabel">{{ mediaType === 'movie' ? 'Esse filme foi...' : 'Essa série foi...' }}</p>
            <input
              v-model="toneInput"
              type="text"
              placeholder="Selecione um tom..."
              class="rating-modal__tone-input"
            />
          </div>

          <!-- Submit Button -->
          <button
            @click="submitRating"
            :disabled="loading || sliderValue === 0"
            class="rating-modal__submit-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            {{ loading ? 'Salvando...' : 'Terminei' }}
          </button>

          <!-- Message -->
          <Transition name="fade">
            <div v-if="message" class="rating-modal__message" :class="{ 'rating-modal__message--error': isError }">
              {{ message }}
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/plugins/axios';

const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  mediaType: {
    type: String,
    default: 'movie',
  },
  initialRating: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close', 'rated']);

const authStore = useAuthStore();

const sliderValue = ref(props.initialRating || 0);
const selectedMood = ref({ category: '', emoji: '' });
const toneInput = ref('');
const loading = ref(false);
const message = ref('');
const isError = ref(false);

const moodCategories = [
  { name: 'Feliz', emojis: ['😀', '😄', '😊', '😂', '🤣', '😍'] },
  { name: 'Interessado', emojis: ['😴', '😐', '🤨', '😕', '🤔', '😲'] },
  { name: 'Surpreso', emojis: ['😮', '😯', '🤗', '😭'] },
  { name: 'Triste', emojis: ['☹️', '😞', '😣', '😢', '😥', '😰'] },
  { name: 'Indignado', emojis: ['😒', '😬', '🤢', '🤮'] },
  { name: 'Assustado', emojis: ['😨', '😰', '😱', '😵'] },
  { name: 'Nervoso', emojis: ['😤', '😡', '🤬', '💀'] },
];

const ratingPercentage = computed(() => sliderValue.value);

const sliderGradient = computed(() => {
  const percent = sliderValue.value;
  return `linear-gradient(to right, #dc2626 0%, #dc2626 ${percent}%, rgba(255,255,255,0.1) ${percent}%, rgba(255,255,255,0.1) 100%)`;
});

const selectMood = (category, emoji) => {
  if (selectedMood.value.category === category && selectedMood.value.emoji === emoji) {
    selectedMood.value = { category: '', emoji: '' };
  } else {
    selectedMood.value = { category, emoji };
  }
};

const clearRating = () => {
  sliderValue.value = 0;
  selectedMood.value = { category: '', emoji: '' };
  toneInput.value = '';
};

const closeModal = () => {
  emit('close');
};

const submitRating = async () => {
  if (sliderValue.value === 0) return;

  loading.value = true;
  message.value = '';

  try {
    // Verificar autenticação
    if (!authStore.isAuthenticated) {
      throw new Error('Você precisa estar logado para avaliar');
    }

    // Pegar sessionId do localStorage caso não esteja no store
    const sessionId = authStore.sessionId || localStorage.getItem('tmdb_session_id');

    if (!sessionId) {
      throw new Error('Sessão inválida. Faça login novamente.');
    }

    console.log('🔑 Session ID:', sessionId);
    console.log('🎬 Movie ID:', props.movieId);
    console.log('⭐ Rating:', sliderValue.value);

    // Converte 0-100 para 0.5-10 (TMDB aceita 0.5 a 10)
    const tmdbRating = Math.max(0.5, (sliderValue.value / 10)).toFixed(1);

    const endpoint = props.mediaType === 'movie' ? 'movie' : 'tv';

    console.log('📡 Enviando para:', `${endpoint}/${props.movieId}/rating`);

    const response = await api.post(
      `${endpoint}/${props.movieId}/rating`,
      { value: parseFloat(tmdbRating) },
      {
        params: {
          session_id: sessionId,
        },
      }
    );

    console.log('✅ Resposta da API:', response.data);

    if (response.data.success) {
      // Salvar mood e tone localmente (localStorage)
      const ratingData = {
        id: props.movieId,
        rating: parseFloat(tmdbRating),
        percentage: sliderValue.value,
        mood: selectedMood.value,
        tone: toneInput.value,
        timestamp: new Date().toISOString(),
      };

      const storageKey = `rating_${props.mediaType}_${props.movieId}`;
      localStorage.setItem(storageKey, JSON.stringify(ratingData));

      message.value = `Avaliação de ${tmdbRating}/10 salva com sucesso!`;
      isError.value = false;

      emit('rated', parseFloat(tmdbRating));

      setTimeout(() => {
        closeModal();
      }, 1500);
    } else {
      throw new Error('Falha ao salvar avaliação');
    }
  } catch (error) {
    console.error('❌ Erro ao avaliar:', error);
    console.error('❌ Detalhes:', error.response?.data);

    message.value = error.response?.data?.status_message || error.message || 'Erro ao salvar avaliação';
    isError.value = true;
  } finally {
    loading.value = false;
  }
};

// Watch para quando o modal abre, carregar dados locais
watch(() => props.visible, (newVal) => {
  if (newVal) {
    sliderValue.value = props.initialRating * 10 || 0;

    // Tentar carregar mood e tone do localStorage
    const storageKey = `rating_${props.mediaType}_${props.movieId}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        selectedMood.value = data.mood || { category: '', emoji: '' };
        toneInput.value = data.tone || '';
      } catch (e) {
        console.error('Erro ao carregar dados salvos:', e);
      }
    }
  }
});
</script>

<style scoped>
.rating-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.rating-modal__content {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 1rem;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.rating-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rating-modal__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #dc2626;
}

.rating-modal__close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-modal__close:hover {
  background: rgba(220, 38, 38, 0.2);
  transform: rotate(90deg);
}

.rating-modal__close svg {
  width: 20px;
  height: 20px;
}

.rating-modal__section {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.rating-modal__section:last-of-type {
  border-bottom: none;
}

.rating-modal__label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.rating-modal__label {
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  font-style: italic;
}

.rating-modal__percentage {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 600;
}

.rating-modal__sublabel {
  color: #9ca3af;
  font-size: 0.875rem;
  font-style: italic;
  margin-bottom: 1rem;
}

/* Slider */
.rating-modal__slider-wrapper {
  margin-bottom: 1rem;
}

.rating-modal__slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-modal__slider::-webkit-slider-thumb {
  appearance: none;
  width: 24px;
  height: 24px;
  background: #dc2626;
  border: 3px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
  transition: all 0.3s ease;
}

.rating-modal__slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(220, 38, 38, 0.7);
}

.rating-modal__slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #dc2626;
  border: 3px solid #fff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.5);
}

.rating-modal__slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.rating-modal__clear-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-modal__clear-btn:hover {
  color: #60a5fa;
}

.rating-modal__clear-btn svg {
  width: 16px;
  height: 16px;
}

/* Mood Grid */
.rating-modal__mood-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rating-modal__mood-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  gap: 1rem;
}

.rating-modal__mood-label {
  color: #9ca3af;
  font-size: 0.875rem;
  font-weight: 600;
}

.rating-modal__mood-emojis {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.rating-modal__mood-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid transparent;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-modal__mood-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.rating-modal__mood-btn--active {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
  transform: scale(1.15);
}

/* Tone Input */
.rating-modal__tone-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.rating-modal__tone-input:focus {
  outline: none;
  border-color: #dc2626;
  background: rgba(255, 255, 255, 0.08);
}

.rating-modal__tone-input::placeholder {
  color: #6b7280;
}

/* Submit Button */
.rating-modal__submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: calc(100% - 3rem);
  margin: 1.5rem;
  padding: 1rem;
  background: #dc2626;
  border: none;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-modal__submit-btn:hover:not(:disabled) {
  background: #b91c1c;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
}

.rating-modal__submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rating-modal__submit-btn svg {
  width: 20px;
  height: 20px;
}

/* Message */
.rating-modal__message {
  margin: 0 1.5rem 1.5rem;
  padding: 0.75rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 0.5rem;
  color: #86efac;
  font-size: 0.875rem;
  text-align: center;
}

.rating-modal__message--error {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.3);
  color: #fca5a5;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .rating-modal__content,
.modal-leave-active .rating-modal__content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .rating-modal__content {
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to .rating-modal__content {
  transform: scale(0.9) translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
.rating-modal__content::-webkit-scrollbar {
  width: 8px;
}

.rating-modal__content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.rating-modal__content::-webkit-scrollbar-thumb {
  background: rgba(220, 38, 38, 0.5);
  border-radius: 4px;
}

.rating-modal__content::-webkit-scrollbar-thumb:hover {
  background: rgba(220, 38, 38, 0.7);
}

/* Responsive */
@media (max-width: 768px) {
  .rating-modal__mood-row {
    grid-template-columns: 1fr;
  }

  .rating-modal__mood-label {
    text-align: center;
  }

  .rating-modal__mood-emojis {
    justify-content: center;
  }

  .rating-modal__mood-btn {
    width: 44px;
    height: 44px;
    font-size: 1.25rem;
  }
}
</style>
