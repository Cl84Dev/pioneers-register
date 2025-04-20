<template>
  <nav class="container mx-auto flex items-center justify-between p-4">
    <div class="text-lg font-semibold">Registro de Pioneiros</div>
    <div class="flex gap-4">
      <router-link to="/" class="hover:underline">Home</router-link>
      <router-link to="/save-pioneer/new" class="hover:underline"
        >Novo Pioneiro</router-link
      >
      <router-link to="/backup" class="hover:underline">Backup</router-link>
    </div>
  </nav>
</template>
