import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

type Destination = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, destination: string) => void | undefined
) => void;

type Filename = (
	req: Request,
	file: Express.Multer.File,
	callback: (error: Error | null, filename: string) => void
) => void;

type FileFilter = (file: Express.Multer.File, callback: FileFilterCallback) => void;

/**
 * @description storage instance for file upload
 * @param {Function} destination – the function providing destination folder
 * @param {Function} filename – the function providing file name
 * @param {Function} fileFilter – the function providing file filter
 * @param {number} fileSize – the maximum file size	(default: 20MB)
 * @param {number} fileLimit – the maximum file limit (default: 1)
 */
const uploader = (
	destination: Destination,
	filename: Filename,
	fileFilter: FileFilter,
	fileSize: number = 20 * 1024 * 1024,
	fileLimit: number = 1
) =>
	multer({
		storage: multer.diskStorage({
			destination,
			filename,
		}),
		limits: {
			fileSize: fileSize, // max of 2MB per file
			files: fileLimit, // max of 6 images to upload per request
		},
		fileFilter: (req, file, callback) => fileFilter(file, callback),
	});

export default uploader;
