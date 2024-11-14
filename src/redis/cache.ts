import errors from 'http-errors';
import { RedisClient } from '../config';
import { CachePolicy, CacheKey } from './consts';

interface TokenForDeviceForUserData {
	deviceId: string;
	refreshToken: string;
}

/**
 * @param {String} emailKey - the key used to store the email verification data
 * @param {Object} data - the data to be stored
 * @param {Number} withCachePolicy - the cache policy in seconds (optional)
 * @returns {Promise<object>} - the result of the redis operation
 * @description a wrapper function used to store the email verification data in redis
 */
export const forEmailVerification = async (
	emailKey: string,
	data: object,
	withCachePolicy?: number
): Promise<object> => {
	await RedisClient.hSet(`${CacheKey.EmailVerification}:${emailKey}`, { ...data });
	if (withCachePolicy) {
		await RedisClient.expire(`${CacheKey.EmailVerification}:${emailKey}`, withCachePolicy);
	}

	// Return the data stored in redis
	return await RedisClient.hGetAll(`${CacheKey.EmailVerification}:${emailKey}`);
};

/**
 * @param {Object} user - the user object
 * @param {Object} data - the data to be stored (deviceId, refreshToken)
 * @param {String} data.deviceId - the device id
 * @param {String} data.refreshToken - the refresh token
 * @param {Number} withCachePolicy - the cache policy in seconds (optional)
 * @description a wrapper function used to store the token for device for user data in redis
 * @returns {Promise<object>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while storing the data in redis
 */
export const tokenForDeviceForUser = async (
	user: { id: string | number },
	data: TokenForDeviceForUserData,
	withCachePolicy?: number
): Promise<object> => {
	const { deviceId, refreshToken } = data;
	if (!(deviceId && refreshToken)) {
		throw errors.InternalServerError('Invalid token data');
	}

	await RedisClient.hSet(`${CacheKey.TokenForUserDevice}:${user.id}`, deviceId, refreshToken);

	if (withCachePolicy) {
		await RedisClient.expire(`${CacheKey.TokenForUserDevice}:${user.id}`, withCachePolicy);
	}

	// Return the data stored in redis
	return await RedisClient.hGetAll(`${CacheKey.TokenForUserDevice}:${user.id}`);
};

/**
 * @param {String} emailKey - the key used to store the password reset data
 * @param {Object} data - the data to be stored (otp)
 * @param {Number} withCachePolicy - the cache policy in seconds (optional) - default is 5 minutes
 * @returns {Promise<void>} - the result of the redis operation
 * @description a wrapper function used to store the password reset data in redis
 * @throws {InternalServerError} - if an error occurs while storing the data in redis
 */
export const otpForPasswordReset = async (
	emailKey: string,
	data: { otp: string | number },
	withCachePolicy = CachePolicy.ForgotPassword
): Promise<void> => {
	const { otp } = data;
	await RedisClient.hSet(`pr:${emailKey}`, {
		otp,
		verified: 'false',
	});

	if (withCachePolicy) {
		await RedisClient.expire(`pr:${emailKey}`, withCachePolicy);
	}
};

/**
 * @param {String} emailKey - the key used to store the password reset data
 * @description a wrapper function used to update the verified status of the password reset data in redis
 * @returns {Promise<void>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while storing the data in redis
 */
export const otpVerificationForPasswordReset = async (emailKey: string): Promise<void> => {
	await RedisClient.hSet(`pr:${emailKey}`, {
		verified: 'true',
	});
};
