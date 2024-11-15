import Router from 'express';
import * as MediaManager from '../../feature/mediaManagement/controller';
import * as MediaUploader from '../../feature/mediaManagement/middleware';

const router = Router();

router.put('/images', MediaUploader.uploadImage, MediaManager.save);
router.put('/movies', MediaUploader.uploadMovie, MediaManager.save);

router.get('/:page?', MediaManager.getUserUploads);
// router.get('/:id', MediaManager.getSingleMedia);
// router.get('/user', MediaManager.getUserMedia);

router.delete('/:id', MediaManager.delete);

export default router;
