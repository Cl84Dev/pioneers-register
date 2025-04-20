<template>
  <div class="p-6 max-w-xl mx-auto">
    <div class="bg-white shadow-md rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Backup</h2>

      <div class="flex flex-col gap-4">
        <button
          @click="downloadBackup"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Fazer Backup
        </button>

        <input
          type="file"
          ref="fileInput"
          class="hidden"
          @change="handleRestore"
        />
        <button
          @click="confirmRestore"
          class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Restaurar Backup
        </button>

        <p class="text-sm text-center text-gray-600 mt-2">
          O arquivo para restaurar o backup deve ter a extensão .sqlite
        </p>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black/50"
    >
      <div class="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h3 class="text-lg font-semibold mb-4 text-gray-800">
          Confirmar Restauração
        </h3>
        <p class="mb-4 text-gray-600">
          Isso irá substituir os dados atuais. Tem certeza de que deseja
          continuar?
        </p>
        <div class="flex justify-end gap-2">
          <button @click="showModal = false" class="px-4 py-2 text-gray-700">
            Cancelar
          </button>
          <button
            @click="triggerFileInput"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Sim, restaurar
          </button>
        </div>
      </div>
    </div>

    <!-- Mensagem de sucesso -->
    <div
      v-if="successMessage"
      class="fixed bottom-4 right-4 bg-green-600 text-white py-2 px-4 rounded shadow-lg"
    >
      {{ successMessage }}
    </div>

    <div
      v-if="errorMessage"
      class="fixed bottom-4 right-4 bg-red-600 text-white py-2 px-4 rounded shadow-lg"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";

const router = useRouter();

const showModal = ref(false);
const fileInput = ref(null);
const successMessage = ref("");
const errorMessage = ref("");

const confirmRestore = () => {
  showModal.value = true;
};

const triggerFileInput = () => {
  showModal.value = false;
  fileInput.value.click();
};

const handleRestore = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Verificação pela extensão do nome do arquivo
  if (!file.name.endsWith(".sqlite")) {
    errorMessage.value =
      "Por favor, selecione um arquivo SQLite válido (.sqlite).";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    await api.post("/backup", formData);
    successMessage.value = "Backup restaurado com sucesso!";
    errorMessage.value = "";
    setTimeout(() => {
      successMessage.value = "";
      router.push("/");
    }, 2000);
  } catch (err) {
    errorMessage.value = "Erro ao restaurar o backup.";
    console.error(err);
  }
};

const downloadBackup = async () => {
  try {
    const response = await api.get("/backup", {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/x-sqlite3" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "backup.sqlite";
    link.click();
    window.URL.revokeObjectURL(url);

    successMessage.value = "Backup baixado com sucesso!";
    errorMessage.value = "";
  } catch (err) {
    errorMessage.value = "Erro ao baixar o backup.";
    console.error(err);
  }
};
</script>
