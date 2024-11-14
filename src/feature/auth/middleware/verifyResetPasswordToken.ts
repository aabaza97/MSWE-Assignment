import { NextFunction, Request, Response } from 'express';
import errors from 'http-errors';
import jwt from 'jsonwebtoken';
import * as Redis from '../../../redis';
import { validateToken } from '../schema';

/**
 * Verify the token to reset password
 * @description - This middleware will verify the access token and add the user to the request object if the token is valid.
 * @throws {UnauthorizedError} - If the token is invalid
 * @throws {UnauthorizedError} - If the token is not in redis
 * @throws {UnauthorizedError} - If the token is expired
 * @throws {UnauthorizedError} - If the token is not in the request header
 * @throws {UnauthorizedError} - If the token is not in the correct format
 */
const verifyResetPasswordToken = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Validate the auth header value
		const { error, value } = validateToken(req.headers.authorization);

		if (error) throw errors.Unauthorized('msg_pwd_reset_token_unspecified');

		const token = value.split(' ')[1];

		// Verify the token
		const { email } = jwt.verify(token, process.env.PASSWORD_RESET_TOKEN_SECRET || '') as jwt.JwtPayload;

		// Check if OTP verfied
		const verified = await Redis.call.otpVerificationForPasswordReset(email);
		if (!(verified && verified === 'true')) {
			throw errors.Unauthorized('msg_pwd_reset_otp_not_verified');
		}

		// Add the user to the request object
		req.user = { email };

		// Call the next middleware
		return next();
	} catch (error) {
		return next(error);
	}
};

export default verifyResetPasswordToken;
