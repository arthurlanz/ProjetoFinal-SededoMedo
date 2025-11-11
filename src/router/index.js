import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/layout/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Sede do Medo - Descubra os Melhores Filmes de Terror',
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/layout/LoginView.vue'),
      meta: {
        title: 'Login - Sede do Medo',
        requiresAgeConfirmation: true,
        guestOnly: true,
      },
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: () => import('@/views/movie/MovieDetailView.vue'),
      meta: {
        title: 'Detalhes do Filme - Sede do Medo',
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/user/FavoritesView.vue'),
      meta: {
        title: 'Meus Favoritos - Sede do Medo',
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/layout/SearchView.vue'),
      meta: {
        title: 'Buscar Filmes - Sede do Medo',
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/user/ProfileView.vue'),
      meta: {
        title: 'Meu Perfil - Sede do Medo',
        requiresAuth: true,
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('@/views/user/WatchlistView.vue'),
      meta: {
        title: 'Minha Watchlist - Sede do Medo',
        requiresAuth: true,
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/my-ratings',
      name: 'my-ratings',
      component: () => import('@/views/user/MyRatingsView.vue'),
      meta: {
        title: 'Minhas Avaliações - Sede do Medo',
        requiresAuth: true,
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/layout/NotFoundView.vue'),
      meta: {
        title: '404 - Página Não Encontrada',
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  },
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Atualizar título da página
  document.title = to.meta.title || 'Sede do Medo';

  // Adicionar meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = 'Descubra, explore e avalie os melhores filmes de terror. Plataforma completa com trailers, sinopses e informações detalhadas.';

  // Verificar se rota requer autenticação
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirecionar para login
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
      return;
    }
  }

  // Verificar se é rota apenas para convidados (login)
  if (to.meta.guestOnly) {
    if (authStore.isAuthenticated) {
      // Redirecionar para home se já estiver logado
      next({ name: 'home' });
      return;
    }
  }

  next();
});

// After navigation
router.afterEach(() => {
  // Scroll to top on route change
  window.scrollTo(0, 0);
});

export default router;
