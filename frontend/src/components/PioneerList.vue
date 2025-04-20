<template>
  <div class="mb-5">
    <div v-if="loading" class="text-gray-500">Carregando...</div>
    <div v-else-if="pioneers.length === 0" class="text-center text-gray-500">
      Nenhum pioneiro encontrado. Comece adicionando um pioneiro.
    </div>
    <div v-else>
      <p class="text-sm text-center text-gray-600 mb-5">
        Clique em uma linha da tabela para ver detalhes das atividades do
        pioneiro
      </p>
      <table class="min-w-full bg-white border border-gray-200 shadow-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="px-4 py-2 border-b">Nome</th>
            <th class="px-4 py-2 border-b">Função</th>
            <th class="px-4 py-2 border-b">Horas</th>
            <th class="px-4 py-2 border-b">Estudos</th>
            <th class="px-4 py-2 border-b">Média</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="pioneer in pioneers"
            :key="pioneer.id"
            @click="goToPioneer(pioneer.id)"
            class="hover:bg-blue-50 cursor-pointer"
          >
            <td class="px-4 py-2 border-b">{{ pioneer.name }}</td>
            <td class="px-4 py-2 border-b capitalize">
              {{ pioneer.function || "—" }}
            </td>
            <td class="px-4 py-2 border-b">{{ pioneer.total_sum || 0 }}</td>
            <td class="px-4 py-2 border-b">
              {{ pioneer.total_bible_studies || 0 }}
            </td>
            <td class="px-4 py-2 border-b">
              {{ pioneer.total_average?.toFixed(1) || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const pioneers = ref([]);
const loading = ref(true);

const props = defineProps({
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
  },
});

watch(
  () => props.year,
  () => {
    fetchPioneers();
  }
);

const fetchPioneers = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/pioneers?service_year=${props.year}`);
    pioneers.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar pioneiros:", error);
  } finally {
    loading.value = false;
  }
};

const goToPioneer = (id) => {
  router.push(`/pioneer/${id}`);
};

onMounted(fetchPioneers);
</script>
