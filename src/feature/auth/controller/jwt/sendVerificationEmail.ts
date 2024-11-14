import { Request, Response, NextFunction } from 'express';
import errors from 'http-errors';
import bcrypt from 'bcrypt';
import * as Redis from '../../../../redis';
import { User } from '../../../../db/repository';
import { validateSendVerificationEmail } from '../../schema';
import { queueEmails } from '../../helper';
import { EmailTypes } from '../../../../mail';

function generateOTP(len: number): string {
	// Define the possible characters for the OTP
	const chars = '0123456789';

	// Define the length of the OTP
	let otp = '';

	// Generate the OTP
	for (let i = 0; i < len; i++) {
		otp += chars[Math.floor(Math.random() * chars.length)];
	}
	return otp;
}

/**
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @param {Function} next - the next middleware function
 * @returns {Promise<Object>} - the response object
 * @description a controller function used to send an email verification email to a user
 * @throws {BadRequest} - if any of the required fields are missing
 * @throws {Conflict} - if the user already exists
 * @throws {ServiceUnavailable} - if the email could not be sent
 * @throws {InternalServerError} - if an error occurs while hashing the password
 * @throws {InternalServerError} - if an error occurs while caching the data in redis
 * @throws {InternalServerError} - if an error occurs while sending the email
 */
const sendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		// Validate request body
		const { error, value } = validateSendVerificationEmail(req.body);

		// Check if there are any validation errors
		if (error) {
			throw errors.BadRequest('msg_invalid_request_body_format');
		}

		// Destructure the validated request body
		const { first_name: firstName, last_name: lastName, email, password } = value;

		// Check if user already exists
		const userExists = await User.findOneByEmail(email);
		if (userExists) {
			throw errors.Conflict('msg_user_already_exists');
		}

		// Generate OTP
		const otp = generateOTP(6);

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Cache OTP for User in Redis with TTL of 1 Hour
		const dataToCache = {
			first_name: firstName,
			last_name: lastName,
			email,
			hash: hashedPassword,
			otp,
		};
		await Redis.cache.forEmailVerification(email, dataToCache, Redis.CachePolicy.EmailVerification);

		// Generate email verification token
		// const verificationToken = await generateVerificationToken({ email, otp });

		// Queue email to be sent
		const job = await queueEmails(EmailTypes.emailVerification, { email, firstName, otp });

		if (!job) {
			throw errors.ServiceUnavailable('msg_verification_email_not_sent');
		}

		// Set response object
		req.response = {
			status: 201,
			message: 'msg_verification_email_sent',
		};

		return next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
};

export default sendVerificationEmail;
