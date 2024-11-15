import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import { Like } from '../../../db/repository';

const unlike = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// check if user is logged in
		if (!req.user || !req.user.id) {
			throw errors.Unauthorized('msg_unauthorized');
		}

		// check if media id is provided
		if (!req.params.id) {
			throw errors.BadRequest('msg_bad_request');
		}

		// unlike media
		await Like.unlike(req.user.id, parseInt(req.params.id));

		// return success message
		req.response = {
			status: 200,
			message: 'msg_media_unliked',
		};

		next();
	} catch (error) {
		next(error);
	}
};

export default unlike;
