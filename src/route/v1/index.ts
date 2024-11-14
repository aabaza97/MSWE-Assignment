import Router from 'express';

const router = Router();

import AuthRoutes from './auth.route';
router.use('/auth', AuthRoutes);

export default router;
