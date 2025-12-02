import { reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/plugins/axios';

export const useAuthStore = defineStore('auth', () => {
  const state = reactive({
    user: null,
    sessionId: null,
    requestToken: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  const user = computed(() => state.user);
  const isAuthenticated = computed(() => state.isAuthenticated);
  const loading = computed(() => state.loading);
  const error = computed(() => state.error);
  const sessionId = computed(() => state.sessionId);
  const accountId = computed(() => state.user?.id);

  const createRequestToken = async () => {
    try {
      const response = await api.get('authentication/token/new');
      state.requestToken = response.data.request_token;
      return state.requestToken;
    } catch (err) {
      console.error('Erro ao criar request token:', err);
      throw err;
    }
  };

  const validateWithLogin = async (username, password) => {
    state.loading = true;
    state.error = null;
    try {
      const requestToken = await createRequestToken();
      const response = await api.post('authentication/token/validate_with_login', {
        username,
        password,
        request_token: requestToken,
      });

      if (response.data.success) {
        state.requestToken = response.data.request_token;
        return true;
      }

      return false;
    } catch (err) {
      state.error = 'Usuário ou senha inválidos';
      console.error('Erro ao validar login:', err);
      return false;
    } finally {
      state.loading = false;
    }
  };

  const createSession = async () => {
    try {
      const response = await api.post('authentication/session/new', {
        request_token: state.requestToken,
      });

      if (response.data.success) {
        state.sessionId = response.data.session_id;
        localStorage.setItem('tmdb_session_id', state.sessionId);
        return true;
      }

      return false;
    } catch (err) {
      console.error('Erro ao criar sessão:', err);
      return false;
    }
  };

  const fetchAccountDetails = async () => {
    try {
      const response = await api.get('account', {
        params: {
          session_id: state.sessionId,
        },
      });

      state.user = {
        id: response.data.id,
        username: response.data.username,
        name: response.data.name || response.data.username,
        avatar: response.data.avatar?.tmdb?.avatar_path
          ? `https://image.tmdb.org/t/p/w185${response.data.avatar.tmdb.avatar_path}`
          : response.data.avatar?.gravatar?.hash
            ? `https://www.gravatar.com/avatar/${response.data.avatar.gravatar.hash}`
            : null,
        includeAdult: response.data.include_adult,
        iso_639_1: response.data.iso_639_1,
        iso_3166_1: response.data.iso_3166_1,
      };

      state.isAuthenticated = true;
      localStorage.setItem('tmdb_user', JSON.stringify(state.user));
      return state.user;
    } catch (err) {
      console.error('Erro ao buscar dados da conta:', err);
      throw err;
    }
  };

  const login = async (username, password) => {
    state.loading = true;
    state.error = null;
    try {
      const validated = await validateWithLogin(username, password);
      if (!validated) {
        return false;
      }

      const sessionCreated = await createSession();
      if (!sessionCreated) {
        state.error = 'Erro ao criar sessão';
        return false;
      }

      await fetchAccountDetails();

      // Carregar favoritos da API após login
      console.log('✅ Login bem-sucedido! Carregando favoritos da API...');
      const { useFavoritesStore } = await import('@/stores/favorites');
      const favoritesStore = useFavoritesStore();
      await favoritesStore.loadFromTMDB();

      return true;
    } catch (err) {
      state.error = err.response?.data?.status_message || 'Erro ao fazer login';
      return false;
    } finally {
      state.loading = false;
    }
  };

  const logout = async () => {
    try {
      if (state.sessionId) {
        await api.delete('authentication/session', {
          data: {
            session_id: state.sessionId,
          },
        });
      }
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    } finally {
      // Limpar estado de autenticação
      state.user = null;
      state.sessionId = null;
      state.requestToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('tmdb_session_id');
      localStorage.removeItem('tmdb_user');

      // Limpar todos os favoritos e histórico do navegador
      console.log('🧹 Limpando favoritos e histórico do navegador...');
      const { useFavoritesStore } = await import('@/stores/favorites');
      const favoritesStore = useFavoritesStore();
      favoritesStore.clearAll();
    }
  };

  const restoreSession = async () => {
    const savedSessionId = localStorage.getItem('tmdb_session_id');
    const savedUser = localStorage.getItem('tmdb_user');

    if (savedSessionId && savedUser) {
      try {
        state.sessionId = savedSessionId;
        state.user = JSON.parse(savedUser);
        await fetchAccountDetails();
        state.isAuthenticated = true;

        // Sincronizar favoritos ao restaurar sessão
        const { useFavoritesStore } = await import('@/stores/favorites');
        const favoritesStore = useFavoritesStore();
        await favoritesStore.loadFromTMDB();

        return true;
      } catch (err) {
        console.error('Sessão inválida ou expirada', err);
        await logout();
        return false;
      }
    }
    return false;
  };

  const getFavoriteMovies = async (page = 1) => {
    try {
      const response = await api.get(`account/${state.user.id}/favorite/movies`, {
        params: {
          session_id: state.sessionId,
          language: 'pt-BR',
          page,
        },
      });
      return response.data.results;
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
      return [];
    }
  };

  const toggleFavoriteTMDB = async (movieId, favorite) => {
    if (!state.user || !state.user.id) {
      console.error('❌ Usuário não está definido');
      return false;
    }

    if (!state.sessionId) {
      console.error('❌ Session ID não está definido');
      return false;
    }

    try {
      const response = await api.post(
        `account/${state.user.id}/favorite`,
        {
          media_type: 'movie',
          media_id: movieId,
          favorite,
        },
        {
          params: {
            session_id: state.sessionId,
          },
        }
      );

      return response.data.success;
    } catch (err) {
      console.error('❌ Erro ao atualizar favorito no TMDB:', err);
      return false;
    }
  };

  const getWatchlist = async () => {
    if (!state.user || !state.sessionId) {
      console.log('⚠️ Usuário não autenticado')
      return []
    }

    try {
      console.log('📥 Carregando watchlist (filmes + séries) da API TMDB...')

      const [moviesResponse, tvResponse] = await Promise.all([
        api.get(`account/${state.user.id}/watchlist/movies`, {
          params: {
            session_id: state.sessionId,
            language: 'pt-BR',
            sort_by: 'created_at.desc',
          },
        }),
        api.get(`account/${state.user.id}/watchlist/tv`, {
          params: {
            session_id: state.sessionId,
            language: 'pt-BR',
            sort_by: 'created_at.desc',
          },
        })
      ])

      // ✅ CORREÇÃO: Adicionar media_type nos filmes também
      const movies = (moviesResponse.data.results || []).map(movie => ({
        ...movie,
        media_type: 'movie',
        title: movie.title,
        release_date: movie.release_date,
      }))

      // ✅ Formatar séries
      const series = (tvResponse.data.results || []).map(show => ({
        ...show,
        media_type: 'tv',
        title: show.name,
        release_date: show.first_air_date,
      }))

      const allItems = [...movies, ...series]
      console.log(`✅ ${allItems.length} itens na watchlist carregados (${movies.length} filmes + ${series.length} séries)`)

      return allItems
    } catch (err) {
      console.error('❌ Erro ao buscar watchlist:', err)
      return []
    }
  };

  const toggleWatchlist = async (mediaId, watchlist, mediaType = 'movie') => {
    if (!state.user || !state.sessionId) {
      console.error('❌ Usuário não autenticado')
      return false
    }

    try {
      console.log(`${watchlist ? '➕' : '➖'} ${watchlist ? 'Adicionando' : 'Removendo'} ${mediaType} ${mediaId} ${watchlist ? 'na' : 'da'} watchlist...`)

      const response = await api.post(
        `account/${state.user.id}/watchlist`,
        {
          media_type: mediaType,
          media_id: mediaId,
          watchlist,
        },
        {
          params: {
            session_id: state.sessionId,
          },
        }
      )

      console.log(`✅ Watchlist atualizada com sucesso!`)
      return response.data.success
    } catch (err) {
      console.error('❌ Erro ao atualizar watchlist:', err)
      return false
    }
  };

  // ✅ NOVA FUNÇÃO: Remover da watchlist
  const removeFromWatchlist = async (itemId, mediaType = 'movie') => {
    try {
      const currentSessionId = state.sessionId || localStorage.getItem('tmdb_session_id')

      if (!currentSessionId || !state.user?.id) {
        throw new Error('Sessão inválida')
      }

      const response = await api.post(
        `account/${state.user.id}/watchlist`,
        {
          media_type: mediaType,
          media_id: itemId,
          watchlist: false,
        },
        {
          params: {
            session_id: currentSessionId,
          },
        }
      )

      if (response.data.success) {
        console.log(`✅ Item ${itemId} (${mediaType}) removido da watchlist`)
        return true
      }

      return false
    } catch (error) {
      console.error('❌ Erro ao remover da watchlist:', error)
      throw error
    }
  };

  const rateMovie = async (movieId, rating) => {
    try {
      const response = await api.post(
        `movie/${movieId}/rating`,
        {
          value: rating,
        },
        {
          params: {
            session_id: state.sessionId,
          },
        }
      );
      return response.data.success;
    } catch (err) {
      console.error('Erro ao avaliar filme:', err);
      return false;
    }
  };

  const deleteRating = async (movieId) => {
    try {
      const response = await api.delete(`movie/${movieId}/rating`, {
        params: {
          session_id: state.sessionId,
        },
      });
      return response.data.success;
    } catch (err) {
      console.error('Erro ao remover avaliação:', err);
      return false;
    }
  };

  const getRatedMovies = async (page = 1) => {
    try {
      const response = await api.get(`account/${state.user.id}/rated/movies`, {
        params: {
          session_id: state.sessionId,
          language: 'pt-BR',
          page,
        },
      });
      return response.data.results;
    } catch (err) {
      console.error('Erro ao buscar filmes avaliados:', err);
      return [];
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    sessionId,        // ✅ Adicionado
    accountId,        // ✅ Adicionado
    login,
    logout,
    restoreSession,
    getFavoriteMovies,
    toggleFavoriteTMDB,
    getWatchlist,
    toggleWatchlist,
    removeFromWatchlist,  // ✅ Adicionado
    rateMovie,
    deleteRating,
    getRatedMovies,
  };
});
