const { UserLikes } = require('../model');

export interface DBLike {
	user_id: number;
	upload_id: number;
}

/**
 * Creates a new like from the given like object
 *
 * @param {Object} like - like object
 * @returns {Promise<Like>} - newly created like
 * @throws {Error} - if there is an error in the database
 */
export const like = async (like: DBLike): Promise<DBLike> => await UserLikes.create(like);

/**
 * Deletes a like by user id and upload id
 *
 * @param {number} user_id - id of the user
 * @param {number} upload_id - id of the upload
 * @returns {Promise<void>} - nothing
 * @throws {Error} - if there is an error in the database
 */
export const unlike = async (user_id: number, upload_id: number): Promise<void> =>
	await UserLikes.destroy({ where: { user_id, upload_id } });
