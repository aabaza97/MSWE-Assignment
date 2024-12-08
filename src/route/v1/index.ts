import Router, { NextFunction } from 'express';
import { verifyAccessToken } from '../../feature/auth/middleware';
import { swaggerUi, setupFor, combineDocs } from '../../config/swagger.config';

const router = Router();

import * as docs from './docs';
router.use('/docs', swaggerUi.serve, setupFor(docs.base));

import AuthRoutes from './auth.route';
router.use('/auth', AuthRoutes);

import MediaRoutes from './media.route';
router.use('/media', verifyAccessToken, MediaRoutes);

import LikeRoutes from './like.route';
router.use('/likes', verifyAccessToken, LikeRoutes);

export default router;
