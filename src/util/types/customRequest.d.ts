import { Request } from 'express';

declare module 'express' {
	interface Request {
		response?: {
			status: number;
			message: string;
			data?: object;
		};
		uploadInfo?: {
			storage?: string;
			uploadPath?: string;
			filename?: string;
			uploadType?: string;
		};
		user?: {
			id?: number;
			email?: string;
			device_id?: string;
		};
	}
}
