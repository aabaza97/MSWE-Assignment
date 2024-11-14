import RedisClient from '../config/redis.config';
import { CacheKey } from './consts';

/**
 * @param {String} emailKey - the key used to store the email verification data
 * @description a wrapper function used to delete the email verification data from redis
 * @returns {Promise<number>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while deleting the data from redis
 */
export const dataForEmailVerification = async (emailKey: string): Promise<number> =>
	await RedisClient.del(`${CacheKey.EmailVerification}:${emailKey}`);

/**
 * @param {Object} user - the user object
 * @description a wrapper function used to delete the token for device for user data from redis
 * @returns {Promise<number>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while deleting the data from redis
 */
export const tokensForUserDevices = async (user: { id: string | number }): Promise<number> =>
	await RedisClient.del(`${CacheKey.TokenForUserDevice}:${user.id.toString()}`);

/**
 * @param {Object} user - the user object
 * @param {String} device_id - the device id
 * @description a wrapper function used to delete the token for device for user data from redis
 * @returns {Promise<number>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while deleting the data from redis
 */
export const tokenForUserDevice = async (user: { id: string | number }, deviceId: string): Promise<number> =>
	await RedisClient.hDel(`${CacheKey.TokenForUserDevice}:${user.id}`, deviceId);

/**
 * @param {String} emailKey - the key used to store the password reset data
 * @description a wrapper function used to delete the password reset data from redis
 * @returns {Promise<Object>} - the result of the redis operation
 * @throws {InternalServerError} - if an error occurs while deleting the data from redis
 */
export const otpForPasswordReset = async (emailKey: string): Promise<number> =>
	await RedisClient.del(`${CacheKey.PasswordReset}:${emailKey}`);
