import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import { Upload } from '../../../db/repository';
import fs from 'fs';
import { promisify } from 'util';

const unlink = promisify(fs.unlink);

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// check if user is logged in
		if (!req.user || !req.user.id) {
			throw errors.Unauthorized('msg_unauthorized');
		}

		// check if file id is provided
		if (!req.params.id) {
			throw errors.BadRequest('msg_bad_request');
		}

		// delete file from database
		const deletedFile = await Upload.deleteUpload(parseInt(req.params.id));

		// delete file from storage
		await unlink(deletedFile.path);

		// return success message
		req.response = {
			status: 200,
			message: 'msg_file_deleted',
			data: {
				name: deletedFile.name,
				type: deletedFile.type,
			},
		};

		next();
	} catch (error) {
		next(error);
	}
};

export default deleteFile;
