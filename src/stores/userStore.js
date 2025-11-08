import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {

  const ratings = ref(JSON.parse(localStorage.getItem('userRatings') || '[]'))
  const userId = ref(localStorage.getItem('userId') || generateUserId())

  const ratingsCount = computed(() => ratings.value.length)

  const getRating = computed(() => {
    return movieId => {
      const rating = ratings.value.find(r => r.movieId === movieId)
      return rating ? rating.rating : 0
    }
  })


  function generateUserId() {
    const id = 'user_' + Math.random().toString(36).substr(2, 9)
    localStorage.setItem('userId', id)
    return id
  }

  function rateMovie(movieId, rating, movieTitle) {
    const existingRatingIndex = ratings.value.findIndex(r => r.movieId === movieId)

    const ratingData = {
      movieId,
      rating,
      title: movieTitle,
      ratedAt: new Date().toISOString()
    }

    if (existingRatingIndex > -1) {
      ratings.value[existingRatingIndex] = ratingData
    } else {
      ratings.value.push(ratingData)
    }

    saveRatings()
  }

  function removeRating(movieId) {
    ratings.value = ratings.value.filter(r => r.movieId !== movieId)
    saveRatings()
  }

  function saveRatings() {
    localStorage.setItem('userRatings', JSON.stringify(ratings.value))
  }

  function clearRatings() {
    ratings.value = []
    saveRatings()
  }

  return {
    ratings,
    userId,
    ratingsCount,
    getRating,
    rateMovie,
    removeRating,
    clearRatings
  }
})
