<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="trailer-modal" @click="closeModal">
        <div class="trailer-modal__overlay"></div>

        <div class="trailer-modal__container">
          <button @click="closeModal" class="trailer-modal__close" type="button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div class="trailer-modal__content" @click.stop>
            <div v-if="trailer" class="trailer-modal__video-wrapper">
              <iframe
                :src="getYouTubeEmbedUrl(trailer.key)"
                class="trailer-modal__video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div v-else class="trailer-modal__no-trailer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              <p>Trailer não disponível</p>
            </div>

            <div v-if="movie" class="trailer-modal__info">
              <h2 class="trailer-modal__title">{{ movie.title }}</h2>
              <p v-if="trailer" class="trailer-modal__trailer-name">{{ trailer.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  trailer: {
    type: Object,
    default: null,
  },
  movie: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const getYouTubeEmbedUrl = (key) => {
  return `https://www.youtube.com/embed/${key}?autoplay=1&rel=0`
}

const closeModal = () => {
  emit('close')
}

// Prevenir scroll do body quando modal está aberto
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

// Fechar com ESC
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    closeModal()
  }
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      document.addEventListener('keydown', handleEscape)
    } else {
      document.removeEventListener('keydown', handleEscape)
    }
  },
)
</script>

<style scoped>
.trailer-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.trailer-modal__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
}

.trailer-modal__container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  z-index: 1;
}

.trailer-modal__close {
  position: absolute;
  top: -3rem;
  right: 0;
  width: 40px;
  height: 40px;
  background: #dc2626;
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trailer-modal__close:hover {
  background: #b91c1c;
  transform: rotate(90deg);
}

.trailer-modal__close svg {
  width: 24px;
  height: 24px;
}

.trailer-modal__content {
  background: #111827;
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid rgba(220, 38, 38, 0.5);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.8);
}

.trailer-modal__video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
}

.trailer-modal__video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.trailer-modal__no-trailer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.trailer-modal__no-trailer svg {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.trailer-modal__no-trailer p {
  font-size: 1.25rem;
  font-weight: 600;
}

.trailer-modal__info {
  padding: 1.5rem;
  background: linear-gradient(to bottom, #1f2937, #111827);
}

.trailer-modal__title {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.trailer-modal__trailer-name {
  color: #9ca3af;
  font-size: 0.875rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .trailer-modal__content,
.modal-leave-active .trailer-modal__content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .trailer-modal__content {
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to .trailer-modal__content {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .trailer-modal__close {
    top: -2.5rem;
  }

  .trailer-modal__title {
    font-size: 1.25rem;
  }
}
</style>
