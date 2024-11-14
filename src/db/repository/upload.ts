const { Upload } = require('../model');

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
export const addUpload = async (upload: NewDBUpload): Promise<DBUpload> => await Upload.create(upload);

/**
 * Finds an upload by id
 *
 * @param {number} id - id of the upload
 * @returns {Promise<Upload>} - upload with the given id
 * @throws {Error} - if upload with the given id is not found
 * @throws {Error} - if there is an error in the database
 */
export const findUploadById = async (id: number): Promise<DBUpload> => await Upload.findByPk(id);

/**
 * Finds all uploads by user id
 *
 * @param {string} user_id - id of the user
 * @returns {Promise<Upload[]>} - uploads with the given user id
 * @throws {Error} - if there is an error in the database
 */
export const findUploadsByUserId = async (user_id: string): Promise<DBUpload[]> =>
	await Upload.findAll({ where: { user_id } });

/**
 * Deletes an upload by id
 *
 * @param {number} id - id of the upload
 * @returns {Promise<Upload>} - deleted upload
 * @throws {Error} - if there is an error in the database
 */
export const deleteUpload = async (id: number): Promise<DBUpload> => {
	const upload = await Upload.findByPk(id);
	await upload.destroy();
	return upload;
};
