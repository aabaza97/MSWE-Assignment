import { Request } from 'express';
import path from 'path';
import errors from 'http-errors';
import { Uploader } from '../../../config';
import { Upload } from '../../../db/repository';

/**
 * Define storage folder
 */
const storage = 'image';

/**
 * Validates the request payload
 */
const validate = (req: Request) => {
	// validate payload
	if (!req.user || !req.user.id) throw errors.Unauthorized('User not logged in');

	return { user_id: req.user.id };
};

/**
 * Custom destination folder
 */
const imageDestination = (req: Request, file: Express.Multer.File) => {
	// validate payload
	const { user_id: userId } = validate(req);

	// create custom destination folder with user id
	const uploadPath = `../../../../public/storage/${storage}/${userId}`;

	return {
		storage,
		uploadPath: path.join(__dirname, uploadPath).toString(),
		uploadType: Upload.UploadType.IMAGE,
	};
};

/**
 * Custom file name
 */
const imageFilename = (req: Request, file: Express.Multer.File) =>
	// create file name with originalname and timestamp in the format: timestamp-originalname replacing spaces with underscores.
	// e.g. 1628180000000-image_name.png
	`${Date.now()}-${file.originalname.replace(/ /g, '_')}`;

/**
 * Image uploader middleware that uploads a single `image` to a custom destination folder with a custom file name.
 */

export default Uploader.uploadTo(
	Uploader.destination(imageDestination),
	Uploader.filename(imageFilename),
	Uploader.FileFilter.imageFilter
).single(storage);
