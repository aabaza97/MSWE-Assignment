import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import bcrypt from 'bcrypt';
import * as Redis from '../../../../redis';
import { User } from '../../../../db/repository';
import { validateResetPassword } from '../../schema';

/**
 * Reset password for a user
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @description a controller function used to reset the password
 * @throws {BadRequest} - if the request body is invalid
 * @throws {NotFound} - if the user is not found
 * @throws {InternalServerError} - if there is an error while hashing the password
 * @returns {Promise<Void>}
 * @todo - send an email to the user to notify that the password has been reset
 */
const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate the request body
		const { error, value } = validateResetPassword(req.body);

		// Error handling
		if (error) {
			throw errors.BadRequest('msg_invalid_request_body_format');
		}

		// Destructure validated request body
		const { password } = value;

		if (!req.user || !req.user.email) {
			throw errors.NotFound('msg_user_not_found');
		}

		const { email } = req.user;

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10).then((hash) => hash);

		// Update the user's password
		await User.updatePassword(email, hashedPassword);

		// Delete the OTP from redis
		await Redis.invalidate.otpForPasswordReset(email);

		// Return the response
		req.response = {
			status: 200,
			message: 'msg_password_reset_successful',
		};

		return next();
	} catch (error) {
		return next(error);
	}
};

export default resetPassword;
