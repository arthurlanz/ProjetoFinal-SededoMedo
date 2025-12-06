<template>
  <div class="series-grid">
    <SeriesCard
      v-for="series in seriesList"
      :key="series.id"
      :series="series"
      :view-mode="viewMode"
    />
  </div>
</template>

<script setup>
import SeriesCard from './SeriesCard.vue'

defineProps({
  seriesList: {
    type: Array,
    required: true,
  },
  viewMode: {
    type: String,
    default: 'grid',
  },
})
</script>

<style scoped>
.series-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
}

@media (max-width: 768px) {
  .series-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .series-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
  }
}
</style>
