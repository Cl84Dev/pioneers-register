<template>
  <div>
    <h2 class="text-2xl font-semibold mb-4">Dados do Pioneiro</h2>

    <div v-if="loading" class="text-gray-500">Carregando...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div class="mb-16" v-else>
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700"
          >Nome</label
        >
        <input
          id="name"
          :value="pioneer.name"
          type="text"
          class="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          disabled
        />
      </div>

      <div class="mb-4">
        <label
          for="baptizing_date"
          class="block text-sm font-medium text-gray-700"
          >Data de Batismo</label
        >
        <input
          id="baptizing_date"
          :value="pioneer.baptizing_date"
          type="text"
          class="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          disabled
        />
      </div>

      <div class="mb-4">
        <label for="birth_date" class="block text-sm font-medium text-gray-700"
          >Data de Nascimento</label
        >
        <input
          id="birth_date"
          :value="pioneer.birth_date"
          type="text"
          class="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100"
          disabled
        />
      </div>

      <div class="mb-4">
        <label for="function" class="block text-sm font-medium text-gray-700"
          >Função</label
        >
        <input
          id="function"
          :value="pioneer.function || 'Outro'"
          type="text"
          class="mt-1 p-2 w-full border border-gray-300 rounded-md bg-gray-100 capitalize"
          disabled
        />
      </div>

      <div class="mb-4">
        <div class="flex gap-4">
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
            @click="$emit('add-activity')"
          >
            Adicionar Atividade
          </button>
          <button
            class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 cursor-pointer"
            @click="$emit('edit-pioneer')"
          >
            Editar Pioneiro
          </button>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 cursor-pointer"
            @click="$emit('show-delete-modal', 'pioneer')"
          >
            Excluir Pioneiro
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pioneer: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});
</script>
