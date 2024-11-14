import Router from 'express';
import * as MediaManager from '../../feature/mediaManagement/controller';
import * as MediaUploader from '../../feature/mediaManagement/middleware';

const router = Router();

router.put('/images', MediaUploader.uploadImage, MediaManager.save);
router.put('/movies', MediaUploader.uploadMovie, MediaManager.save);

router.get('/', MediaManager.getAllMedia);
router.get('/:id', MediaManager.getSingleMedia);
router.get('/user', MediaManager.getUserMedia);

router.delete('/:id', MediaManager.deleteMedia);

export default router;
