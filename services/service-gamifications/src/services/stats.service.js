import pool from '../config/database.js';

export const recupererStatsUtilisateur = async ({ idUtilisateur }) => {
  const { rows: totalRows } = await pool.query(
    'SELECT points FROM utilisateur WHERE id_utilisateur = $1',
    [idUtilisateur]
  );

  if (totalRows.length === 0) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  const totalPoints = totalRows[0].points;

  const { rows: statsJour } = await pool.query(
    `SELECT date_trunc('day', date_creation) AS periode, SUM(delta_points) AS points
     FROM historique_points
     WHERE id_utilisateur = $1
     GROUP BY periode
     ORDER BY periode DESC
     LIMIT 7`,
    [idUtilisateur]
  );

  const { rows: statsSemaine } = await pool.query(
    `SELECT date_trunc('week', date_creation) AS periode, SUM(delta_points) AS points
     FROM historique_points
     WHERE id_utilisateur = $1
     GROUP BY periode
     ORDER BY periode DESC
     LIMIT 8`,
    [idUtilisateur]
  );

  const { rows: statsMois } = await pool.query(
    `SELECT date_trunc('month', date_creation) AS periode, SUM(delta_points) AS points
     FROM historique_points
     WHERE id_utilisateur = $1
     GROUP BY periode
     ORDER BY periode DESC
     LIMIT 12`,
    [idUtilisateur]
  );

  return {
    totalPoints,
    parJour: statsJour,
    parSemaine: statsSemaine,
    parMois: statsMois,
    impactCO2: Math.round(totalPoints * 0.02)
  };
};
