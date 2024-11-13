import fs from 'fs';
import errors from 'http-errors';
import { Request } from 'express';

type CustomDestination = (req: Request, file: Express.Multer.File) => { storage: string; uploadPath: string };
type MulterCB = (error: Error | null, destination?: string) => void;

/**
 * Creates a destination folder with custom destination function if provided. Otherwise, defaults to the root folder.
 *
 * Appends the `storage` to the request object property `uploadInfo`.
 *
 * @param {Function?} customDestination – A function expecting `request` and `file` objects as its parameters that returns an `object` with the following properties:
 * - `storage` – The storage folder name
 * - `uploadPath` – The destination folder path
 *
 * @example
 * const customDestinationFn = (req) => {
 * 	/// do something with the request object if you want...
 * 	return {
 * 		storage: 'custom_storage',
 * 		uploadPath: 'custom_path',
 * 	};
 * };
 */
const dest = (customDestination: CustomDestination) => (req: Request, file: Express.Multer.File, cb: MulterCB) => {
	try {
		// validate payload
		if (!file) {
			throw errors.BadRequest('msg_no_file_to_upload');
		}

		// destructure validated payload and custom destination folder if provided else use default values
		const { storage = 'root', uploadPath = '../../../storage/' } = customDestination
			? customDestination(req, file) ?? {}
			: {};

		// append storage to request object
		req.uploadInfo = { storage, uploadPath };

		// create destination folder with user id, username and timestamp
		if (!fs.existsSync(uploadPath)) {
			fs.mkdirSync(uploadPath, { recursive: true });
		}

		return cb(null, uploadPath);
	} catch (error: Error | any) {
		return cb(errors.UnprocessableEntity(error.message || 'msg_unprocessable_entity'));
	}
};

export default dest;
