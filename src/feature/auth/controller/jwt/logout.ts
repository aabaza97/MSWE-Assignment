import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import * as Redis from '../../../../redis';
import { validateLogout } from '../../schema';

/**
 * Logs the user out
 * @description - This function will delete the token for the device for the user from redis
 * @returns {void}
 * @throws {InternalServerError} - If an error occurs while deleting the token from redis
 */
const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate the payload
		const { error, value } = validateLogout(req.user);

		if (error) throw errors.BadRequest('msg_invalid_request_body_format');

		// Destructure the validated payload
		const { id, device_id: deviceId } = value;

		// Delete the token for the device for the user from redis
		const result = await Redis.invalidate.tokenForUserDevice({ id }, deviceId);
		if (result !== 1) throw errors.UnprocessableEntity('msg_failed_logout');

		// Send the response
		req.response = {
			status: 200,
			message: 'msg_log_out_successful',
		};

		return next();
	} catch (error) {
		return next(error);
	}
};

export default logout;
