import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import * as Redis from '../../../../redis';
import { User } from '../../../../db/repository';
import { generateAuthTokens } from '../../helper';
import { validateRegister } from '../../schema';
// const mailer = require('../../helper/mail');

/**
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @returns {Promise<Object>} - the response object
 * @description a controller function used to register a user
 * @throws {BadRequest} - if any of the required fields are missing
 * @throws {NotFound} - if the user does not exist
 * @throws {Unauthorized} - if the OTP is invalid
 * @throws {InternalServerError} - if an error occurs while creating the user
 * @throws {InternalServerError} - if an error occurs while interacting with redis
 */
const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate request body
		const { error, value } = validateRegister(req.body);

		// Check if there are any validation errors
		if (error) {
			throw errors.BadRequest('msg_invalid_request_body_format');
		}

		// Destructure the validated request body
		const { email, otp } = value;

		// Get the user from redis
		const user = (await Redis.call.forEmailVerification(email)) as Redis.UserCacheData;

		// Check if the user exists & has all the required fields
		if (!(user && user.email && user.first_name && user.last_name)) {
			throw errors.NotFound('msg_registration_cache_not_found');
		}

		// Check if the otp is valid
		if (user.otp !== otp) {
			throw errors.Unauthorized('msg_invalid_registration_otp');
		}

		// Destructure the user object
		const { first_name: firstName, last_name: lastName, hash } = user;

		// Create the user
		const newUser = { first_name: firstName, last_name: lastName, email, hash } satisfies User.NewDBUser;

		const createdUser = await User.createNew(newUser);

		// Invalidate the user data from redis
		await Redis.invalidate.dataForEmailVerification(email);

		// Generate auth tokens
		const { accessToken, refreshToken } = await generateAuthTokens(createdUser);

		// Send welcome email
		// await mailer.sendAccountCreationEmail(firstName, email);

		// Send the response
		req.response = {
			status: 201,
			message: 'msg_user_created_successfully',
			data: {
				id: createdUser.id,
				first_name: createdUser.first_name,
				last_name: createdUser.last_name,
				email: createdUser.email,
				access_token: accessToken,
				refresh_token: refreshToken,
			},
		};

		return next();
	} catch (error) {
		return next(error);
	}
};

export default register;
