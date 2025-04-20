<template>
  <div
    class="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-2xl shadow-md border border-gray-200"
  >
    <PioneerData
      :pioneer="pioneer"
      :loading="loading"
      :error="error"
      @add-activity="addActivity"
      @edit-pioneer="editPioneer"
      @show-delete-modal="(data) => showDeleteModal(data)"
    />
    <PioneerActivity
      :activities="activities"
      @change-date="(date) => fetchStats(date)"
      @delete-activity="(id) => showDeleteModal('activity', id)"
      @edit-activity="(id, year) => editActivity(id, year)"
    />
    <PioneerStats :stats="stats" />

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full flex items-center justify-center"
    >
      <div
        class="relative mx-auto p-5 border w-96 shadow-lg rounded-2xl bg-white"
      >
        <div class="mt-3 text-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Confirmar Exclusão
          </h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Tem certeza que deseja excluir
              {{
                deleteType === "pioneer" ? "este pioneiro" : "esta atividade"
              }}?
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="confirmDelete"
              class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mr-2 cursor-pointer"
            >
              Excluir
            </button>
            <button
              @click="cancelDelete"
              class="px-4 py-2 bg-gray-100 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api/axios";
import PioneerData from "../components/PioneerData.vue";
import PioneerActivity from "../components/PioneerActivity.vue";
import PioneerStats from "../components/PioneerStats.vue";

const route = useRoute();
const router = useRouter();
const pioneerId = route.params.id;

const loading = ref(true);
const error = ref(null);
const pioneer = ref({});
const stats = ref({});
const activities = ref([]);
const showModal = ref(false);
const activityToDelete = ref(null);
const deleteType = ref(null);

const fetchPioneer = async () => {
  try {
    const res = await api.get(`/pioneers/${pioneerId}`);
    pioneer.value = res.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchStats = async (serviceYear) => {
  try {
    const res = await api.get(
      `/activities/${pioneerId}?service_year=${
        serviceYear || new Date().getFullYear()
      }`
    );
    stats.value = res.data.stats;
    activities.value = res.data.activities;
  } catch (err) {
    error.value = err.message;
  }
};

const showDeleteModal = (type, id = null) => {
  deleteType.value = type;
  activityToDelete.value = id;
  showModal.value = true;
};

const editPioneer = () => {
  router.push(`/save-pioneer/${pioneerId}`);
};

const addActivity = () => {
  router.push(`/save-activity/${pioneerId}/new/new`);
};

const editActivity = (id, year) => {
  router.push(`/save-activity/${pioneerId}/${id}/${year}`);
};

const confirmDelete = async () => {
  try {
    if (deleteType.value === "pioneer") {
      await api.delete(`/pioneers/${pioneerId}`);
      router.push("/");
    } else {
      await api.delete(`/activities/${activityToDelete.value}`);
      fetchStats();
    }
    showModal.value = false;
  } catch (err) {
    error.value = err.message;
  }
};

const cancelDelete = () => {
  showModal.value = false;
  activityToDelete.value = null;
  deleteType.value = null;
};

onMounted(() => {
  fetchPioneer();
  fetchStats();
});
</script>
