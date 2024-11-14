const { User } = require('../model');

export interface DBUser {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	hash: string;
	provider_id?: string;
	provider?: string;
}

export interface NewDBUser {
	email: string;
	first_name: string;
	last_name: string;
	hash: string;
	provider_id?: string;
	provider?: string;
}

/**
 * @param {string} email - email of the user
 * @returns {Promise<User>} - user with the given email
 * @throws {Error} - if user with the given email is not found
 * @throws {Error} - if there is an error in the database
 * @description - finds a user by email
 */
export const findOneByEmail = async (email: string): Promise<DBUser> => await User.findOne({ where: { email } });

/**
 * @param {Object} user - user object
 * @returns {Promise<User>} - newly created user
 * @throws {Error} - if there is an error in the database
 * @description - creates a new user from the given user object
 */
export const createNew = async (user: NewDBUser): Promise<DBUser> => await User.create(user);

/**
 * @param {string} email - email of the user
 * @param {string} hash - new hash of the user's password
 * @returns {Promise<User>} - updated user
 * @throws {Error} - if there is an error in the database
 * @description - update a user's password given their email
 */
export const updatePassword = async (email: string, hash: string): Promise<DBUser> =>
	await User.update({ hash }, { where: { email } });

/**
 * @param {Object} user - user object
 * @returns {Promise<User>} - updated user
 * @throws {Error} - if there is an error in the database
 * @description - updates a user's information given their id
 */
export const update = async (user: DBUser): Promise<DBUser> => await User.update(user, { where: { id: user.id } });

/**
 * @param {string} email - email of the user
 * @returns {Promise<User>} - deleted user
 * @throws {Error} - if there is an error in the database
 * @description - deletes a user given their email
 */
export const upsert = async ({ email, first_name, last_name, provider_id }: DBUser): Promise<[DBUser, boolean]> =>
	await User.findOrCreate({
		where: { email },
		defaults: {
			email,
			first_name,
			last_name,
			provider_id,
		},
	});

export const remove = async (id: number) => await User.destroy({ where: { id } });
