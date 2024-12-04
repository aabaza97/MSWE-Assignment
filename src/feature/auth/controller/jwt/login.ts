import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../../../../db/repository';
import { generateAuthTokens } from '../../helper';
import { validateLogin } from '../../schema';

/**
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @returns {Promise<void>} - the response object
 * @description a controller function used to log a user in
 * @throws {BadRequest} - if any of the required fields are missing
 * @throws {NotFound} - if the user does not exist
 * @throws {Unauthorized} - if the password is invalid
 * @throws {InternalServerError} - if an error occurs while interacting with the database
 * @throws {InternalServerError} - if an error occurs while hashing the password
 * @throws {InternalServerError} - if an error occurs while generating the auth tokens
 */
const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate request payload
		const { error, value } = validateLogin(req.body);
		if (error) {
			return next(errors.BadRequest('msg_invalid_request_body_format'));
		}

		// Destructure payload
		const { email, password } = value;

		// Check if user exists
		const user = await User.findOneByEmail(email);
		if (!user) {
			throw errors.NotFound('msg_user_not_found');
		}

		// Check if password is correct
		const isPasswordCorrect = await bcrypt.compare(password, user.hash);
		if (!isPasswordCorrect) {
			throw errors.Unauthorized('msg_invalid_credentials');
		}

		// Generate auth tokens
		const { accessToken, refreshToken, ttl } = await generateAuthTokens(user);

		// Send response
		req.response = {
			status: 200,
			message: 'msg_login_successful',
			data: {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				access_token: accessToken,
				refresh_token: refreshToken,
				ttl,
			},
		};

		return next();
	} catch (error) {
		return next(error);
	}
};

export default login;
