const path = require("path");
const fs = require("fs");

const DB_PATH = path.join(__dirname, "../db/db.sqlite"); // ajuste conforme necessário

exports.downloadBackup = (req, res) => {
  res.download(DB_PATH, "backup.sqlite", (err) => {
    if (err) {
      console.error("Erro no download do backup:", err);
      res.status(500).send("Erro ao baixar backup.");
    }
  });
};

exports.restoreBackup = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).send("Nenhum arquivo enviado.");

  fs.copyFile(file.path, DB_PATH, (err) => {
    fs.unlink(file.path, () => {}); // remove arquivo temporário
    if (err) {
      console.error("Erro ao restaurar backup:", err);
      return res.status(500).send("Erro ao restaurar backup.");
    }
    res.send("Backup restaurado com sucesso!");
  });
};
