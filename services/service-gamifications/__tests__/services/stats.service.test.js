import { recupererStatsUtilisateur } from '../../src/services/stats.service.js';
import {
  prepareDatabase,
  resetDatabase,
  closeDatabase,
  seedHistoriquePoints
} from '../helpers/testDatabase.js';
import pool from '../helpers/testDatabase.js';

beforeAll(async () => {
  // Préparation du schéma pour les statistiques.
  await prepareDatabase();
});

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('stats.service', () => {
  it('retourne des statistiques cohérentes avec l\'historique', async () => {
    await pool.query('UPDATE utilisateur SET points = 60 WHERE id_utilisateur = 1');

    await seedHistoriquePoints({
      idUtilisateur: 1,
      entries: [
        { points: 30, date: '2024-01-10T10:00:00Z' },
        { points: 30, date: '2024-01-10T14:00:00Z' }
      ]
    });

    const stats = await recupererStatsUtilisateur({ idUtilisateur: 1 });

    expect(stats.totalPoints).toBe(60);
    expect(Number(stats.parJour[0].points)).toBe(60);
    expect(stats.impactCO2).toBe(1);
  });
});
