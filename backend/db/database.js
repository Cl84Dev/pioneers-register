const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.sqlite");
const dbExists = fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) return console.error(err.message);
  console.log("Conectado ao banco SQLite.");
});

if (!dbExists) {
  console.log("Criando estrutura do banco...");

  db.serialize(() => {
    // Tabela de pioneiros
    db.run(`
      CREATE TABLE pioneers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        baptizing_date TEXT,
        birth_date TEXT,
        function TEXT CHECK(function IN ('ancião', 'servo ministerial', 'publicador')) DEFAULT 'publicador'
      )
    `);

    // Tabela de atividades
    db.run(`
      CREATE TABLE activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pioneer_id INTEGER NOT NULL,
        year INTEGER NOT NULL,
        month INTEGER NOT NULL,
        hour INTEGER NOT NULL,
        hour_credit INTEGER DEFAULT 0,
        bible_study INTEGER DEFAULT 0,
        comment TEXT,
        FOREIGN KEY (pioneer_id) REFERENCES pioneers(id)
      )
    `);
  });
}

module.exports = db;
