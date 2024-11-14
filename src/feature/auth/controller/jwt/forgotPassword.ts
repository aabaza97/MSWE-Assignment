import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import otpGenerator from 'otp-generator';
import { User } from '../../../../db/repository';
import * as Redis from '../../../../redis';
// const mailer = require('../../../helper/mail');
import { validateForgotPassword } from '../../schema';
import { queueEmails } from '../../helper';
import { EmailTypes } from '../../../../mail';

/**
 * Send forgot password email
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @returns {Promise<void>} - the response object
 * @description a controller function used to send an OTP to the user's email address
 * @throws {BadRequest} - if the request body is invalid
 * @throws {NotFound} - if the user does not exist
 * @throws {ServiceUnavailable} - if the email could not be sent
 * @throws {InternalServerError} - if an error occurs while sending the email
 * @throws {InternalServerError} - if an error occurs while saving the OTP in redis
 */
const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate request body
		const { error, value } = validateForgotPassword(req.body);
		if (error) {
			throw errors.BadRequest('msg_invalid_request_body_format');
		}

		// Destructure the validated request body
		const { email } = value;

		// Check if user exists
		const user = await User.findOneByEmail(email);
		if (!user) {
			throw errors.NotFound('msg_user_not_found');
		}

		// Generate OTP
		const otp = otpGenerator.generate(6, {
			digits: true,
			lowerCaseAlphabets: false,
			upperCaseAlphabets: false,
			specialChars: false,
		});

		// Save OTP in redis
		await Redis.cache.otpForPasswordReset(email, {
			otp,
		});

		const job = await queueEmails(EmailTypes.passwordReset, { otp });

		if (!job) {
			throw errors.ServiceUnavailable('msg_verification_email_not_sent');
		}

		req.response = {
			status: 200,
			message: 'msg_verification_email_sent',
		};

		return next();
	} catch (error) {
		return next(error);
	}
};

export default forgotPassword;
