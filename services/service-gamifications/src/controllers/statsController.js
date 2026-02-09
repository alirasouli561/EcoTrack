import { z } from 'zod';
import { recupererStatsUtilisateur } from '../services/stats.service.js';

const statsSchema = z.object({
  id_utilisateur: z.coerce.number().int().positive()
});

export const obtenirStatsUtilisateur = async (req, res, next) => {
  try {
    const { id_utilisateur } = statsSchema.parse({
      id_utilisateur: req.params.idUtilisateur
    });

    const stats = await recupererStatsUtilisateur({ idUtilisateur: id_utilisateur });
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
