import { Router } from 'express';
import { userManager } from '../dao/mongo/UserManager.js';
import { jwtValidation } from '../middlewares/jwt.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import passport from 'passport';
const router = Router();

router.get(
  '/:idUser',
  //jwtValidation,
  passport.authenticate('jwt', { session: false }),
  authMiddleware(['PUBLIC']),
  async (req, res) => {
    console.log('Passport jwt');
    const { idUser } = req.params;
    const user = await userManager.findById(idUser);
    res.json({ message: 'User', user });
  }
);

export default router;