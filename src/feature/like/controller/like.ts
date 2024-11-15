import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import { Like } from '../../../db/repository';

const like = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// check if user is logged in
		if (!req.user || !req.user.id) {
			throw errors.Unauthorized('msg_unauthorized');
		}

		// check if media id is provided
		if (!req.params.id) {
			throw errors.BadRequest('msg_bad_request');
		}

		// like media
		const like = {
			user_id: req.user.id,
			upload_id: parseInt(req.params.id),
		} satisfies Like.DBLike;

		const [liked, created] = await Like.like(like);

		// check if media is already liked
		if (!created) {
			throw errors.Conflict('msg_media_already liked');
		}

		// return success message
		req.response = {
			status: 200,
			message: 'msg_media_liked',
			data: {
				user_id: liked.user_id,
				upload_id: liked.upload_id,
			},
		};

		next();
	} catch (error) {
		next(error);
	}
};

export default like;
