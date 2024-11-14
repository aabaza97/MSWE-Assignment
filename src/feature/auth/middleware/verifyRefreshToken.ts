import { NextFunction, Request, Response } from 'express';
import errors from 'http-errors';
import jwt from 'jsonwebtoken';
import * as Redis from '../../../redis';
import { validateToken } from '../schema';

/**
 * Verify the refresh token
 * @description - This middleware will verify the access token and add the user to the request object if the token is valid.
 * @returns {void}
 * @throws {UnauthorizedError} - If the token is invalid
 * @throws {UnauthorizedError} - If the token is not in redis
 * @throws {UnauthorizedError} - If the token is expired
 * @throws {UnauthorizedError} - If the token is not in the request header
 * @throws {UnauthorizedError} - If the token is not in the correct format
 */
const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validate the auth header value
		const { error, value } = validateToken(req.headers.authorization);

		if (error) throw errors.Unauthorized('msg_auth_token_unspecified');

		// Get the token from the request header
		const token = value.split(' ')[1];

		// Verify the token
		const {
			id,
			email,
			device_id: deviceId,
		} = jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET || '') as jwt.JwtPayload;

		// Check if the token is in redis
		const tokenInRedis = await Redis.call.tokenForUserForDevice({ id }, deviceId);
		if (!tokenInRedis) throw errors.Unauthorized('msg_refresh_token_cache_not_found');

		// Add the user to the request object
		req.user = { id, email, device_id: deviceId };

		// Call the next middleware
		return next();
	} catch (error) {
		return next(error);
	}
};

export default verifyRefreshToken;
