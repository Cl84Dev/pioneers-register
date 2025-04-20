import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import PioneerDetail from "../views/PioneerDetail.vue";
import SavePioneer from "../views/SavePioneer.vue";
import SaveActivity from "../views/SaveActivity.vue";
import Backup from "../views/Backup.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/pioneer/:id",
    name: "PioneerDetail",
    component: PioneerDetail,
  },
  {
    path: "/save-pioneer/:id",
    name: "SavePioneer",
    component: SavePioneer,
  },
  {
    path: "/save-activity/:pioneer_id/:activity_id/:year",
    name: "SaveActivity",
    component: SaveActivity,
  },
  {
    path: "/backup",
    name: "Backup",
    component: Backup,
  },
];

const router = createRouter({
  history: createWebHashHistory(), // ideal para Electron
  routes,
});

export default router;
