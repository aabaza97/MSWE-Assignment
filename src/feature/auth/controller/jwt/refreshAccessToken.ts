import e, { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import jwt from 'jsonwebtoken';
import { validateUserFromToken } from '../../schema';

/**
 * Refresh the access token
 * @description - This controller will refresh the access token and send it to the user
 * @returns {void}
 * @throws {BadRequest} - If the payload is invalid
 */
const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate the payload
		const { error, value } = validateUserFromToken(req.user);
		if (error) {
			throw new errors.BadRequest('msg_invalid_request_body_format');
		}

		// Destructure the validated payload
		const { id, email, device_id: deviceId } = value;

		// Generate a new access token
		const accessToken = jwt.sign({ id, email, device_id: deviceId }, process.env.JWT_ACCESS_TOKEN_SECRET || '', {
			expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
		});

		// Send the new access token
		req.response = {
			status: 200,
			message: 'msg_access_token_refreshed',
			data: {
				access_token: accessToken,
			},
		};

		return next();
	} catch (error) {
		return next(error);
	}
};

export default refreshAccessToken;
