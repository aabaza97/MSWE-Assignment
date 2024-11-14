import Router from 'express';
import { verifyAccessToken } from '../../feature/auth/middleware';

const router = Router();

import AuthRoutes from './auth.route';
router.use('/auth', AuthRoutes);

import MediaRoutes from './media.route';
router.use('/media', verifyAccessToken, MediaRoutes);

export default router;
