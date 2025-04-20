const express = require("express");
const cors = require("cors");
const pioneerRoutes = require("./routes/pioneerRoutes");
const activityRoutes = require("./routes/activityRoutes");
const backupRoutes = require("./routes/backupRoutes");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Rotas organizadas
app.use("/api/pioneers", pioneerRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/backup", backupRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
