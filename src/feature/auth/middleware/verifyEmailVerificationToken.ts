import { NextFunction, Request, Response } from 'express';

import errors from 'http-errors';
import jwt from 'jsonwebtoken';
import { validateToken } from '../schema';

/**
 * Verify the email verification token
 * @description - This middleware will verify the access token and add the user to the request object if the token is valid.
 * @returns {void}
 * @throws {UnauthorizedError} - If the token is invalid
 * @throws {UnauthorizedError} - If the token is not in redis
 * @throws {UnauthorizedError} - If the token is expired
 * @throws {UnauthorizedError} - If the token is not in the request header
 * @throws {UnauthorizedError} - If the token is not in the correct format
 */
const verifyEmailVerificationToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validate the auth header value
		const { error, value } = validateToken(req.params.token);
		if (error) throw errors.Unauthorized('msg_auth_token_unspecified');

		// Get the token from the request header
		const token = value;

		// Verify the token
		const { email, otp } = jwt.verify(
			token,
			process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET || ''
		) as jwt.JwtPayload;

		// Add the user to the request object
		req.body = { email, otp };

		// Call the next middleware
		return next();
	} catch (error) {
		return next(error);
	}
};

export default verifyEmailVerificationToken;
