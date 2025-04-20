<template>
  <div class="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Salvar Atividade</h2>

    <form @submit.prevent="saveActivity" class="space-y-4">
      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1 font-medium">Ano</label>
          <input
            v-model="form.year"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="flex-1">
          <label class="block mb-1 font-medium">Mês</label>
          <select
            v-model="form.month"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option disabled value="">Selecione</option>
            <option
              v-for="(name, num) in monthNames"
              :key="num"
              :value="parseInt(num)"
            >
              {{ name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="block mb-1 font-medium">Horas</label>
          <input
            v-model="form.hour"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="flex-1">
          <label class="block mb-1 font-medium">Horas de Crédito</label>
          <input
            v-model="form.hour_credit"
            type="number"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label class="block mb-1 font-medium">Estudos Bíblicos</label>
        <input
          v-model="form.bible_study"
          type="number"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block mb-1 font-medium">Comentário</label>
        <textarea
          v-model="form.comment"
          rows="3"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex justify-end gap-2">
        <button
          type="button"
          @click="router.back()"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Voltar
        </button>
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>

      <p v-if="successMessage" class="text-green-600 mt-2">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="text-red-600 mt-2">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";

const route = useRoute();
const router = useRouter();

const pioneerId = route.params.pioneer_id;
const activityId = route.params.activity_id;
const year = route.params.year;

const form = ref({
  pioneer_id: pioneerId,
  year: new Date().getFullYear(),
  month: "",
  hour: "",
  hour_credit: "",
  bible_study: "",
  comment: "",
});

const successMessage = ref("");
const errorMessage = ref("");

const monthNames = {
  1: "Janeiro",
  2: "Fevereiro",
  3: "Março",
  4: "Abril",
  5: "Maio",
  6: "Junho",
  7: "Julho",
  8: "Agosto",
  9: "Setembro",
  10: "Outubro",
  11: "Novembro",
  12: "Dezembro",
};

const fetchActivity = async () => {
  try {
    const response = await api.get(`/activities/${pioneerId}`, {
      params: { service_year: year },
    });
    form.value = response.data.activities.find(
      (item) => item.id === Number(activityId)
    );
  } catch (err) {
    console.error(err);
  }
};

const createActivity = async () => {
  try {
    const response = await api.post("/activities", form.value);
  } catch (err) {
    throw err;
  }
};

const editActivity = async () => {
  try {
    const response = await api.put(`/activities/${activityId}`, form.value);
  } catch (err) {
    throw err;
  }
};

const saveActivity = async () => {
  successMessage.value = "";
  errorMessage.value = "";

  try {
    if (activityId === "new") {
      await createActivity();
    } else {
      await editActivity();
    }

    successMessage.value = "Atividade registrada com sucesso!";
    router.push(`/pioneer/${pioneerId}`);
  } catch (err) {
    errorMessage.value = err.response.data.error
      ? err.response.data.error
      : err.message;
  }
};

onMounted(() => {
  if (activityId !== "new") {
    fetchActivity();
  }
});
</script>
