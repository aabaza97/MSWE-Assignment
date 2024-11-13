// declare error module for custom error handling
import { Error } from 'express';

declare module 'express' {
	interface Error {
		name: string;
		status?: number;
		message?: string;
	}
}
