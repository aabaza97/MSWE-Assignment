import { Router } from 'express';
import * as LikeManager from '../../feature/like/controller';

const router = Router();

router.post('/:id', LikeManager.like);

router.delete('/:id', LikeManager.unlike);

export default router;
