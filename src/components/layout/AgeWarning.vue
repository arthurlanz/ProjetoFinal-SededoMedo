<template>
    <Transition name="fade">
      <div v-if="showWarning" class="age-warning">
        <div class="age-warning__overlay" @click="handleDecline"></div>
        <div class="age-warning__modal">
          <div class="age-warning__skull">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M18 12a6 6 0 0 0-12 0v3c0 1.657 1.343 3 3 3h6c1.657 0 3-1.343 3-3v-3Z" />
              <circle cx="9" cy="12" r="1" />
              <circle cx="15" cy="12" r="1" />
              <path d="M12 18v3" />
            </svg>
          </div>
  
          <h1 class="age-warning__title">AVISO +18</h1>
  
          <div class="age-warning__content">
            <p class="age-warning__text">
              Este site contém conteúdo de terror extremo, violência gráfica, cenas perturbadoras e
              temas sensíveis destinados exclusivamente para maiores de 18 anos.
            </p>
  
            <div class="age-warning__warnings">
              <div class="age-warning__warning-item">
                <span class="age-warning__warning-icon">⚠️</span>
                <span>Conteúdo Violento</span>
              </div>
              <div class="age-warning__warning-item">
                <span class="age-warning__warning-icon">🩸</span>
                <span>Sangue e Gore</span>
              </div>
              <div class="age-warning__warning-item">
                <span class="age-warning__warning-icon">😱</span>
                <span>Cenas Perturbadoras</span>
              </div>
            </div>
          </div>
  
          <div class="age-warning__actions">
            <button @click="handleAccept" class="age-warning__button age-warning__button--accept">
              Tenho 18+ e Desejo Continuar
            </button>
            <button @click="handleDecline" class="age-warning__button age-warning__button--decline">
              Sair
            </button>
          </div>
  
          <p class="age-warning__footer">Ao continuar, você confirma ter 18 anos ou mais</p>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const showWarning = ref(true)
  
  const emit = defineEmits(['accept', 'decline'])
  
  onMounted(() => {
    const ageConfirmed = localStorage.getItem('age-confirmed')
    if (ageConfirmed === 'true') {
      showWarning.value = false
      emit('accept')
    }
  })
  
  const handleAccept = () => {
    localStorage.setItem('age-confirmed', 'true')
    showWarning.value = false
    emit('accept')
  }
  
  const handleDecline = () => {
    window.location.href = 'https://www.google.com'
  }
  </script>
  
  <style scoped>
  .age-warning {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }
  
  .age-warning__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
  }
  
  .age-warning__modal {
    position: relative;
    max-width: 500px;
    width: 100%;
    background: linear-gradient(135deg, #1a0000 0%, #000000 100%);
    border: 2px solid #8b0000;
    border-radius: 1rem;
    padding: 2.5rem;
    text-align: center;
    box-shadow: 0 0 50px rgba(139, 0, 0, 0.5);
    animation: pulse 2s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 50px rgba(139, 0, 0, 0.5);
    }
    50% {
      box-shadow: 0 0 80px rgba(139, 0, 0, 0.8);
    }
  }
  
  .age-warning__skull {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    color: #dc2626;
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
  
  .age-warning__skull svg {
    width: 100%;
    height: 100%;
  }
  
  .age-warning__title {
    font-size: 2.5rem;
    font-weight: 900;
    color: #dc2626;
    margin-bottom: 1.5rem;
    text-shadow: 0 0 20px rgba(220, 38, 38, 0.5);
    letter-spacing: 0.1em;
  }
  
  .age-warning__content {
    margin-bottom: 2rem;
  }
  
  .age-warning__text {
    color: #d1d5db;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
  }
  
  .age-warning__warnings {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }
  
  .age-warning__warning-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(139, 0, 0, 0.2);
    border-radius: 0.5rem;
    border: 1px solid rgba(139, 0, 0, 0.3);
    color: #fca5a5;
    font-size: 0.9rem;
  }
  
  .age-warning__warning-icon {
    font-size: 1.25rem;
  }
  
  .age-warning__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .age-warning__button {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 700;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .age-warning__button--accept {
    background: #dc2626;
    color: white;
  }
  
  .age-warning__button--accept:hover {
    background: #b91c1c;
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
  }
  
  .age-warning__button--decline {
    background: #374151;
    color: #d1d5db;
  }
  
  .age-warning__button--decline:hover {
    background: #4b5563;
  }
  
  .age-warning__footer {
    color: #6b7280;
    font-size: 0.8rem;
    margin-top: 1rem;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  @media (max-width: 640px) {
    .age-warning__modal {
      padding: 2rem 1.5rem;
    }
  
    .age-warning__title {
      font-size: 2rem;
    }
  
    .age-warning__skull {
      width: 60px;
      height: 60px;
    }
  }
  </style>
  