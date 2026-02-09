import pool from '../config/database.js';

export const creerDefi = async ({
  titre,
  description,
  objectif,
  recompensePoints,
  dateDebut,
  dateFin,
  typeDefi
}) => {
  const { rows } = await pool.query(
    `INSERT INTO gamification_defi (titre, description, objectif, recompense_points, date_debut, date_fin, type_defi)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [titre, description, objectif, recompensePoints, dateDebut, dateFin, typeDefi]
  );

  return rows[0];
};

export const listerDefis = async () => {
  const { rows } = await pool.query(
    'SELECT * FROM gamification_defi ORDER BY date_debut DESC'
  );
  return rows;
};

export const creerParticipation = async ({ idDefi, idUtilisateur }) => {
  const { rows } = await pool.query(
    `INSERT INTO gamification_participation_defi (id_defi, id_utilisateur)
     VALUES ($1, $2)
     RETURNING *`,
    [idDefi, idUtilisateur]
  );

  return rows[0];
};

export const mettreAJourProgression = async ({ idDefi, idUtilisateur, progression, statut }) => {
  const { rows } = await pool.query(
    `UPDATE gamification_participation_defi
     SET progression = $1,
         statut = COALESCE($2, statut),
         derniere_maj = CURRENT_TIMESTAMP
     WHERE id_defi = $3 AND id_utilisateur = $4
     RETURNING *`,
    [progression, statut, idDefi, idUtilisateur]
  );

  return rows[0];
};
