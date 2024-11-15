import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import { Upload } from '../../../db/repository';

const getUserUploads = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// check if user is logged in
		if (!req.user || !req.user.id) {
			throw errors.Unauthorized('msg_unauthorized');
		}

		// get page number from request params
		const { page = '0' } = req.params;
		const pageSize = 10;

		// get user uploads
		const uploads = await Upload.findUploadsByUserId(req.user.id.toString(), pageSize, parseInt(page) * pageSize);

		// construct media response
		const media = uploads.map((upload) => {
			const { id, name, type, user_id } = upload;
			const downloadURL = `${process.env.HOST_DOMAIN}/${type}/${user_id}/${name}`;
			return { id, name, type, user_id, downloadURL };
		});

		// send response
		req.response = {
			status: 200,
			message: 'msg_success',
			data: { media },
		};
		next();
	} catch (error) {
		next(error);
	}
};

export default getUserUploads;
