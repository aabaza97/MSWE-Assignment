import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as Redis from '../../../redis';

/**
 * @param {Object} user - the user object
 * @description a wrapper function used to generate the auth tokens
 * @returns {Promise<Object>} - the auth tokens
 * @throws {InternalServerError} - if an error occurs while generating the auth tokens
 * @throws {InternalServerError} - if an error occurs while interacting with redis
 */
const generateVerificationToken = async (data: { email: string; otp: string | number }): Promise<string> => {
	// Generate verification token
	const verificationToken = jwt.sign(
		{
			email: data.email,
			otp: data.otp,
		},
		process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET || '',
		{
			expiresIn: process.env.JWT_EMAIL_VERIFICATION_TOKEN_EXPIRY,
		}
	);

	// Return token
	return verificationToken;
};

export default generateVerificationToken;
