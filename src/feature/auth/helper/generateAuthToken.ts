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
const generateAuthTokens = async (user: { id: number; email: string }) => {
	// Generate device identifier to be able to sign in from multiple devices
	const deviceId = crypto.randomBytes(16).toString('hex');

	// Generate access token
	const accessToken = jwt.sign(
		{
			id: user.id,
			email: user.email,
			device_id: deviceId,
		},
		process.env.JWT_ACCESS_TOKEN_SECRET || '',
		{
			expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
		}
	);

	// Generate refresh token
	const refreshToken = jwt.sign(
		{
			id: user.id,
			email: user.email,
			device_id: deviceId,
		},
		process.env.JWT_REFRESH_TOKEN_SECRET || '',
		{
			expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
		}
	);

	// Verify user device count
	const userDeviceCount = await Redis.call.countOfTokensForUserDevices(user);

	// If user device count is greater than a certain threshold, delete the oldest device
	if (userDeviceCount >= (process.env.MAX_ALLOWED_DEVICES || 2)) {
		await Redis.invalidate.tokensForUserDevices(user);
	}

	// Store the refresh token in redis
	await Redis.cache.tokenForDeviceForUser(user, {
		deviceId,
		refreshToken,
	});

	// Return tokens
	return { accessToken, refreshToken };
};

export default generateAuthTokens;
