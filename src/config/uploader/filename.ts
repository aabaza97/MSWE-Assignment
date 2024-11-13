import errors from 'http-errors';
import { Request } from 'express';

type CustomName = (req: any, file: any) => string;
type MulterCB = (error: Error | null, filename?: string) => void;

/**
 * Creates a file name with custom name function if provided. Otherwise, defaults to the current timestamp + the original file name.
 *
 * Appends the `filename` to the request object property `uploadInfo`.
 *
 * @param {Function?} customName – A function expecting `request` and `file` objects as its parameters that returns a string representing the file name
 *
 * @example
 * const customNamingFn = (file) =>
 * 	// create file name with user id, username and timestamp
 * 	`${Date.now()}-${file.originalname.replace(/ /g, '_')}`;
 *
 * @param {Function?} customName – A function that returns a string representing the file name
 */
const filename = (customName: CustomName) => (req: Request, file: Express.Multer.File, cb: MulterCB) => {
	try {
		// validate payload
		if (!file) {
			throw errors.BadRequest('msg_no_file_to_upload');
		}

		// default file name replaces spaces with underscores
		const defaultName = `${Date.now()}-${file.originalname}`.replace(/ /g, '_');

		// create file name with custom name function if provided
		const newName = customName ? customName(req, file) ?? defaultName : defaultName;

		req.uploadInfo = { ...req.uploadInfo, filename: newName };

		return cb(null, newName);
	} catch (error: Error | any) {
		return cb(error);
	}
};

export default filename;
