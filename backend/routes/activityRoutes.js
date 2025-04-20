const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

router.get("/", activityController.getAllActivities);
router.post("/", activityController.createActivity);
router.get("/:pioneer_id", activityController.getActivitiesByPioneerId);
router.put("/:id", activityController.updateActivity);
router.delete("/:id", activityController.deleteActivity);

module.exports = router;
