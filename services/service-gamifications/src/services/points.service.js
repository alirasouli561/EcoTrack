import pool from '../config/database.js';

const ACTION_POINTS = {
  signalement: 10,
  defi_reussi: 50,
  collecte: 5,
  participation: 2
};

export const calculerPoints = (typeAction, pointsCustom) => {
  if (Number.isInteger(pointsCustom) && pointsCustom > 0) {
    return pointsCustom;
  }

  return ACTION_POINTS[typeAction] || 1;
};

export const incrementerPoints = async ({ client = pool, idUtilisateur, points }) => {
  // Incrémente les points et renvoie le total pour la suite du traitement.
  const { rows } = await client.query(
    'UPDATE utilisateur SET points = points + $1 WHERE id_utilisateur = $2 RETURNING points',
    [points, idUtilisateur]
  );

  if (rows.length === 0) {
    const error = new Error('Utilisateur introuvable');
    error.status = 400;
    throw error;
  }

  return rows[0].points;
};

export const enregistrerHistoriquePoints = async ({ client = pool, idUtilisateur, points, typeAction }) => {
  await client.query(
    `INSERT INTO historique_points (id_utilisateur, delta_points, raison)
     VALUES ($1, $2, $3)`,
    [idUtilisateur, points, typeAction]
  );
};
