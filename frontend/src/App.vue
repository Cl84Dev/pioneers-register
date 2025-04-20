<template>
  <div class="min-h-screen flex flex-col bg-gray-50 text-gray-900">
    <!-- Navbar fixa no topo -->
    <header class="bg-blue-600 text-white shadow">
      <NavBar />
    </header>

    <!-- Conteúdo principal -->
    <main class="flex-1 p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>
