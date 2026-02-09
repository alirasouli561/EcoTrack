import pg from 'pg';
import env from './env.js';

const { Pool } = pg;

const pool = new Pool({
  connectionString: env.databaseUrl
});

pool.on('error', (err) => {
  console.error('Database error:', err);
});

pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL');
});

export const ensureGamificationTables = async () => {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS gamification_defi (
      id_defi SERIAL PRIMARY KEY,
      titre VARCHAR(100) NOT NULL,
      description TEXT,
      objectif INT NOT NULL,
      recompense_points INT NOT NULL DEFAULT 0,
      date_debut DATE NOT NULL,
      date_fin DATE NOT NULL,
      type_defi VARCHAR(30) NOT NULL DEFAULT 'INDIVIDUEL',
      CONSTRAINT ck_gamification_defi_objectif CHECK (objectif > 0),
      CONSTRAINT ck_gamification_defi_dates CHECK (date_fin >= date_debut)
    )`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS gamification_participation_defi (
      id_participation SERIAL PRIMARY KEY,
      id_defi INT NOT NULL,
      id_utilisateur INT NOT NULL,
      progression INT NOT NULL DEFAULT 0,
      statut VARCHAR(20) NOT NULL DEFAULT 'EN_COURS',
      derniere_maj TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_gamification_participation_defi
        FOREIGN KEY (id_defi)
        REFERENCES gamification_defi(id_defi)
        ON DELETE CASCADE,
      CONSTRAINT fk_gamification_participation_utilisateur
        FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateur(id_utilisateur)
        ON DELETE CASCADE,
      CONSTRAINT ck_gamification_participation_progression CHECK (progression >= 0)
    )`
  );

  await pool.query('CREATE INDEX IF NOT EXISTS idx_gamification_participation_defi ON gamification_participation_defi(id_defi, id_utilisateur)');
};

export default pool;
