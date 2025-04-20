const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const backupController = require("../controllers/backupController");

router.get("/", backupController.downloadBackup);
router.post("/", upload.single("file"), backupController.restoreBackup);

module.exports = router;
