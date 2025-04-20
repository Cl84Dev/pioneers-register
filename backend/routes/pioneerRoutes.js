const express = require("express");
const router = express.Router();
const pioneerController = require("../controllers/pioneerController");

router.get("/", pioneerController.getAllPioneers);
router.post("/", pioneerController.createPioneer);
router.get("/:id", pioneerController.getPioneerById);
router.put("/:id", pioneerController.updatePioneer);
router.delete("/:id", pioneerController.deletePioneer);
module.exports = router;
