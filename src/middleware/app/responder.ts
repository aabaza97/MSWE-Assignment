import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';

/**
 * Middleware function to handle the response object in the request.
 *
 * This function checks if the request object contains a response. If it does,
 * it extracts the message, status, and data from the response and sends a JSON
 * response with the appropriate status code. If the response does not contain
 * data, it sends a JSON response with just the status and message.
 *
 * If the request object does not contain a response, it throws a 404 Not Found
 * error with the message 'msg_res_not_found'.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 */
const responder = (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.response) {
			const { message, status, data } = req.response;

			if (data) {
				res.status(status).json({
					status,
					message,
					data,
				});
				return;
			}

			res.status(status).json({
				status,
				message,
			});
			return;
		}

		throw errors.NotFound('msg_res_not_found');
	} catch (error) {
		next(error);
	}
};

export default responder;
