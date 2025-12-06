<template>
  <header class="app-header">
    <div class="container app-header__container">
      <router-link to="/" class="app-header__logo">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 12a6 6 0 0 0-12 0v3c0 1.657 1.343 3 3 3h6c1.657 0 3-1.343 3-3v-3Z"/>
          ircle cx="9" cy="12" r="1"/>
          ircle cx="15" cy="12" r="1"/>
          <path d="M12 18v3"/>
        </svg>
        <span>SEDE DO MEDO</span>
      </router-link>

      <!-- Navigation -->
      <nav class="app-header__nav">
        <SearchBar />

        <router-link to="/favorites" class="app-header__nav-link">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span v-if="favoritesCount > 0" class="app-header__badge">{{ favoritesCount }}</span>
        </router-link>

        <!-- User Section -->
        <UserDropdown v-if="isAuthenticated" :user="user" />
        <router-link v-else to="/login" class="app-header__login-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Entrar
        </router-link>
      </nav>

      <!-- Mobile Menu Toggle -->
      <button @click="toggleMobileMenu" class="app-header__menu-toggle">
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="slide-down">
      <div v-if="mobileMenuOpen" class="app-header__mobile-menu">
        <router-link to="/" @click="closeMobileMenu" class="app-header__mobile-link">
          Início
        </router-link>
        <router-link to="/search" @click="closeMobileMenu" class="app-header__mobile-link">
          Buscar
        </router-link>
        <router-link to="/favorites" @click="closeMobileMenu" class="app-header__mobile-link">
          Favoritos
          <span v-if="favoritesCount > 0" class="app-header__badge">{{ favoritesCount }}</span>
        </router-link>
        <template v-if="isAuthenticated">
          <router-link to="/profile" @click="closeMobileMenu" class="app-header__mobile-link">
            Perfil
          </router-link>
          <router-link to="/watchlist" @click="closeMobileMenu" class="app-header__mobile-link">
            Watchlist
          </router-link>
          <router-link to="/my-ratings" @click="closeMobileMenu" class="app-header__mobile-link">
            Avaliações
          </router-link>
        </template>
        <router-link v-else to="/login" @click="closeMobileMenu" class="app-header__mobile-link">
          Entrar
        </router-link>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useFavorites } from '@/composables/useFavorites';
import { useAuth } from '@/composables/useAuth';
import SearchBar from '@/components/layout/SearchBar.vue';
import UserDropdown from '@/components/user/UserDropdown.vue';

const { favoritesCount } = useFavorites();
const { isAuthenticated, user } = useAuth();

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<style scoped>
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(220, 38, 38, 0.3);
}

.app-header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
  gap: 2rem;
}

.app-header__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #dc2626;
  font-size: 1.5rem;
  font-weight: 900;
  transition: all 0.3s ease;
}

.app-header__logo:hover {
  transform: scale(1.05);
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.8);
}

.app-header__logo svg {
  width: 32px;
  height: 32px;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  max-width: 800px;
}

.app-header__nav-link {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
}

.app-header__nav-link:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.app-header__nav-link svg {
  width: 24px;
  height: 24px;
}

.app-header__login-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 0.5rem;
  color: #dc2626;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.app-header__login-btn:hover {
  background: rgba(220, 38, 38, 0.2);
  border-color: #dc2626;
}

.app-header__login-btn svg {
  width: 18px;
  height: 18px;
}

.app-header__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 0.375rem;
  background: #dc2626;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header__menu-toggle {
  display: none;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;
}

.app-header__menu-toggle:hover {
  color: #dc2626;
}

.app-header__menu-toggle svg {
  width: 24px;
  height: 24px;
}

.app-header__mobile-menu {
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  padding: 1rem 0;
}

.app-header__mobile-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.app-header__mobile-link:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .app-header__nav {
    display: none;
  }

  .app-header__menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
