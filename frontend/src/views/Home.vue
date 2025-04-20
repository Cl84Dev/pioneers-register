<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Pioneiros</h1>

    <div class="mb-5">
      <label for="year" class="mr-2 font-semibold">Ano de Serviço:</label>
      <select id="year" v-model="selectedYear" class="border rounded px-3 py-1">
        <option v-for="year in serviceYearOptions" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
    <PioneerList :year="selectedYear" />
    <TotalStats :year="selectedYear" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import PioneerList from "../components/PioneerList.vue";
import TotalStats from "../components/TotalStats.vue";

const selectedYear = ref(new Date().getFullYear());

const currentYear =
  new Date().getMonth() >= 8
    ? new Date().getFullYear() + 1
    : new Date().getFullYear();

const serviceYearOptions = [currentYear - 1, currentYear, currentYear + 1];
</script>
