import RedisClient from '../config/redis.config';
import { CacheKey } from './consts';

/**
 * @param {String} emailKey - the key used to store the email verification data
 * @description a wrapper function used to get the email verification data from redis
 * @returns {Promise<Object>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while reading the data from redis
 */
export const forEmailVerification = async (emailKey: string): Promise<object> =>
	await RedisClient.hGetAll(`${CacheKey.EmailVerification}:${emailKey}`).then((user) => user);

/**
 * @param {Object} user - the user object
 * @description a wrapper function used to get the count of tokens for user devices from redis
 * @returns {Promise<Object>} - the count of tokens for user devices
 * @throws {InternalServerError} - if an error occurs while reading the data from redis
 */
export const countOfTokensForUserDevices = async (user: { id: string | number }): Promise<any> =>
	await RedisClient.hLen(`${CacheKey.TokenForUserDevice}:${user.id.toString()}`);

/**
 * @param {Object} user - the user object
 * @param {String} deviceId - the device id
 * @description a wrapper function used to get the token for user for device from redis
 * @returns {Promise<String>} - the token for user for device
 * @throws {InternalServerError} - if an error occurs while reading the data from redis
 */
export const tokenForUserForDevice = async (
	user: { id: string | number },
	deviceId: string
): Promise<string | undefined> => await RedisClient.hGet(`${CacheKey.TokenForUserDevice}:${user.id}`, deviceId);

/**
 * @param {String} emailKey - the key used to store the password reset data
 * @description a wrapper function used to get the password reset data from redis
 * @returns {Promise<object>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while reading the data from redis
 */
export const otpForPasswordReset = async (emailKey: string): Promise<object> =>
	await RedisClient.hGetAll(`${CacheKey.PasswordReset}:${emailKey}`).then((data) => data);

/**
 * @param {String} emailKey - the key used to store the password reset data
 * @description a wrapper function used to get the password reset data from redis
 * @returns {Promise<string>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while reading the data from redis
 */
export const otpVerificationForPasswordReset = async (emailKey: string): Promise<string | undefined> =>
	await RedisClient.hGet(`${CacheKey.PasswordReset}:${emailKey}`, 'verified').then((data) => data);
