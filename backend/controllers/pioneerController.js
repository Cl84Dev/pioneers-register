const db = require("../db/database");

exports.getAllPioneers = (req, res) => {
  const serviceYear =
    parseInt(req.query.service_year) || new Date().getFullYear();

  const prevYear = serviceYear - 1;

  const query = `
      SELECT 
        p.id,
        p.name,
        p.baptizing_date,
        p.birth_date,
        p.function,
        SUM(a.hour) as total_hours,
        SUM(a.hour_credit) as total_hour_credits,
        SUM(a.hour + a.hour_credit) as total_sum,
        SUM(a.bible_study) as total_bible_studies,
        AVG(a.hour) as average_hours,
        AVG(a.hour_credit) as average_hour_credits,
        AVG(a.hour + a.hour_credit) as total_average,
        AVG(a.bible_study) as average_bible_studies
      FROM pioneers p
      LEFT JOIN activities a ON p.id = a.pioneer_id
        AND (
          (a.year = ? AND a.month >= 9)
          OR
          (a.year = ? AND a.month <= 8)
        )
      GROUP BY p.id
      ORDER BY p.name ASC
    `;

  db.all(query, [prevYear, serviceYear], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getPioneerById = (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM pioneers WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Pioneer not found" });
    res.json(row);
  });
};

exports.createPioneer = (req, res) => {
  const { name, baptizing_date, birth_date, function: func } = req.body;

  const stmt = `INSERT INTO pioneers (name, baptizing_date, birth_date, function) VALUES (?, ?, ?, ?)`;
  db.run(stmt, [name, baptizing_date, birth_date, func || ""], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID });
  });
};

exports.updatePioneer = (req, res) => {
  const { id } = req.params;
  const { name, baptizing_date, birth_date, function: func } = req.body;

  const stmt = `UPDATE pioneers SET name = ?, baptizing_date = ?, birth_date = ?, function = ? WHERE id = ?`;
  db.run(
    stmt,
    [name, baptizing_date, birth_date, func || "", id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Pioneer not found" });
      res.json({ changes: this.changes });
    }
  );
};

exports.deletePioneer = (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM pioneers WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Pioneer not found" });
    res.json({ deleted: this.changes });
  });
};
