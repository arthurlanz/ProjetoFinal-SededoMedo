<template>
  <div id="app">
    <AgeWarning v-if="!ageConfirmed" @accept="handleAgeAccept" />

    <div v-else class="app-content">
      <header
        v-if="!isLoginPage"
        class="app-header"
        :class="{
          'app-header--scrolled': isScrolled,
          'app-header--transparent': isHomePage || isDetailPage,
        }"
      >
        <div class="app-header__container">
          <div class="app-header__left">
            <router-link to="/" class="app-header__logo"> SEDE DO MEDO </router-link>

            <nav class="app-header__nav">
              <router-link to="/" class="app-header__nav-link">Início</router-link>
              <router-link to="/search" class="app-header__nav-link">Filmes</router-link>
              <router-link to="/watchlist" class="app-header__nav-link">Minha Lista</router-link>
            </nav>
          </div>

          <div class="app-header__right">
            <SearchBar />

            <router-link to="/favorites" class="app-header__icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              <span v-if="favoritesCount > 0" class="app-header__badge">{{ favoritesCount }}</span>
            </router-link>

            <UserDropdown v-if="isAuthenticated" :user="user" />
            <router-link v-else to="/login" class="app-header__avatar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                />
              </svg>
            </router-link>

            <button @click="mobileMenuOpen = !mobileMenuOpen" class="app-header__menu-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <Transition name="fade">
          <div v-if="mobileMenuOpen" class="app-header__mobile">
            <router-link to="/" @click="mobileMenuOpen = false" class="app-header__mobile-link"
              >Início</router-link
            >
            <router-link
              to="/search"
              @click="mobileMenuOpen = false"
              class="app-header__mobile-link"
              >Filmes</router-link
            >
            <router-link
              to="/favorites"
              @click="mobileMenuOpen = false"
              class="app-header__mobile-link"
              >Minha Lista</router-link
            >
            <template v-if="isAuthenticated">
              <router-link
                to="/profile"
                @click="mobileMenuOpen = false"
                class="app-header__mobile-link"
                >Conta</router-link
              >
            </template>
            <router-link
              v-else
              to="/login"
              @click="mobileMenuOpen = false"
              class="app-header__mobile-link"
              >Entrar</router-link
            >
          </div>
        </Transition>
      </header>

      <main
        class="app-main"
        :class="{
          'app-main--full': isLoginPage,
          'app-main--home': isHomePage,
          'app-main--detail': isDetailPage,
        }"
      >
        <router-view />
      </main>

      <footer v-if="!isLoginPage" class="app-footer">
        <div class="app-footer__container">
          <div class="app-footer__social">
            <a href="#" class="app-footer__social-link" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </a>
            <a href="#" class="app-footer__social-link" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            </a>
            <a href="#" class="app-footer__social-link" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                />
              </svg>
            </a>
            <a href="#" class="app-footer__social-link" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </a>
          </div>

          <div class="app-footer__links">
            <div class="app-footer__column">
              <a href="#">Perguntas frequentes</a>
              <a href="#">Relações com investidores</a>
              <a href="#">Formas de assistir</a>
              <a href="#">Informações corporativas</a>
            </div>
            <div class="app-footer__column">
              <a href="#">Centro de ajuda</a>
              <router-link to="/search">Filmes</router-link>
              <a href="#">Termos de uso</a>
              <a href="#">Entre em contato</a>
            </div>
            <div class="app-footer__column">
              <router-link to="/profile">Conta</router-link>
              <router-link to="/favorites">Minha lista</router-link>
              <a href="#">Privacidade</a>
            </div>
            <div class="app-footer__column">
              <a href="#">Media Center</a>
              <a href="#">Carreiras</a>
              <a href="#">Preferências de cookies</a>
            </div>
          </div>

          <div class="app-footer__service">
            <p>Dados fornecidos por TMDB</p>
          </div>

          <div class="app-footer__copyright">
            <p>&copy; 1997-2025 Sede do Medo, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFavorites } from '@/composables/useFavorites'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'
import AgeWarning from '@/components/layout/AgeWarning.vue'
import SearchBar from '@/components/layout/SearchBar.vue'
import UserDropdown from '@/components/user/UserDropdown.vue'

const route = useRoute()
const { favoritesCount } = useFavorites()
const { isAuthenticated, user } = useAuth()
const authStore = useAuthStore()
const isHomePage = computed(() => route.path === '/')
const isDetailPage = computed(() => route.name === 'movie-detail')
const ageConfirmed = ref(false)
const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const isLoginPage = computed(() => route.name === 'login')

const handleAgeAccept = () => {
  ageConfirmed.value = true
  localStorage.setItem('age-confirmed', 'true')
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

onMounted(async () => {
  const confirmed = localStorage.getItem('age-confirmed')
  if (confirmed === 'true') {
    ageConfirmed.value = true
  }

  await authStore.restoreSession()

  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ==================== HEADER - ESTILO NETFLIX ==================== */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgb(20, 20, 20); /* PADRÃO: SÓLIDO */
  transition: background 0.4s ease;
}

/* Header transparente APENAS na home */
.app-header--transparent {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 10%, transparent);
}
/* Header sólido ao rolar (em qualquer página) */
.app-header--scrolled {
  background: rgb(20, 20, 20) !important;
}

.app-header__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4%;
  height: 70px;
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex: 1;
}

.app-header__logo {
  color: #e50914;
  font-size: 1.75rem;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: -1px;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.app-header__logo:hover {
  opacity: 0.8;
}

.app-header__nav {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.app-header__nav-link {
  color: #e5e5e5;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}

.app-header__nav-link:hover {
  color: #b3b3b3;
}

.app-header__nav-link.router-link-active {
  color: #fff;
  font-weight: 700;
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.app-header__icon {
  position: relative;
  width: 24px;
  height: 24px;
  color: #fff;
  text-decoration: none;
  transition: color 0.2s;
}

.app-header__icon:hover {
  color: #b3b3b3;
}

.app-header__icon svg {
  width: 24px;
  height: 24px;
}

.app-header__badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #e50914;
  border-radius: 9px;
  font-size: 0.65rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.app-header__avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  overflow: hidden;
  transition: opacity 0.2s;
  color: #e50914;
}

.app-header__avatar:hover {
  opacity: 0.8;
}

.app-header__avatar svg {
  width: 100%;
  height: 100%;
}

.app-header__menu-btn {
  display: none;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
}

.app-header__menu-btn svg {
  width: 24px;
  height: 24px;
}

.app-header__mobile {
  background: rgb(20, 20, 20);
  padding: 1rem 4%;
  border-top: 1px solid #2a2a2a;
}

.app-header__mobile-link {
  display: block;
  color: #e5e5e5;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.75rem 0;
  transition: color 0.2s;
}

.app-header__mobile-link:hover {
  color: #fff;
}

/* ==================== MAIN ==================== */
.app-main {
  min-height: 100vh;
  padding-top: 70px; /* ✅ Padrão para páginas normais */
}

/* ✅ SEM padding-top para home e detail */
.app-main--home,
.app-main--detail {
  padding-top: 0 !important;
}

.app-main--full {
  padding-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ==================== FOOTER - ESTILO NETFLIX ==================== */
.app-footer {
  background: rgb(20, 20, 20);
  padding: 4rem 0 2rem;
}

.app-footer__container {
  max-width: 980px;
  margin: 0 auto;
  padding: 0 4%;
}

.app-footer__social {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.app-footer__social-link {
  color: #808080;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.app-footer__social-link:hover {
  color: #fff;
}

.app-footer__social-link svg {
  width: 24px;
  height: 24px;
}

.app-footer__links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.app-footer__column {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.app-footer__column a {
  color: #808080;
  font-size: 0.8125rem;
  text-decoration: none;
  transition: color 0.2s;
}

.app-footer__column a:hover {
  text-decoration: underline;
}

.app-footer__service {
  margin-bottom: 1.5rem;
}

.app-footer__service p {
  color: #808080;
  font-size: 0.75rem;
}

.app-footer__copyright {
  padding-top: 1rem;
}

.app-footer__copyright p {
  color: #808080;
  font-size: 0.6875rem;
}

/* ==================== TRANSITIONS ==================== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 950px) {
  .app-header__nav {
    display: none;
  }

  .app-header__menu-btn {
    display: block;
  }

  .app-footer__links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 550px) {
  .app-header__logo {
    font-size: 1.25rem;
  }

  .app-header__container {
    padding: 0 4%;
  }

  .app-footer__links {
    grid-template-columns: 1fr;
  }
}
</style>
