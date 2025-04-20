<template>
  <div class="flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 class="text-2xl font-semibold text-center mb-6">Salvar Pioneiro</h2>

      <div v-if="loading" class="text-gray-500">Carregando...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>

      <!-- Formulário de Cadastro -->
      <form @submit.prevent="savePioneer" v-else>
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Nome</label
          >
          <input
            id="name"
            v-model="pioneer.name"
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          />
        </div>

        <div class="mb-4">
          <label
            for="baptizing_date"
            class="block text-sm font-medium text-gray-700"
            >Data de Batismo</label
          >
          <input
            v-model="pioneer.baptizing_date"
            type="text"
            placeholder="dd-mm-aaaa"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            @input="formatDate($event, 'baptizing_date')"
            required
          />
        </div>

        <div class="mb-4">
          <label
            for="birth_date"
            class="block text-sm font-medium text-gray-700"
            >Data de Nascimento</label
          >
          <input
            v-model="pioneer.birth_date"
            type="text"
            placeholder="dd-mm-aaaa"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            @input="formatDate($event, 'birth_date')"
            required
          />
        </div>

        <div class="mb-4">
          <label for="function" class="block text-sm font-medium text-gray-700"
            >Função</label
          >
          <select
            id="function"
            v-model="pioneer.function"
            class="mt-1 p-2 w-full border border-gray-300 rounded-md"
            required
          >
            <option value="">Selecione</option>
            <option value="ancião">Ancião</option>
            <option value="servo ministerial">Servo Ministerial</option>
            <option value="publicador">Publicador</option>
          </select>
        </div>

        <!-- Mensagens de erro -->
        <div v-if="errorMessage" class="mb-4 text-red-500 text-sm">
          {{ errorMessage }}
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="router.back()"
            class="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none cursor-pointer"
          >
            Voltar
          </button>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>

    <!-- Toast de Sucesso -->
    <div
      v-if="showSuccessToast"
      class="fixed top-5 right-5 bg-green-600 text-white p-4 rounded-md shadow-md"
    >
      <p>Salvo com sucesso!</p>
    </div>

    <!-- Toast de Erro -->
    <div
      v-if="showErrorToast"
      class="fixed top-5 right-5 bg-red-600 text-white p-4 rounded-md shadow-md"
    >
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import api from "../api/axios";

const pioneer = ref({
  name: "",
  baptizing_date: "",
  birth_date: "",
  function: "",
});

const errorMessage = ref("");
const showSuccessToast = ref(false);
const showErrorToast = ref(false);

const loading = ref(false);
const error = ref(null);

const router = useRouter();
const route = useRoute();

const pioneerId = route.params.id;

const fetchPioneer = async () => {
  loading.value = true;
  try {
    const res = await api.get(`/pioneers/${pioneerId}`);
    pioneer.value = res.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const editPioneer = async () => {
  try {
    await api.put(`/pioneers/${pioneerId}`, pioneer.value);
    router.push("/");
  } catch (err) {
    error.value = err.message;
  }
};

const createPioneer = async () => {
  try {
    await api.post("/pioneers", pioneer.value);
    router.push("/");
  } catch (err) {
    error.value = err.message;
  }
};

// Função para criar o pioneiro
const savePioneer = async () => {
  errorMessage.value = ""; // Resetando a mensagem de erro

  // Validando campos
  if (
    !pioneer.value.name ||
    !pioneer.value.baptizing_date ||
    !pioneer.value.birth_date ||
    !pioneer.value.function
  ) {
    errorMessage.value = "Todos os campos são obrigatórios!";
    return;
  }

  try {
    if (pioneerId === "new") {
      await createPioneer();
    } else {
      await editPioneer();
    }

    // Exibindo o Toast de sucesso
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 3000);

    // Redirecionando para a página inicial
    pioneerId === "new"
      ? router.push("/")
      : router.push(`/pioneer/${pioneerId}`);
  } catch (error) {
    // Exibindo o Toast de erro
    errorMessage.value =
      error.response?.data?.error || "Ocorreu um erro ao cadastrar o pioneiro.";
    showErrorToast.value = true;
    setTimeout(() => {
      showErrorToast.value = false;
    }, 3000);
  }
};

const formatDate = (event, field) => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 8);
  if (value.length >= 5) {
    value = `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4)}`;
  } else if (value.length >= 3) {
    value = `${value.slice(0, 2)}-${value.slice(2)}`;
  }
  pioneer.value[field] = value;
};

onMounted(() => {
  if (pioneerId !== "new") {
    fetchPioneer();
  }
});
</script>

<style scoped>
/* Estilos para o Toast */
.fixed {
  position: fixed;
  top: 5%;
  right: 5%;
  z-index: 9999;
  max-width: 320px;
}
</style>
