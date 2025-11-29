<template>
  <div v-if="loading" class="loading-screen">
    <div class="loading-screen__content">
      <div class="loading-screen__spinner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
          <line x1="7" y1="2" x2="7" y2="22" />
          <line x1="17" y1="2" x2="17" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="2" y1="7" x2="7" y2="7" />
          <line x1="2" y1="17" x2="7" y2="17" />
          <line x1="17" y1="17" x2="22" y2="17" />
          <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
      </div>
      <h2 class="loading-screen__text">{{ text }}</h2>
      <div class="loading-screen__bar">
        <div class="loading-screen__bar-fill"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: 'Carregando os pesadelos...',
  },
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.loading-screen__content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.loading-screen__spinner {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  color: #dc2626;
  animation: spin 2s linear infinite;
}

.loading-screen__spinner svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.5));
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-screen__text {
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
}

.loading-screen__bar {
  width: 100%;
  height: 4px;
  background: #1f2937;
  border-radius: 2px;
  overflow: hidden;
}

.loading-screen__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #dc2626, #991b1b);
  border-radius: 2px;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% {
    width: 0%;
    margin-left: 0%;
  }
  50% {
    width: 50%;
    margin-left: 25%;
  }
  100% {
    width: 0%;
    margin-left: 100%;
  }
}
</style>
