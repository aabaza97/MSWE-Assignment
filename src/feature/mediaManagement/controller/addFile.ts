import { Request, Response, NextFunction } from 'express';
import path from 'path';
import errors from 'http-errors';
import { Upload } from '../../../db/repository';

const addFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// check upload info in request
		if (!req.uploadInfo) {
			throw errors.BadRequest('No file uploaded');
		}

		if (!req.user || !req.user.id) {
			throw errors.Unauthorized('User not logged in');
		}

		// get file info
		const { storage, uploadPath, filename, uploadType } = req.uploadInfo;

		if (!storage || !uploadPath || !filename || !uploadType) {
			throw errors.BadRequest('Missing file information');
		}

		const file = {
			name: filename,
			type: uploadType,
			user_id: req.user.id,
			path: path.join(uploadPath, filename),
		} satisfies Upload.NewDBUpload;

		// save file info to database
		const newFile = await Upload.addUpload(file);

		// construct download url
		const donwloadURL = `${process.env.HOST_DOMAIN}/${newFile.type}/${req.user.id}/${newFile.name}`;

		// send response
		req.response = {
			status: 201,
			message: 'File uploaded successfully',
			data: { download_url: donwloadURL },
		};
		next();
	} catch (error) {
		next(error);
	}
};

export default addFile;
