import pool from '../config/database.js';

export const creerNotification = async ({ idUtilisateur, type, titre, corps }, client = pool) => {
  const { rows } = await client.query(
    `INSERT INTO notification (id_utilisateur, type, titre, corps)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [idUtilisateur, type, titre, corps]
  );

  return rows[0];
};

export const listerNotifications = async ({ idUtilisateur }) => {
  const { rows } = await pool.query(
    `SELECT *
     FROM notification
     WHERE id_utilisateur = $1
     ORDER BY date_creation DESC`,
    [idUtilisateur]
  );

  return rows;
};
