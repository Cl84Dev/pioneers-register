<template>
  <div class="mb-16">
    <h3 class="text-2xl font-semibold mb-4">Atividades</h3>

    <div class="mb-16">
      <label for="year" class="mr-2 font-semibold">Ano de Serviço:</label>
      <select
        id="year"
        v-model="selectedYear"
        @change="$emit('change-date', selectedYear)"
        class="border rounded px-3 py-1"
      >
        <option v-for="year in serviceYearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <div v-if="activities.length === 0" class="text-center text-gray-500">
      Nenhuma atividade encontrada.
    </div>

    <table
      v-else
      class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-md"
    >
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-3 border-b">Ano</th>
          <th class="p-3 border-b">Mês</th>
          <th class="p-3 border-b">Horas</th>
          <th class="p-3 border-b">Crédito</th>
          <th class="p-3 border-b">Estudos Bíblicos</th>
          <th class="p-3 border-b">Comentário</th>
          <th class="p-3 border-b">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="activity in activities"
          :key="activity.id"
          class="hover:bg-gray-50 transition"
        >
          <td class="p-3 border-b">{{ activity.year }}</td>
          <td class="p-3 border-b">{{ monthName(activity.month) }}</td>
          <td class="p-3 border-b">{{ activity.hour }}</td>
          <td class="p-3 border-b">{{ activity.hour_credit }}</td>
          <td class="p-3 border-b">{{ activity.bible_study }}</td>
          <td class="p-3 border-b">{{ activity.comment || "—" }}</td>
          <td class="p-3 border-b">
            <div class="flex flex-row gap-3">
              <button
                @click="deleteActivity(activity.id)"
                class="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <i class="material-icons text-red-500">delete</i>
              </button>
              <button
                @click="editActivity(activity.id, activity.year)"
                class="text-red-500 hover:text-blue-700 cursor-pointer"
              >
                <i class="material-icons text-blue-500">edit</i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  activities: {
    type: Array,
    required: true,
  },
});

const currentYear =
  new Date().getMonth() >= 8
    ? new Date().getFullYear() + 1
    : new Date().getFullYear();

const serviceYearOptions = [currentYear - 1, currentYear, currentYear + 1];

const selectedYear = ref(currentYear);

const emit = defineEmits();

const deleteActivity = (id) => {
  emit("delete-activity", id);
};

const editActivity = (id, year) => {
  emit("edit-activity", id, year);
};

const monthName = (month) => {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return months[month - 1] || "Mês inválido";
};
</script>
