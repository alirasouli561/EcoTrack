import { z } from 'zod';
import { enregistrerAction as enregistrerActionService } from '../services/gamificationService.js';

const actionSchema = z.object({
  id_utilisateur: z.number().int().positive(),
  type_action: z.string().min(2),
  points: z.number().int().positive().optional()
});

export const enregistrerAction = async (req, res, next) => {
  try {
    const payload = actionSchema.parse(req.body);

    const resultat = await enregistrerActionService({
      idUtilisateur: payload.id_utilisateur,
      typeAction: payload.type_action,
      pointsCustom: payload.points
    });

    res.status(201).json({
      message: 'Action enregistrée',
      pointsAjoutes: resultat.pointsAjoutes,
      totalPoints: resultat.totalPoints,
      nouveauxBadges: resultat.nouveauxBadges
    });
  } catch (error) {
    next(error);
  }
};
