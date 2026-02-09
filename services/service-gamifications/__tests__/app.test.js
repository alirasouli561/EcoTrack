import request from 'supertest';
import { jest } from '@jest/globals';

const buildApp = async ({ queryMock, connectMock }) => {
  await jest.unstable_mockModule('../src/config/database.js', () => ({
    default: {
      query: queryMock,
      connect: connectMock,
      end: jest.fn()
    },
    ensureGamificationTables: jest.fn()
  }));

  return (await import('../src/index.js')).default;
};

describe('Service gamification', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
  });

  it('GET /health retourne 200 avec le statut', async () => {
    const queryMock = jest.fn();
    const connectMock = jest.fn();
    const app = await buildApp({ queryMock, connectMock });

    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'gamifications' });
  });

  it('POST /actions valide les entrées et retourne 201', async () => {
    const queryMock = jest.fn();
    const clientQuery = jest.fn((sql) => {
      if (sql.startsWith('UPDATE utilisateur')) {
        return Promise.resolve({ rows: [{ points: 120 }] });
      }
      if (sql.includes('SELECT id_badge')) {
        return Promise.resolve({ rows: [] });
      }
      return Promise.resolve({ rows: [] });
    });
    const connectMock = jest.fn().mockResolvedValue({
      query: clientQuery,
      release: jest.fn()
    });
    const app = await buildApp({ queryMock, connectMock });

    const response = await request(app).post('/actions').send({
      id_utilisateur: 1,
      type_action: 'signalement'
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      message: 'Action enregistrée',
      pointsAjoutes: 10,
      totalPoints: 120,
      nouveauxBadges: []
    });
  });

  it('GET /badges retourne la liste des badges', async () => {
    const queryMock = jest.fn().mockResolvedValue({
      rows: [
        { id_badge: 1, code: 'DEBUTANT', nom: 'Débutant', description: 'Premier palier' }
      ]
    });
    const connectMock = jest.fn();
    const app = await buildApp({ queryMock, connectMock });

    const response = await request(app).get('/badges');

    expect(response.status).toBe(200);
    expect(response.body[0]).toMatchObject({
      code: 'DEBUTANT',
      points_requis: 100
    });
  });

  it('GET /classement retourne le classement', async () => {
    const queryMock = jest.fn()
      .mockResolvedValueOnce({ rows: [{ id_utilisateur: 7, points: 250 }] })
      .mockResolvedValueOnce({ rows: [{ code: 'DEBUTANT', nom: 'Débutant' }] });
    const connectMock = jest.fn();
    const app = await buildApp({ queryMock, connectMock });

    const response = await request(app).get('/classement');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id_utilisateur: 7, points: 250, badges: [{ code: 'DEBUTANT', nom: 'Débutant' }] }
    ]);
  });

  it('GET /notifications exige id_utilisateur', async () => {
    const queryMock = jest.fn();
    const connectMock = jest.fn();
    const app = await buildApp({ queryMock, connectMock });

    const response = await request(app).get('/notifications');

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Données invalides');
  });
});
