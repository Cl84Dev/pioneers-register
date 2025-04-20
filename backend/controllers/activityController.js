const db = require("../db/database");

const checkActivityExists = (pioneer_id, year, month, activity_id = null) => {
  return new Promise((resolve, reject) => {
    let query = `SELECT id FROM activities WHERE pioneer_id = ? AND year = ? AND month = ?`;
    const params = [pioneer_id, year, month];

    if (activity_id) {
      query += ` AND id != ?`;
      params.push(activity_id);
    }

    db.get(query, params, (err, row) => {
      if (err) reject(err);
      resolve(row ? true : false);
    });
  });
};

exports.getAllActivities = (req, res) => {
  const serviceYear =
    parseInt(req.query.service_year) || new Date().getFullYear();

  const prevYear = serviceYear - 1;

  const query = `
      SELECT 
        SUM(hour) as total_hours,
        SUM(hour_credit) as total_hour_credits,
        SUM(bible_study) as total_bible_studies,
        AVG(hour) as average_hours,
        AVG(hour_credit) as average_hour_credits,
        AVG(bible_study) as average_bible_studies
      FROM activities
      WHERE (year = ? AND month >= 9)
         OR (year = ? AND month <= 8)
    `;

  db.get(query, [prevYear, serviceYear], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
};

exports.getActivitiesByPioneerId = (req, res) => {
  const pioneerId = req.params.pioneer_id;
  const serviceYear =
    parseInt(req.query.service_year) || new Date().getFullYear();

  const prevYear = serviceYear - 1;
  const activitiesQuery = `
        SELECT *
        FROM activities
        WHERE pioneer_id = ?
          AND ((year = ? AND month >= 9)
            OR (year = ? AND month <= 8))
        ORDER BY year DESC, month DESC
       `;

  const statsQuery = `
        SELECT
          SUM(hour) as total_hours,
          SUM(hour_credit) as total_hour_credits,
          SUM(hour + hour_credit) as total_sum,
          SUM(bible_study) as total_bible_studies,
          AVG(hour) as average_hours,
          AVG(hour_credit) as average_hour_credits,
          AVG(hour + hour_credit) as total_average,          
          AVG(bible_study) as average_bible_studies
        FROM activities
        WHERE pioneer_id = ?
          AND ((year = ? AND month >= 9)
            OR (year = ? AND month <= 8))
       `;

  db.all(
    activitiesQuery,
    [pioneerId, prevYear, serviceYear],
    (err, activities) => {
      if (err) return res.status(500).json({ error: err.message });

      db.get(statsQuery, [pioneerId, prevYear, serviceYear], (err, stats) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ activities, stats });
      });
    }
  );
};

exports.createActivity = async (req, res) => {
  const { pioneer_id, year, month, hour, hour_credit, bible_study, comment } =
    req.body;

  const exists = await checkActivityExists(pioneer_id, year, month);
  if (exists) {
    return res
      .status(400)
      .json({ error: "Atividade para esse mês e ano existente" });
  }

  const stmt = `INSERT INTO activities (pioneer_id, year, month, hour, hour_credit, bible_study, comment)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.run(
    stmt,
    [
      pioneer_id,
      year,
      month,
      hour,
      hour_credit || 0,
      bible_study || 0,
      comment || "",
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.deleteActivity = (req, res) => {
  const activityId = req.params.id;

  const stmt = `DELETE FROM activities WHERE id = ?`;
  db.run(stmt, [activityId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Atividade não encontrada" });
    res.json({ message: "Atividade deletada com sucesso" });
  });
};

exports.updateActivity = async (req, res) => {
  const activityId = req.params.id;
  const { hour, hour_credit, bible_study, comment, pioneer_id, year, month } =
    req.body;

  const exists = await checkActivityExists(pioneer_id, year, month, activityId);
  if (exists) {
    return res
      .status(400)
      .json({ error: "Atividade para esse mês e ano existente" });
  }

  const stmt = `UPDATE activities 
                SET hour = ?, 
                    hour_credit = ?, 
                    bible_study = ?, 
                    comment = ?
                WHERE id = ?`;
  db.run(
    stmt,
    [hour, hour_credit || 0, bible_study || 0, comment || "", activityId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Atividade não encontrada" });
      res.json({ message: "Atividade atualizada com sucesso" });
    }
  );
};
