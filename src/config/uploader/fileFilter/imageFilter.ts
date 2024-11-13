import path from 'path';
import sharp from 'sharp';
import errors from 'http-errors';

// filtering files against allowed types
const fileFilter = async (file: Express.Multer.File, cb: any) => {
	try {
		// Type filter
		const allowedExts = /jpg/;
		const allowedMimes = /jpeg|jpg/;
		const fileNameHasValidExtension = allowedExts.test(path.extname(file.originalname).toLowerCase());
		const fileHasValidMimeType = allowedMimes.test(file.mimetype);

		if (!fileNameHasValidExtension || !fileHasValidMimeType) {
			return cb(errors.BadRequest('{.jpg are the only file types allowed.'));
		}

		return cb(null, true);
	} catch (error: Error | any) {
		// console.error(error);
		return cb({ error: error.message });
	}
};

export default fileFilter;
