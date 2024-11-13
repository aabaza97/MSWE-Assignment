import { Request } from 'express';

declare module 'express' {
	interface Request {
		response?: {
			status: number;
			message: string;
			data?: object;
		};
		uploadInfo?: object;
	}
}
