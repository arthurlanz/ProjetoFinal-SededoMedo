// src/stores/watchlist.js
import api from '@/plugins/axios'

const ACCOUNT_ID = localStorage.getItem('tmdb_account_id')
const SESSION_ID = localStorage.getItem('tmdb_session_id')

/**
 * Adiciona filme/série à watchlist
 */
export const addToWatchlist = async (mediaId, mediaType = 'movie') => {
  try {
    console.log('📝 Adicionando à watchlist...', { mediaId, mediaType })

    if (!ACCOUNT_ID || !SESSION_ID) {
      throw new Error('Usuário não autenticado')
    }

    const response = await api.post(
      `account/${ACCOUNT_ID}/watchlist`,
      {
        media_type: mediaType,
        media_id: mediaId,
        watchlist: true,
      },
      {
        params: { session_id: SESSION_ID },
      }
    )

    console.log('✅ Adicionado à watchlist com sucesso!')
    return response.data
  } catch (error) {
    console.error('❌ Erro ao adicionar à watchlist:', error)
    throw error
  }
}

/**
 * Remove filme/série da watchlist
 */
export const removeFromWatchlist = async (mediaId, mediaType = 'movie') => {
  try {
    console.log('🗑️ Removendo da watchlist...', { mediaId, mediaType })

    if (!ACCOUNT_ID || !SESSION_ID) {
      throw new Error('Usuário não autenticado')
    }

    const response = await api.post(
      `account/${ACCOUNT_ID}/watchlist`,
      {
        media_type: mediaType,
        media_id: mediaId,
        watchlist: false,
      },
      {
        params: { session_id: SESSION_ID },
      }
    )

    console.log('✅ Removido da watchlist com sucesso!')
    return response.data
  } catch (error) {
    console.error('❌ Erro ao remover da watchlist:', error)
    throw error
  }
}

/**
 * Carrega watchlist de filmes
 */
export const getMovieWatchlist = async () => {
  try {
    console.log('📥 Carregando watchlist de filmes da API TMDB...')

    if (!ACCOUNT_ID || !SESSION_ID) {
      console.log('⚠️ Usuário não autenticado')
      return []
    }

    const response = await api.get(`account/${ACCOUNT_ID}/watchlist/movies`, {
      params: {
        session_id: SESSION_ID,
        language: 'pt-BR',
        sort_by: 'created_at.desc',
      },
    })

    console.log(`✅ ${response.data.results.length} filmes na watchlist carregados da API`)
    return response.data.results
  } catch (error) {
    console.error('❌ Erro ao carregar watchlist:', error)
    return []
  }
}

/**
 * Carrega watchlist de séries
 */
export const getTVWatchlist = async () => {
  try {
    console.log('📥 Carregando watchlist de séries da API TMDB...')

    if (!ACCOUNT_ID || !SESSION_ID) {
      console.log('⚠️ Usuário não autenticado')
      return []
    }

    const response = await api.get(`account/${ACCOUNT_ID}/watchlist/tv`, {
      params: {
        session_id: SESSION_ID,
        language: 'pt-BR',
        sort_by: 'created_at.desc',
      },
    })

    console.log(`✅ ${response.data.results.length} séries na watchlist carregadas da API`)
    return response.data.results
  } catch (error) {
    console.error('❌ Erro ao carregar watchlist de séries:', error)
    return []
  }
}

/**
 * Verifica se um item está na watchlist
 */
export const checkWatchlist = async (mediaId, mediaType = 'movie') => {
  try {
    if (!ACCOUNT_ID || !SESSION_ID) {
      return false
    }

    const endpoint = mediaType === 'movie' ? 'watchlist/movies' : 'watchlist/tv'
    const response = await api.get(`account/${ACCOUNT_ID}/${endpoint}`, {
      params: {
        session_id: SESSION_ID,
        language: 'pt-BR',
      },
    })

    return response.data.results.some(item => item.id === mediaId)
  } catch (error) {
    console.error('❌ Erro ao verificar watchlist:', error)
    return false
  }
}
