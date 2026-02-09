import { calculerPoints, incrementerPoints } from '../../src/services/points.service.js';
import pool, {
  prepareDatabase,
  resetDatabase,
  closeDatabase
} from '../helpers/testDatabase.js';

beforeAll(async () => {
  // Mise en place du schéma minimal pour les tests unitaires.
  await prepareDatabase();
});

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('points.service', () => {
  it('calculerPoints utilise les valeurs par défaut', () => {
    expect(calculerPoints('signalement')).toBe(10);
    expect(calculerPoints('defi_reussi')).toBe(50);
    expect(calculerPoints('action_inconnue')).toBe(1);
  });

  it('calculerPoints accepte un points custom positif', () => {
    expect(calculerPoints('signalement', 42)).toBe(42);
  });

  it('incrementerPoints cumule les points', async () => {
    const total = await incrementerPoints({
      client: pool,
      idUtilisateur: 1,
      points: 15
    });

    expect(total).toBe(15);
  });
});
