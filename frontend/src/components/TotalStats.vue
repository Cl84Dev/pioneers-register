<template>
  <div class="p-6 bg-white rounded-xl shadow-md">
    <div
      v-if="stats"
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
    >
      <div class="p-4 bg-gray-100 rounded">
        <p class="font-semibold">Horas Totais</p>
        <p>{{ stats.total_hours ?? 0 }}</p>
      </div>
      <div class="p-4 bg-gray-100 rounded">
        <p class="font-semibold">Horas de Crédito</p>
        <p>{{ stats.total_hour_credits ?? 0 }}</p>
      </div>
      <div class="p-4 bg-gray-100 rounded">
        <p class="font-semibold">Estudos Bíblicos</p>
        <p>{{ stats.total_bible_studies ?? 0 }}</p>
      </div>
      <div class="p-4 bg-gray-100 rounded">
        <p class="font-semibold">Média de Horas</p>
        <p>{{ average(stats.average_hours) }}</p>
      </div>
      <div class="p-4 bg-gray-100 rounded">
        <p class="font-semibold">Média de Crédito</p>
        <p>{{ average(stats.average_hour_credits) }}</p>
      </div>
      <div class="p-4 bg-gray-100 rounded">
        <p class="font-semibold">Média de Estudos</p>
        <p>{{ average(stats.average_bible_studies) }}</p>
      </div>
    </div>

    <div v-else class="text-gray-500">Carregando...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../api/axios";

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
});

const stats = ref(null);

const fetchStats = async () => {
  stats.value = null;
  try {
    const response = await api.get(`/activities`, {
      params: { service_year: props.year },
    });
    stats.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
  }
};

watch(() => props.year, fetchStats);
onMounted(fetchStats);

const average = (value) => (value ? Number(value).toFixed(1) : 0);
</script>
