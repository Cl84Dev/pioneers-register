<template>
  <div class="bg-white p-4 rounded-lg shadow-md">
    <h3 class="text-xl font-semibold text-center mb-4">Total Geral</h3>
    <div class="grid grid-cols-2 gap-4">
      <div class="text-center">
        <p class="text-sm text-gray-500">Horas Totais</p>
        <p class="text-xl font-bold">{{ stats.total_hours }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Créditos Totais</p>
        <p class="text-xl font-bold">{{ stats.total_hour_credits }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Total Geral</p>
        <p class="text-xl font-bold">{{ stats.total_sum }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Estudos Bíblicos</p>
        <p class="text-xl font-bold">{{ stats.total_bible_studies }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Média de Horas</p>
        <p class="text-xl font-bold">{{ stats.average_hours?.toFixed(2) }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Média de Créditos</p>
        <p class="text-xl font-bold">
          {{ stats.average_hour_credits?.toFixed(2) }}
        </p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Média Geral</p>
        <p class="text-xl font-bold">{{ stats.total_average?.toFixed(2) }}</p>
      </div>
      <div class="text-center">
        <p class="text-sm text-gray-500">Média de Estudos Bíblicos</p>
        <p class="text-xl font-bold">
          {{ stats.average_bible_studies?.toFixed(2) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: Object,
});
</script>

<style scoped>
/* Adicionando um estilo opcional para o card */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
</style>
