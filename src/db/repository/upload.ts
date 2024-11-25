const { Uploads, UserLikes } = require('../model');
const Sequelize = require('sequelize');

export interface DBUpload {
	id: number;
	name: string;
	type: string;
	user_id: number;
	path: string;
}

export interface NewDBUpload {
	name: string;
	type: string;
	user_id: number;
	path: string;
}

export interface UserUploads extends DBUpload {
	UserLikes: [any];
}

export enum UploadType {
	IMAGE = 'image',
	VIDEO = 'video',
	AUDIO = 'audio',
	DOCUMENT = 'document',
}

/**
 * Creates a new upload from the given upload object
 *
 * @param {Object} upload - upload object
 * @returns {Promise<Upload>} - newly created upload
 * @throws {Error} - if there is an error in the database
 */
export const addUpload = async (upload: NewDBUpload): Promise<DBUpload> => {
	console.log('upload:', upload);
	return await Uploads.create(upload);
};

/**
 * Finds an upload by id
 *
 * @param {number} id - id of the upload
 * @returns {Promise<Upload>} - upload with the given id
 * @throws {Error} - if upload with the given id is not found
 * @throws {Error} - if there is an error in the database
 */
export const findUploadById = async (id: number): Promise<DBUpload> => await Uploads.findByPk(id);

/**
 * Finds all uploads by user id
 *
 * @param {string} user_id - id of the user
 * @returns {Promise<Upload[]>} - uploads with the given user id
 * @throws {Error} - if there is an error in the database
 */
export const findUploadsByUserId = async (
	user_id: string,
	limit: number = 10,
	offset: number = 0
): Promise<UserUploads[]> => {
	const _limit = Math.max(limit, 10);
	const _offset = Math.max(offset, 0);

	return await Uploads.findAll({
		where: { user_id },
		include: [
			{
				model: UserLikes,
				attributes: ['id', 'upload_id', 'user_id'],
				required: false, // Ensures an outer join
				on: {
					upload_id: Sequelize.col('Uploads.id'), // Defines the join condition
				},
				where: { user_id },
			},
		],
		limit: _limit,
		offset: _offset,
	});
};

/**
 * Deletes an upload by id
 *
 * @param {number} id - id of the upload
 * @returns {Promise<Upload>} - deleted upload
 * @throws {Error} - if there is an error in the database
 */
export const deleteUpload = async (id: number): Promise<DBUpload> => {
	const upload = await Uploads.findByPk(id);
	await upload.destroy();
	return upload;
};
