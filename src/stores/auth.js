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
      state.user = null;
      state.sessionId = null;
      state.requestToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('tmdb_session_id');
      localStorage.removeItem('tmdb_user');
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
      console.error('Erro ao atualizar favorito:', err);
      return false;
    }
  };

  const getWatchlist = async (page = 1) => {
    try {
      const response = await api.get(`account/${state.user.id}/watchlist/movies`, {
        params: {
          session_id: state.sessionId,
          language: 'pt-BR',
          page,
        },
      });
      return response.data.results;
    } catch (err) {
      console.error('Erro ao buscar watchlist:', err);
      return [];
    }
  };

  const toggleWatchlist = async (movieId, watchlist) => {
    try {
      const response = await api.post(
        `account/${state.user.id}/watchlist`,
        {
          media_type: 'movie',
          media_id: movieId,
          watchlist,
        },
        {
          params: {
            session_id: state.sessionId,
          },
        }
      );
      return response.data.success;
    } catch (err) {
      console.error('Erro ao atualizar watchlist:', err);
      return false;
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
    login,
    logout,
    restoreSession,
    getFavoriteMovies,
    toggleFavoriteTMDB,
    getWatchlist,
    toggleWatchlist,
    rateMovie,
    deleteRating,
    getRatedMovies,
  };
});
