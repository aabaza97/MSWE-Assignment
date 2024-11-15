import Router from 'express';
import { verifyAccessToken } from '../../feature/auth/middleware';

const router = Router();

import AuthRoutes from './auth.route';
router.use('/auth', AuthRoutes);

import MediaRoutes from './media.route';
router.use('/media', verifyAccessToken, MediaRoutes);

import LikeRoutes from './like.route';
router.use('/likes', verifyAccessToken, LikeRoutes);

export default router;
