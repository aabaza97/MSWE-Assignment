import { Request, Response, NextFunction } from 'express';

import errors from 'http-errors';
import jwt from 'jsonwebtoken';
import * as Redis from '../../../../redis';
import { validateVerifyOTPToResetPassword } from '../../schema';

/**
 * Verify OTP to reset password
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @description a function that verifies the OTP sent to the user's email to reset the password
 * @throws {BadRequest} - if the request body is invalid
 * @throws {NotFound} - if the OTP is not found in redis
 * @throws {Unauthorized} - if the OTP is invalid
 * @returns {Promise<Void>}
 */
const verifyOTPToResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate the request body
		const { error, value } = validateVerifyOTPToResetPassword(req.body);

		if (error) {
			throw errors.BadRequest('msg_invalid_request_body_format');
		}

		// Destructure validated request body
		const { email, otp } = value;

		// Get the OTP from redis
		const cachedData = (await Redis.call.otpForPasswordReset(email)) as { otp: string };
		if (!(cachedData && cachedData.otp)) {
			throw errors.NotFound('msg_password_reset_cache_not_found');
		}

		// Check if the otp is valid
		if (cachedData.otp !== otp) {
			throw errors.Unauthorized('msg_invalid_password_reset_otp');
		}

		// Update the verfiied status of the OTP in redis
		await Redis.cache.otpVerificationForPasswordReset(email);

		// Generate a password reset token
		const passwordResetToken = jwt.sign({ email }, process.env.PASSWORD_RESET_TOKEN_SECRET || '', {
			expiresIn: process.env.PASSWORD_RESET_TOKEN_EXPIRY,
		});

		// Return the password reset token
		req.response = {
			status: 200,
			message: 'msg_password_reset_otp_verified',
			data: {
				password_reset_token: passwordResetToken,
			},
		};

		return next();
	} catch (error) {
		return next(error);
	}
};

export default verifyOTPToResetPassword;
