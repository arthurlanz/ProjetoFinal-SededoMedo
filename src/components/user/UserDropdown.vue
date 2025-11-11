<template>
    <div class="user-dropdown" ref="dropdownRef">
      <button @click="toggleDropdown" class="user-dropdown__trigger">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="user-dropdown__avatar"
        />
        <div v-else class="user-dropdown__avatar-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <span class="user-dropdown__name">{{ user.name }}</span>
        <svg
          class="user-dropdown__chevron"
          :class="{ 'user-dropdown__chevron--open': isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
  
      <Transition name="dropdown">
        <div v-if="isOpen" class="user-dropdown__menu">
          <div class="user-dropdown__header">
            <p class="user-dropdown__username">@{{ user.username }}</p>
          </div>
  
          <div class="user-dropdown__divider"></div>
  
          <router-link
            to="/profile"
            @click="closeDropdown"
            class="user-dropdown__item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Meu Perfil
          </router-link>
  
          <router-link
            to="/my-ratings"
            @click="closeDropdown"
            class="user-dropdown__item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Minhas Avaliações
          </router-link>
  
          <router-link
            to="/watchlist"
            @click="closeDropdown"
            class="user-dropdown__item"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            Lista de Desejos
          </router-link>
  
          <div class="user-dropdown__divider"></div>
  
          <button @click="handleLogout" class="user-dropdown__item user-dropdown__item--danger">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>
        </div>
      </Transition>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useAuth } from '@/composables/useAuth';
  
  const { user } = defineProps({
    user: {
      type: Object,
      required: true,
    },
  });
  
  const { logout } = useAuth();
  const isOpen = ref(false);
  const dropdownRef = ref(null);
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  
  const closeDropdown = () => {
    isOpen.value = false;
  };
  
  const handleLogout = async () => {
    closeDropdown();
    await logout();
  };
  
  const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
      closeDropdown();
    }
  };
  
  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  </script>
  
  <style scoped>
  .user-dropdown {
    position: relative;
  }
  
  .user-dropdown__trigger {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(31, 41, 55, 0.5);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .user-dropdown__trigger:hover {
    background: rgba(31, 41, 55, 0.8);
    border-color: #dc2626;
  }
  
  .user-dropdown__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #dc2626;
  }
  
  .user-dropdown__avatar-placeholder {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    border: 2px solid rgba(220, 38, 38, 0.3);
  }
  
  .user-dropdown__avatar-placeholder svg {
    width: 18px;
    height: 18px;
  }
  
  .user-dropdown__name {
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .user-dropdown__chevron {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }
  
  .user-dropdown__chevron--open {
    transform: rotate(180deg);
  }
  
  .user-dropdown__menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    min-width: 220px;
    background: #1f2937;
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    z-index: 100;
  }
  
  .user-dropdown__header {
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    border-bottom: 1px solid rgba(220, 38, 38, 0.2);
  }
  
  .user-dropdown__username {
    color: #9ca3af;
    font-size: 0.875rem;
    font-weight: 600;
  }
  
  .user-dropdown__divider {
    height: 1px;
    background: rgba(220, 38, 38, 0.2);
  }
  
  .user-dropdown__item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    color: white;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }
  
  .user-dropdown__item:hover {
    background: rgba(220, 38, 38, 0.1);
    color: #dc2626;
  }
  
  .user-dropdown__item svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  
  .user-dropdown__item--danger {
    color: #fca5a5;
  }
  
  .user-dropdown__item--danger:hover {
    background: rgba(220, 38, 38, 0.2);
    color: #dc2626;
  }
  
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: all 0.2s ease;
  }
  
  .dropdown-enter-from {
    opacity: 0;
    transform: translateY(-10px);
  }
  
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
  
  @media (max-width: 640px) {
    .user-dropdown__name {
      display: none;
    }
  
    .user-dropdown__menu {
      right: -1rem;
    }
  }
  </style>
  