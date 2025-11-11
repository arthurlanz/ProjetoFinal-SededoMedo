import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import HomeView from '@/views/HomeView.vue';

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
      component: () => import('@/views/LoginView.vue'),
      meta: {
        title: 'Login - Sede do Medo',
        requiresAgeConfirmation: true,
        guestOnly: true,
      },
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: () => import('@/views/MovieDetailView.vue'),
      meta: {
        title: 'Detalhes do Filme - Sede do Medo',
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('@/views/FavoritesView.vue'),
      meta: {
        title: 'Meus Favoritos - Sede do Medo',
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchView.vue'),
      meta: {
        title: 'Buscar Filmes - Sede do Medo',
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        title: 'Meu Perfil - Sede do Medo',
        requiresAuth: true,
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: () => import('@/views/WatchlistView.vue'),
      meta: {
        title: 'Minha Watchlist - Sede do Medo',
        requiresAuth: true,
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/my-ratings',
      name: 'my-ratings',
      component: () => import('@/views/MyRatingsView.vue'),
      meta: {
        title: 'Minhas Avaliações - Sede do Medo',
        requiresAuth: true,
        requiresAgeConfirmation: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  document.title = to.meta.title || 'Sede do Medo';

  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = 'Descubra, explore e avalie os melhores filmes de terror. Plataforma completa com trailers, sinopses e informações detalhadas.';

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      });
      return;
    }
  }


  if (to.meta.guestOnly) {
    if (authStore.isAuthenticated) {
      next({ name: 'home' });
      return;
    }
  }

  next();
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;
